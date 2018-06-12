import express from 'express'

const router = express.Router()

router.get('/', (req, res, next) => {
  res.redirect('http://localhost:3000/')
})

export default router
