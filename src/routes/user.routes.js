import {Router} from 'express'
import {getUsers, getUser , updateUser, deleteUser, getUserLogin} from '../controllers/user.controller.js'

const router = Router()

router.get('/use', getUserLogin)

router.get('/users', getUsers)

router.get('/user/:id', getUser)

//router.post('/users', createUsers)

router.delete('/user/:id', deleteUser)

router.patch('/user/:id', updateUser)

export default router;