const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const Photo = require('./models/photo');
const app = express();

//Connect to MongoDB
mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Template engine
app.set('view engine', 'ejs');

//Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

//Routes
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', {
    photos,
  });
});

app.get('/photos/:id', async (req, res) => {
  //console.log(req.params.id)
  //res.render('about');
  const photo = await Photo.findById(req.params.id);
  res.render('photo', { photo });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  //await Photo.create(req.body);
  //res.redirect('/');

  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;

  uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
    res.redirect('/');
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
