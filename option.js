import { default as d } from './dictionary.js';

const buildOption = (method, path) => ({
    method,
    path
});

const opt =  {
    container: {
        attach:  id => ({
            ...buildOption(d.root.POST, d.container.attach(id)),
            headers: d.headers.tcpUpgrade
        }),
        logs: id => buildOption(d.root.GET, d.container.logs(id)),
        top: id => buildOption(d.root.GET, d.container.top(id)),
        list: () => buildOption(d.root.GET, d.container.list()),
        archiveGet: id => buildOption(d.root.GET, d.container.archive(id)),
        archiveInfo: id => buildOption(d.root.HEAD, d.container.archive(id)),
    },
    image: {
        list: () => buildOption(d.root.GET, d.image.list()),
        inspect: id => buildOption(d.root.GET, d.image.inspect(id))
    },
    monitor: () => ({
        ...buildOption(d.root.GET, d.monitor())
    })
};

export { opt as default };