const router = require('express').Router();
let Listing = require('../models/listing.model');
const multer = require('multer');

// make sure file is of type image
function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}

// set upload limit
const upload = multer({
  limits: {
      fileSize: 1000*1000,
      files: 5
  },

  fileFilter: fileFilter
})

// Home Page
router.route('/').get((req, res) => {
  Listing.find().sort({ createdAt: -1 })
    .then(listings => res.json(listings))
    .catch(err => res.status(400).json(`Error: ${err}`))
})

// C
router.route('/add').post(upload.array('file'), (req, res) => {
  let images = [];
  req.files.forEach(file => images.push(file.buffer));
  const json = req.body.listing;
  const obj = JSON.parse(json);
  const title = obj.title;
  const address = obj.address;
  const location = { type: 'Point', coordinates: [obj.lat, obj.long] };
  const description = obj.description;
  const price = Number(obj.price);
  const type = obj.type;
  const bed = Number(obj.bed);
  const bath = Number(obj.bath);
  const gender = obj.gender;
  const term = obj.term;
  const length = obj.length;
  const start = Date(obj.start);
  const end = Date(obj.end);
  const included = obj.included;
  const rows = obj.rows;
  const contact = obj.contact;
  const userId = obj.userId;
  
  const newListing = new Listing({
    title,
    address,
    location,
    images,
    description,
    price,
    type,
    bed,
    bath,
    gender,
    term,
    length,
    start,
    end,
    included,
    rows,
    contact,
    userId
  })

  newListing.save()
    .then(listing => res.json(listing))
    .catch(err => res.status(400).json(`Error: ${err}`))
})

// R
router.route('/:id').get((req, res) => {
  Listing.findById(req.params.id)
    .then(listing => res.json(listing))
    .catch(err => res.status(400).json(`Error: ${err}`))
})

// U
router.route('/update/:id').post(upload.any(), (req, res) => {
  let images = [];
  req.files.forEach(file => images.push(file.buffer));
  const json = req.body.listing;
  const obj = JSON.parse(json);
  
  Listing.findById(req.params.id)
    .then(listing => {
        listing.title = obj.title
        listing.address = obj.address
        listing.location = { type: 'Point', coordinates: [obj.lat, obj.long] }
        listing.images = images
        listing.description = obj.description
        listing.price = Number(obj.price)
        listing.type = obj.type
        listing.bed = Number(obj.bed)
        listing.bath = Number(obj.bath)
        listing.gender = obj.gender
        listing.term = obj.term
        listing.length = obj.length
        listing.start = obj.start
        listing.end = obj.end
        listing.included = obj.included
        listing.rows = obj.rows
        listing.contact= obj.contact
        listing.userId = obj.userId

        listing.save()
          .then((listing) => res.json(listing))
          .catch(err => res.status(400).json(`Error: ${err}`)) 
      })
      .catch(err => res.status(400).json(`Error: ${err}`))
})

// D
router.route('/:id').delete((req, res, next) => {
  if (!req.body.user || !req.body.owner || req.body.user !== req.body.owner) {
    res.status(400).json(`Error: ${err}`)
  } else {
    next()
  }
}, (req, res) => {
  Listing.findByIdAndDelete(req.params.id)
    .then(listing => res.json(listing))
    .catch(err => res.status(400).json(`Error: ${err}`))
})

module.exports = router