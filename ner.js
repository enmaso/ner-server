const http = require('http')
const net = require('net')
const spawn = require('child_process').spawn

const hport = process.env.HTTP_PORT || 8080
const tport = process.env.TCP_PORT || 8081

<<<<<<< HEAD
const child = childProcess.spawn('sh', [`${__dirname}/bin/server.sh`, `${nport}`]);
=======
const child = spawn('./bin/server.sh', [`${tport}`])
>>>>>>> 9039c8d2c096bf0b568ca4423d46eebf430077fc
const server = http.createServer((req, res) => {
  let file = ''
  if (req.method !== 'PUT') {
    res.statusCode = 400
    res.end('NER Server (Stanford NER). Please PUT')
  }
  req.on('data', data => {
    file += data
  })
  req.on('end', () => {
    if (file.length === 0) {
      res.statusCode = 400
      return res.end('NER Server (Stanford NER). Please PUT')
    }
    let socket = new net.Socket()
    res.setHeader('Content-Type', 'application/json')
    socket.connect(tport, 'localhost', () => {
      socket.write(file.replace(/\r?\n|\r|\t/g, ' ') + '\n')
    })
    socket.on('data', data => {
      let regexp = /<([A-Z]+?)>(.+?)<\/\1>/g
      let str = data.toString()
      let tags = {
        LOCATION: [],
        ORGANIZATION: [],
        DATE: [],
        MONEY: [],
        PERSON: [],
        PERCENT: [],
        TIME: []
      }
      let m
      while ((m = regexp.exec(str)) !== null) {
        if (m.index === regexp.lastIndex) {
          regexp.lastIndex++
        }
        tags[m[1]].push(m[2])
      }
      socket.destroy()
      res.end(JSON.stringify(tags))
    })
    socket.on('error', err => {
      res.end(JSON.stringify({
        error: err
      }))
    })
  })
})

process.on('exit', () => {
  console.log('')
  console.log('Exiting Web server')
  console.log('Exiting STANFORD NER server')
  child.kill('SIGINT')
})
process.on('SIGINT', () => {
  process.exit()
})
process.on('uncaughtException', e => {
  console.log(e.stack)
  process.exit(99)
})

server.listen(hport, (err) => {
  if (err) console.log(err)
  console.log(`ner-server listening on ${hport}`)
})

module.exports.listen = () => {
  server.listen.apply(server, arguments)
}

module.exports.close = (callback) => {
  server.close(callback)
}
