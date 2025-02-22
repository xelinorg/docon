const { httpDo } = require('./outgoing');
const o = require('./option');
const container = require('./container');
const image = require('./image')


const monitor =  (options = {}) => {
    return httpDo(o.monitor(), options)
};

module.exports = {
    container,
    image,
    monitor
}
