import { httpDo } from './outgoing.js';
import  { default as o } from './option.js';
import container from'./container.js';
import image from './image.js';


const monitor =  (options = { params: {}, consumer: undefined }) => {
    return httpDo(o.monitor(), options.params, options.consumer);
};

export {
    container,
    image,
    monitor
};
