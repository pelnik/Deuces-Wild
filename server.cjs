const express = require('express');
const fs = require('node:fs');

const app = express();
const PORT = 3000;

const options = {
  key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem'),
};

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
