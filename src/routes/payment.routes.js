import {Router} from 'express'
import {checkout} from '../controllers/payment.controller.js'

const router = Router()

router.post('/payment', checkout)

export default router