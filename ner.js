const http = require('http');
const net = require('net');
const path = require('path');
const childProcess = require('child_process');

childProcess.exec('java -version', (err, stdout, stderr) => {
  if(err) {
    console.error('Java Runtime Required');
    process.exit(1);
  }
});

const hport = process.env.HPORT || 9000;
const nport = process.env.NPORT || 8080;
const limit = process.env.LIMIT || 2;

const child = childProcess.spawn('./bin/server.sh', [`${nport}`]);
const server = http.createServer((req, res) => {
  let body = '';
  if(req.method !== 'PUT') {
    res.statusCode = 400;
    return res.end('HTTP PUT');
  }
  req.on('data', data => {
    body += data;
    if (body.length > (limit * Math.pow(10, 6))) {
      req.connection.destroy();
    }
  });
  req.on('end', () => {
    if(body.length == 0) {
      res.statusCode = 400;
      return res.end('HTTP PUT');
    }
    let socket = new net.Socket();
    res.setHeader('Content-Type', 'application/json');
    socket.connect(nport, 'localhost', () => {
      socket.write(body.replace(/\r?\n|\r|\t/g, ' ') + '\n');
    });
    socket.on('data', data => {
      let regexp = /<([A-Z]+?)>(.+?)<\/\1>/g;
      let str = data.toString();
      let tags = {
        LOCATION: [],
        ORGANIZATION: [],
        DATE: [],
        MONEY: [],
        PERSON: [],
        PERCENT: [],
        TIME: []
      };
      let m;
      while ((m = regexp.exec(str)) !== null) {
        if (m.index === regexp.lastIndex) {
          regexp.lastIndex++;
        }
        tags[m[1]].push(m[2]);
      }
      socket.destroy();
      res.end(JSON.stringify(tags));
    });
    socket.on('error', err => {
      res.end(JSON.stringify({
        error: err
      }));
    });
  });
});

server.listen(hport, (err) => {
  console.log(`ner-server listening on ${hport}`);
});

process.on('exit', () => {
  console.log('');
  console.log('Exiting Web server');
  console.log('Exiting STANFORD NER server');
  child.kill('SIGINT');
});
process.on('SIGINT', () => {
  process.exit();
});
process.on('uncaughtException', e => {
  console.log(e.stack);
  process.exit(99);
});
