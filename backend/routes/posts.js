const express = require('express');
const postController = require('../controllers/posts');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

// LocalHost 3000 / posts
router.post('', checkAuth,
  extractFile, postController.createPost);

//mongodb stores ids with and underscore
router.put("/:id", checkAuth, extractFile, postController.updatePost);

//need to download body-parser from npm to use posts (npm i --save body-parser)
router.get("", postController.getPosts);

router.get('/:id', postController.getPost);

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router;
