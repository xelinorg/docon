const { httpDo, httpDoStream } = require('./outgoing');
const o = require('./option');

const containerList = (options = { params: { all: false } }) => {
    return httpDo(o.container.list(), options.params)
};

const containerAttach = (id = '', options = {}) => {
    return httpDoStream(o.container.attach(id), options)
}

const containerLogs = (id = '', options = {}) => {
    return httpDo(o.container.logs(id), options)
};

const conatinerTop = (id = '', options = {}) => {
    return httpDo(o.container.top(id), options)
};

module.exports = {
    list: containerList,
    attach: containerAttach,
    logs: containerLogs,
    top: conatinerTop
}