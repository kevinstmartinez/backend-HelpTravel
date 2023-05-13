import {Router} from 'express'
import {departamentosCO, ciudadesCO } from '../controllers/location.controller.js'

const router = Router()

router.get('/listarDp', departamentosCO)
router.get('/listarCu', ciudadesCO)


export default router;