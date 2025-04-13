import http from 'http';

const baseOptions = {
    socketPath: '/run/docker.sock',
};

const buildParams = (params) => {
    if (!params) {
        return '';
    }
    const build = ['?'];
    Object.keys(params).reduce((acc, cur) => {
        let seq;
        if (build.length > 1) {
            seq = '&'.concat(cur, '=', params[cur]);
        } else {
            seq = cur.concat('=', params[cur]);
        }
        acc.push(seq);
        return acc;
    }, build);
    return build.length > 1 ? build.join('') : '';
};

const readStream = (chunk) => {
    const frames = [];
    let index = 0;
    while (index < chunk.length) {
        let index;
        if (frames.length) {
            index = frames.reduce((acc, cur) => {
                acc = acc + cur.header.length + 8;
                return acc;
            }, 0);
        } else {
            index = 0;
        }
        if (index >= chunk.length) break;
        const dataStart = index + 8;

        const frameHeader = {
            type: chunk[index].toString(),
            length: chunk.subarray(index + 4, dataStart).readInt32BE()
        };
        const frame = {
            header: frameHeader,
            data: chunk.subarray(dataStart, dataStart + frameHeader.length).toString()
        };
        index = frameHeader.length + 9;
        frames.push(frame);
    }
    return frames;
};

const httpDo = (options, params, consumer) => {
    return new Promise((resolve, reject) => {
        const doOptions = { 
            ...baseOptions,
            ...options,
            path: options.path.concat(buildParams(params))
        };
        console.dir(doOptions, { depth: 4 });
        const request = http.request(doOptions, (response) => {
            console.log('httpDo response headers', response.headers);
            response.on('error', (err) => {
                reject(err);
            });
            const resdata = [];
            response.on('data', chunk => {
                console.log(chunk.toString());
                if (consumer) {
                    consumer.write(chunk.toString());
                }
                resdata.push(chunk);
            });
            response.on('end', () => {
                const rawdata = resdata.toString();
                resolve(JSON.parse(rawdata));
            });
        });

        request.end();
    });
};

const httpDoStream = (options, params) => {
    return new Promise((resolve, reject) => {
        const doOptions = {
            ...baseOptions,
            ...options,
            path: options.path.concat(buildParams(params))
        };
        console.log('httpDoStream doOptions', doOptions);
        const request = http.request(doOptions, (response) => {
            response.on('error', (err) => {
                reject(err);
            });
        });

        request.on('upgrade', (res, socket) => {
            const resdata = [];
            socket.on('data', chunk => {
                const frames = readStream(chunk);
                console.log('httpDoStream frames', frames);
                resdata.push(...frames);
            });
            socket.on('error', (err) => {
                console.log('httpDoStream on socket error', err);
                reject(err);
            });
            socket.on('end', () => {
                console.log('httpDoStream on end');
                resolve(resdata);
            });
        });

        request.end();
    });
};

export {
    httpDo,
    httpDoStream
};