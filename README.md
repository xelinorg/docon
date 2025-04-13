### Test container attach
```
docker run -d --name topdemo alpine top -b
```
Then
```
cd docon
node
const m = await import('./src/index.js');
const runningContainers  = await m.container.list()
const cid = runningContainers.find(rc => rc.Names.includes('/topdemo')).Id
m.conatiner.attach(cid, { stdout: true, stream: true, logs: true , stdin: true})
```
