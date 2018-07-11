import express from 'express'
import path from 'path'

const router = express.Router()

router.get('*', (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    res.redirect('http://localhost:3000/')
  } else {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'))
  }
})

export default router
