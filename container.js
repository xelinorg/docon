const { httpDo, httpDoStream } = require('./outgoing');
const o = require('./option');

const containerList = (options = { params: { all: false } }) => {
    return httpDo(o.container.list(), options.params)
};

const containerAttach = (id = '', options = {}) => {
    return httpDoStream(o.container.attach(id), options)
}

const containerLogs = (id = '', options = {}) => {
    return httpDo(o.container.logs(id), options.params)
};

const conatinerTop = (id = '', options = {}) => {
    return httpDo(o.container.top(id), options)
};

const containerArchiveGet = (id = '', options = {}) => {
    return httpDo(o.container.archiveGet(id), options.params)
};

const containerArchiveInfo = (id = '', options = {}) => {
    return httpDo(o.container.archiveInfo(id), options.params)
};

module.exports = {
    list: containerList,
    attach: containerAttach,
    logs: containerLogs,
    top: conatinerTop,
    archiveGet: containerArchiveGet,
    archiveInfo: containerArchiveInfo
}