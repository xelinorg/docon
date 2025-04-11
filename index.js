import { httpDo } from './outgoing.js';
import  { default as o } from './option.js';
import container from'./container.js';
import image from './image.js';


const monitor =  (options = {}) => {
    return httpDo(o.monitor(), options);
};

export {
    container,
    image,
    monitor
};
