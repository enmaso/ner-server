const http = require('http');
const net = require('net');
const path = require('path');
const childProcess = require('child_process');

const config = require('./config');

childProcess.exec('java -version', (err, stdout, stderr) => {
  if(err) {
    console.error('Java Runtime Required');
    process.exit(1);
  }
});

// const HTTP_PORT = process.argv[2] || 9000;
// const NER_PORT = process.argv[3] || 8080;

const child = childProcess.spawn('./bin/server.sh', [`${config.ner.port}`]);

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', data => {
    body += data;
    // Too much POST data, kill the connection!
    // 2e6 === 2 * Math.pow(10, 6) === 2 * 1000000 ~~~ 2MB
    if (body.length > 2e6) {
      req.connection.destroy();
    }
  });
  req.on('end', () => {
    let socket = new net.Socket();
    res.setHeader('Content-Type', 'application/json');
    socket.connect(config.ner.port, 'localhost', () => {
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

server.listen(config.web.port, (err) => {
  console.log(`server listening on ${config.web.port}`);
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
