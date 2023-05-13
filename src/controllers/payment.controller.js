import Stripe from "stripe";

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

        res.send({message: 'Melo caramelo'})

    } catch (error) {
        console.log(error);
        res.send({message: 'ERROR'})
    }
}