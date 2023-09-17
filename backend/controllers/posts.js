const Post = require("../models/post");  //mongoose models


exports.createPost = (req, res, next) => {
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
  })
    .catch(error => {
      res.status(500).json({message: 'creating post failed', success: false});
    });
}

exports.updatePost = (req, res, next) => {
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
      if (result.modifiedCount > 0) {  // change to n
        res.status(200).json({message: "update success", success: true});
      } else {
        res.status(401).json({message: 'not authorized', success: false});
      }
    })
      .catch(error => {
        res.status(500).json({message: 'couldnt update host', success: false})
      });
  }

  exports.getPosts = (req, res, next) => {
    Post.find().then(documents => {
      res.status(200).json({
        message: "Success", success: true, posts: documents
      });
    })
      .catch(error => {
        res.status(500).json({message: 'fetching post failed', success: false})
      });
  }

  exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: 'post not found', success: false})
      }
    })
      .catch(error => {
        res.status(500).json({message: 'fetching posts failed', success: false})
      });
  }

  exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
      console.log('result: ', result);
      if (result.deletedCount > 0) {
        res.status(200).json({message: "post deleted", success: true});
      } else {
        res.status(401).json({message: 'not authorized', success: false});
      }
    })
      .catch(error => {
        res.status(500).json({message: 'could not delete posts', success: false})
      });
  }
