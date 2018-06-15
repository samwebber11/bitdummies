import express from 'express'

import User from '../database/models/user'
import userController from '../controllers/userController'

const router = express.Router()

router.get('/:id', userController.getUserAccountInfo)

router.get('/', userController.getUserListAccountInfo)
