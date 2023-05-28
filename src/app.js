import express  from "express";
import userRouters from './routes/user.routes.js';
import authRouters from './routes/auth.routes.js';
import producRouters from './routes/produc.routes.js';
import shippingRouters from './routes/shipping.routes.js';
import paymentRouters from './routes/payment.routes.js';
import locationRouters from './routes/location.routes.js';
import morgan from 'morgan';
import cors from 'cors';

const app = express() // crear un servidor

app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}))

app.use(morgan('dev')); // midelware para intecertar peticiones


app.use(express.json()); // coloca antes de las rutas para converitr en json y los acpete express

app.use('/api',userRouters); // añadir rutas a el servidor
app.use('/api',authRouters);
app.use('/api',producRouters);
app.use('/api',shippingRouters);
app.use('/api',paymentRouters);
app.use('/api',locationRouters);

export default app