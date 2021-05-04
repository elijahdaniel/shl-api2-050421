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

module.exports = router
