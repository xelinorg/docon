import { httpDo } from './outgoing.js';
import { default as o } from './option.js';

const imageList = (options = { params: { all: false } }) => {
    return httpDo(o.image.list(), options.params);
};

const imageInspect = (id = '', options = {}) => {
    return httpDo(o.image.inspect(id), options);
};

const image = {
    list: imageList,
    inspect: imageInspect
};

export { image as default};