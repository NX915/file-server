const net = require('net');
const fs = require('fs');

const server = net.createServer();

let fileMode = false;
server.on('connection', (client) => {
  console.log('New client connected!');
  client.setEncoding('utf8'); // interpret data as text
  client.on('data', (clientMsg) => {
    console.log('Message from client: ', clientMsg);
    if (clientMsg === 'file mode' && fileMode === true) {
      fileMode = false;
      client.write('Closed file requests!');
    } else if (clientMsg === 'file mode' && fileMode === false) {
      fileMode = true;
      client.write('Ready for file request!');
    } else if (fileMode) {
      fs.readFile(clientMsg, (err, data) => {
        if (err) {
          client.write('Opss! Error No.' + err.errno);
        } else {
          client.write('incomingFile' + data);
          // client.write(data);
          console.log('File ' + clientMsg + ' sent');
        }
      });
    }
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000!');
});