import { httpDo, httpDoStream } from './outgoing.js';
import { default as o } from './option.js';

const containerList = (options = { params: { all: false } }) => {
    return httpDo(o.container.list(), options.params);
};

const containerAttach = (id = '', options = {}) => {
    return httpDoStream(o.container.attach(id), options);
};

const containerLogs = (id = '', options = {}) => {
    return httpDo(o.container.logs(id), options.params);
};

const conatinerTop = (id = '', options = {}) => {
    return httpDo(o.container.top(id), options);
};

const containerArchiveGet = (id = '', options = {}) => {
    return httpDo(o.container.archiveGet(id), options.params);
};

const containerArchiveInfo = (id = '', options = {}) => {
    return httpDo(o.container.archiveInfo(id), options.params);
};

const container = {
    list: containerList,
    attach: containerAttach,
    logs: containerLogs,
    top: conatinerTop,
    archiveGet: containerArchiveGet,
    archiveInfo: containerArchiveInfo
};

export { container as default };