const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('node:fs');

const app = express();
const PORT = 3000;
const sshPORT = 3443;

const options = {
  key: fs.readFileSync('Keys/key.pem'),
  cert: fs.readFileSync('Keys/cert.pem'),
  passphrase: fs.readFileSync('Keys/passphrase.txt', 'utf8'),
};

app.use(express.static('public'));

http.createServer(app).listen(PORT, () => {
  console.log(`http server listing on ${PORT}`);
});
https.createServer(options, app).listen(3443, () => {
  console.log(`http server listing on ${sshPORT}`);
});

// app.listen(PORT, () => {
//   console.log(`Server listening on port: ${PORT}`);
// });
