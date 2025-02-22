const { httpDo } = require('./outgoing');
const o = require('./option');

const imageList = (options = { params: { all: false } }) => {
    return httpDo(o.image.list(), options.params)
};

const imageInspect = (id = '', options = {}) => {
    return httpDo(o.image.inspect(id), options)
};

module.exports = {
    list: imageList,
    inspect: imageInspect
}