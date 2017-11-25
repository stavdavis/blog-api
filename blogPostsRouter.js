const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

//Adding a couple of entries, so we have something to look at.
// Structure is: title, content, author, publishDate
BlogPosts.create('Title 1', 'This is the content of blog post 1', 'Author 1', Date.now());
BlogPosts.create('Title 2', 'This is the content of blog post 2', 'Author 2', Date.now());
BlogPosts.create('Title 3', 'This is the content of blog post 3', 'Author 3', Date.now());

//Setting up a Get endpoint:
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
})

//Setting up a DELETE endpoint (using id)
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog-post with ID #: \`${req.params.id}\``);
  res.status(204).end();
})

//Setting up a POST endpoint:
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.params.id, req.body.name, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(item);
});

//Setting up a PUT endpoint (using id):
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = [
    'id', 'title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post with id \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});
module.exports = router;