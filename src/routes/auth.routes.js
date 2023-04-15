import {Router} from 'express'
import {crearUsuario, loguearse} from '../controllers/auth.controller'

const router = Router()

router.post('/signup', crearUsuario)
router.post('/signin', loguearse)


export default router;