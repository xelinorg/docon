const http = require('http');

const baseOptions = {
    socketPath: '/run/docker.sock',
};

const buildParams = (params) => {
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

const httpDo = (options, params) => {
    return new Promise((resolve, reject) => {
        const doOptions = { 
            ...baseOptions,
            ...options,
            path: options.path.concat(buildParams(params))
        };
        console.dir(doOptions, { depth: 4 });
        const request = http.request(doOptions, (response) => {
            console.log(`Received response: ${response.statusCode} ${response.statusMessage}`);
            // Process the response
            response.on('error', (err) => {
                reject(err);
            });
            const resdata = [];
            response.on('data', chunk => {
                console.log(chunk.toString());
                resdata.push(chunk)
            })
            response.on('end', () => {
                const rawdata = resdata.toString();
                resolve(JSON.parse(rawdata));
            });
        });

        request.end();
    })
}

const httpDoStream = (options, params) => {
    return new Promise((resolve, reject) => {
        const doOptions = {
            ...baseOptions,
            ...options,
            path: options.path.concat(buildParams(params))
        };
        console.dir(doOptions, { depth: 4 });
        const request = http.request(doOptions, (response) => {
            console.log(`Received response: ${response.statusCode} ${response.statusMessage}`);
            console.log(`Received response headers: ${JSON.stringify(response.headers)}`);
            // Process the response
            response.on('error', (err) => {
                reject(err);
            });
        });

        request.on('upgrade', (res, socket, head) => {
            console.log(`Received response: ${res.statusCode} ${res.statusMessage}`);
            console.log(`Received response headers: ${JSON.stringify(res.headers)}`);
            console.log(`Received response head: ${head}`);
            const resdata = [];
            socket.on('data', chunk => {
                const frames = readStream(chunk);
                console.log('frames ', frames);
                resdata.push(...frames);
            });
            socket.on('error', (err) => {
                console.log('httpDoStream on socket error', err);
            });
            socket.on('end', () => {
                resolve(resdata);
            });
        })

        request.end();
    })
}

module.exports.listContainers = (options = { params: { all: false } }) => {
    const localOptions = {
        ...baseOptions,
        path: '/containers/json',
        method: 'GET'
    };

    httpDo(localOptions, options.params).then(
        res => {
            console.dir(res, { depth: 4 });
        },
        err => {
            console.error(err);
        }
    )
}


module.exports.attach = (id = '', options = {}) => {

    const localOptions = {
        path: `/containers/${id}/attach`,
        method: 'POST',
        headers: {
            Upgrade: 'tcp',
            Connection: 'Upgrade'
        }
    };

    httpDoStream(localOptions, options).then(
        res => {
            console.dir(res, { depth: 4 });
        },
        err => {
            console.error(err);
        }
    )
}

module.exports.logs = (id = '', options = {}) => {

    const localOptions = {
        path: `/containers/${id}/logs`,
        method: 'GET',
    };

    httpDo(localOptions, options).then(
        res => {
            console.dir(res, { depth: 4 });
        },
        err => {
            console.error(err);
        }
    )
}

module.exports.top = (id = '', options = {}) => {

    const localOptions = {
        path: `/containers/${id}/top`,
        method: 'GET',
    };

    httpDo(localOptions, options).then(
        res => {
            console.dir(res, { depth: 4 });
        },
        err => {
            console.error(err);
        }
    )
}

module.exports.monitor = (options = {}) => {

    const localOptions = {
        path: `/events`,
        method: 'GET',
    };

    httpDo(localOptions, options).then(
        res => {
            console.dir(res, { depth: 4 });
        },
        err => {
            console.error(err);
        }
    )
}