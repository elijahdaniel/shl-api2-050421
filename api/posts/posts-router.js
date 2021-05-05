// implement your posts router here
const router = require('express').Router()
const db = require('./posts-model')

// GET /api/posts
router.get('/', (req, res) => {
  db.find()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json(err))
})

// GET /api/posts/:id
router.get('/:id', (req, res) => {
  db.findById(req.params.id)
    .then(post =>
      !post
        ? res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist' })
        : res.status(200).json(post)
    )
    .catch(err => res.status(500).json(err))
})

// POST /api/posts/:id
router.post('/', async (req, res) => {
  try {
    if (!req.body.title || !req.body.contents) {
      res
        .status(400)
        .json({ message: 'Please provide title and contents for the post' })
    } else {
      const createPost = await db.insert(req.body)
      res.status(201).json(createPost)
    }
  } catch (err) {
    res.status(500).json({
      message: 'There was an error while saving the post to the database',
    })
  }
})

// PUT /api/posts/:id
router.put('/:id', async (req, res) => {
  db.update(req.params.id, req.body)
    .then(post => {
      if (
        !req.body.title ||
        !req.body.contents ||
        req.body.title === '' ||
        req.body.contents === ''
      ) {
        res
          .status(400)
          .json({ message: 'Please provide title and contents for the post' })
      } else if (!post) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' })
      } else {
        res.status(200).json({ id: Number(req.params.id), ...req.body })
      }
    })
    .catch(_ =>
      res
        .status(500)
        .json({ message: 'The post information could not be modified' })
    )
})

// DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
  const deleted = await db.findById(req.params.id)

  try {
    if (deleted) {
      res.status(200).json(deleted)
      await db.remove(req.params.id)
    } else {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET /api/posts/:id/comments
router.get('/:id/comments', async (req, res) => {
  const checkID = await db.findById(req.params.id)
  const getPosts = await db.findPostComments(req.params.id)

  try {
    !checkID
      ? res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' })
      : res.status(200).json(getPosts)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'The comments information could not be retrieved' })
  }
})

module.exports = router
