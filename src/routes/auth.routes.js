import {Router} from 'express'
import {crearUsuario, loguearse} from '../controllers/auth.controller.js'

const router = Router()

router.post('/signup', crearUsuario)
router.post('/signin', loguearse)


export default router;