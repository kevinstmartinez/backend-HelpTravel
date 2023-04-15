import {Router} from 'express'
import {getProducs, getProduc ,createProducs, updateProduc, deleteProduc} from '../controllers/produc.controller.js'
import {verifyToken, isAdmin, isEmpleado} from '../middlewares/authjwt.js'
const router = Router()

router.get('/produc', getProducs)

router.get('/produc/:id', getProduc)

router.post('/producs', [verifyToken, isAdmin], createProducs) // [verifyToken, isAdmin] esto es para que entre la peticion a el midelrword, y despues haga la funcion

router.delete('/produc/:id', verifyToken, deleteProduc)

router.patch('/produc/:id', verifyToken, updateProduc)

export default router;
