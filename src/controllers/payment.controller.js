import Stripe from "stripe";
import jwt_decode from 'jwt-decode';
import { pool } from '../db/database.js';

export const checkout = async (req, res) => {

    const stripe = new Stripe("sk_test_51N3NXbCHS2iRjMQ42pUYHNkBEBRbAMLd6BPItDPjqWAdNwCQ26ruRjB5nwJIQ9BbQMdnLt4DTaT8nKn2hInFksWf00nCfN4J1X")

    const {id, amount} = req.body

    try {
        const pago = await stripe.paymentIntents.create({
            
            amount,
            currency: "USD",
            description: "Envio desde Pance ois",
            payment_method: id,
            confirm: true
        })

        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt_decode(token)

        const [user] = await pool.query('SELECT * FROM Usuarios WHERE id_user = ?', [decoded.id])

        await pool.query('DELETE FROM items_sending_cart WHERE user_id = ?', user[0].id_user)

        res.send({message: 'Melo caramelo'})

    } catch (error) {
        console.log(error);
        res.send({message: 'ERROR'})
    }
}