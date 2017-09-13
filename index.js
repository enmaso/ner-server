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

const HTTP_PORT = process.argv[2] || 9000;
const NER_PORT = process.argv[3] || 8080;

const child = childProcess.spawn('./bin/server.sh', [`${NER_PORT}`]);

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', data => {
    body += data;
    if (body.length > 1e6) {
      req.connection.destroy();
    }
  });
  req.on('end', () => {
    let socket = new net.Socket();
    res.setHeader('Content-Type', 'application/json');
    socket.connect(NER_PORT, 'localhost', () => {
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

server.listen(HTTP_PORT, (err) => {
  console.log(`server listening on ${HTTP_PORT}`);
});

process.on('exit', () => {
  child.kill('SIGINT');
});
process.on('SIGINT', () => {
  process.exit(2);
});
process.on('uncaughtException', e => {
  console.log(e.stack);
  process.exit(99);
});
