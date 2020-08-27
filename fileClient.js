const net = require('net');
const readline = require('readline');
const fs = require('fs');
// const { stdin } = require('process');
let file = './downloads/test.txt';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const conn = net.createConnection({
  host: 'localhost', // change to IP address of computer or ngrok host if tunneling
  port: 3000 // or change to the ngrok port if tunneling
});

conn.on('close', () => {
  console.log('Connection Lost!');
  rl.close();
});
conn.on('data', (body) => {
  // console.log('Server says: ', body);
  if (body.includes('incomingFile')) {
    body = body.slice(11);
    fs.writeFile(file, body, {encoding: 'utf8', flag: 'wx'}, (err) => {
      if (err && err.errno !== -17) {
        console.log(err);
      } else if (err && err.errno === -17) {
        rl.question('File exist! enter y to overwrite!  ', (ans) => {
          if (ans === 'y') {
            fs.writeFile(file, body, {encoding: 'utf8'}, (err) => {
              if (err) {
                console.log(err);
              }
              console.log(`Downloaded and saved to ${file}`);
            });
          } else {
            console.log('File not saved!');
          }
        });
      } else {
        console.log(`Downloaded and saved to ${file}`);
      }
    });
  } else {
    console.log('Server says: ', body);
  }
});

rl.on('line', (data) => {
  let splitInput = data.split(' ');
  if (splitInput[0] === 'path') {
    file = splitInput[1];
  } else if (splitInput[0] === 'get') {
    file = splitInput[2];
    conn.write(splitInput[1]);
  } else {
    conn.write(data);
  }
});


conn.setEncoding('utf8'); // interpret data as text