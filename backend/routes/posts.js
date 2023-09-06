const express = require('express');
const Post = require("../models/post");  //mongoose models
//npm i --save multer for image uploads (extract incoming files)
const multer = require('multer');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimeType];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    callback(null, "backend/images")  //relative to server.js folder
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimeType];
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
});

// LocalHost 3000 / posts
//multer will extract an image in the post
router.post('', checkAuth,
  multer({storage: storage}).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');  //provided by multer to get url from images folder in the backend
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId
    });
    // saves new entry w/ that data and automatically generated id
    post.save().then(result => {
      res.status(201).json({
        success: true,
        message: "Post added successfully",
        // or you can use spread operator ...result and overwrite all the results (...result, except for id that is not part of it)
        post: {
          id: result._id,
          title: result.title,
          content: result.content,
          imagePath: result.imagePath
        }
      });
    });
  });

//mongodb stores ids with and underscore
router.put("/:id", checkAuth, multer({storage: storage}).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');  //provided by multer to get url from images folder in the backend
      imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    //authorization resources
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({message: "update success", success: true});
      } else {
        res.status(401).json({message: 'not authorized', success: false});
      }
    });
  });

//need to download body-parser from npm to use posts (npm i --save body-parser)
router.get("", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Success", success: true, posts: documents
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'post not found', success: false})
    }
  });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    console.log('result: ', result);
    if (result.deletedCount> 0) {
      res.status(200).json({message: "post deleted", success: true});
    } else {
      res.status(401).json({message: 'not authorized', success: false});
    }
  });
});

module.exports = router;
