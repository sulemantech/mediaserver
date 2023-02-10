const express = require('express');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const app = express();
const port = 3000;

const maxFileSize = 1024 * 1024 * 100; // 100 MB

app.use(express.json());

app.post('/upload', (req, res) => {
  const contentLength = req.headers['content-length'];
  if (contentLength > maxFileSize) {
    return res.status(400).json({ message: 'File size too large' });
  }

  const filename = req.body.filename;
  const filepath = path.join(__dirname, 'files', filename);
  const writeStream = fs.createWriteStream(filepath);

  req
    .pipe(zlib.createGunzip())
    .pipe(writeStream);

  req.on('end', () => {
    res.json({ message: 'File uploaded successfully' });
  });

  writeStream.on('error', (err) => {
    res.status(500).json({ message: err.message });
  });
});

app.get('/download', (req, res) => {
  const filename = req.query.filename;
  const filepath = path.join(__dirname, 'files', filename);
  const readStream = fs.createReadStream(filepath);

  res.setHeader('Content-disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Encoding', 'gzip');

  readStream
    .pipe(zlib.createGzip())
    .pipe(res);

  readStream.on('error', (err) => {
    res.status(500).json({ message: err.message });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
