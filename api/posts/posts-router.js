// implement your posts router here
const router = require('express').Router()
const db = require('./posts-model')

// GET /api/posts
router.get('/', (req, res) => {
  db.find()
    .then(posts => res.status(200).json(posts))
    .catch(err =>
      res
        .status(500)
        .json({ message: 'The posts information could not be retrieved' })
    )
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

module.exports = router
