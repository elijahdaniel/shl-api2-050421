// require your server and launch it here
const server = require('./api/server')
const PORT = 5555

server.listen(PORT, () => console.log(`listening:${PORT}`))
