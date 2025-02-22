const d = require('./dictionary');

const buildOption = (method, path) => ({
    method,
    path
})

module.exports = {
    container: {
        attach:  id => ({
            ...buildOption(d.root.POST, d.container.attach(id)),
            headers: d.headers.tcpUpgrade
        }),
        logs: id => buildOption(d.root.GET, d.container.logs(id)),
        top: id => buildOption(d.root.GET, d.container.top(id)),
        list: () => buildOption(d.root.GET, d.container.list())
    },
    image: {
        list: () => buildOption(d.root.GET, d.image.list()),
        inspect: id => buildOption(d.root.GET, d.image.inspect(id))
    },
    monitor: () => ({
        ...buildOption(d.root.GET, d.monitor())
    })
}