const d = {
    slash: '/',
    containers: 'containers',
    images: 'images',
    attach: 'attach',
    logs: 'logs',
    top: 'top',
    list: 'list',
    json: 'json',
    events: 'events',
    POST: 'POST',
    GET: 'GET'
};

const headers = {
    tcpUpgrade: {
        Upgrade: 'tcp',
        Connection: 'Upgrade'
    }
};

const buildReduce = parts => parts.reduce((acc, cur) => acc.concat(d.slash, cur), '')

module.exports = {
    container: {
        attach: id => buildReduce([d.containers, id, d.attach]),
        logs: id => buildReduce([d.containers, id, d.logs]),
        top: id => buildReduce([d.containers, id, d.top]),
        list: () => buildReduce([d.containers, d.json])
    },
    image: {
        list: () => buildReduce([d.images, d.json]),
        inspect: name => buildReduce([d.images, name, d.json]),
    },
    monitor: () => buildReduce([d.events]),
    root: d,
    headers
}