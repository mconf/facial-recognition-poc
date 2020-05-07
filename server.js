// Node modules
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const logger = require('morgan');

// Local modules
import * as faceLib from './faceLib';

// Express config
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.use(logger('dev'));

// Multer config (For file upload)
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    let dir = 'uploads/';
    dir += req.path.includes('reference') ? 'reference' : 'query';
    try {
      await fs.promises.mkdir(dir, { recursive: true });
    } catch (err) {
      return cb(err, null);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    let ext = file.mimetype.split('/').pop();
    let name = req.params.name;
    if (req.path.includes('query')) {
      name += '-' + Date.now();
    }
    cb(null, name + '.' + ext);
  },
});
const upload = multer({ storage: storage });

// Routes
// Api
app.get('/ping', function (req, res) {
  return res.send('pong');
});

// Reference Images
// List all
app.get('/referenceImages', async function (req, res, next) {
  if (!fs.existsSync('./uploads/reference')) {
    return res.json([]);
  }
  try {
    let files = await fs.promises.readdir('./uploads/reference');
    return res.json(files);
  } catch (err) {
    next(err);
  }
});
// Download image
app.get('/referenceImages/:name', (req, res) => {
  let { name } = req.params;
  res.sendFile(path.join(__dirname, './uploads/reference/' + name));
});
// Upload image
app.post('/referenceImages/:name', upload.single('file'), function (req, res) {
  let { filename, originalname } = req.file;
  return res.json({ savedName: filename, originalName: originalname });
});

// Query images
// Download image
app.get('/queryImages/:name', (req, res) => {
  let { name } = req.params;
  res.sendFile(path.join(__dirname, './uploads/query/' + name));
});
// Upload image
app.post('/queryImages/:name', upload.single('file'), async function (
  req,
  res,
  next
) {
  let { file } = req;
  let queryPath = file.path;
  let referenceName = req.params.name;
  let referencePath = './uploads/reference/' + referenceName;
  try {
    let distance = await faceLib.faceRecognition(queryPath, referencePath);
    return res.json({
      savedName: file.filename,
      originalName: file.originalname,
      distance,
    });
  } catch (err) {
    next(err);
  }
});

// Client
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Init
console.log('Initing server...');
faceLib.init();
const server = app.listen(process.env.PORT || 8080, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);
});
