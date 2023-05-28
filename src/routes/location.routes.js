import {Router} from 'express'
import {departamentosCO } from '../controllers/location.controller.js'

const router = Router()

router.get('/listarDp', departamentosCO)


export default router;