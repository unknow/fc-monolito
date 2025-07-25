import express, { Express } from 'express';
import { productRoute } from './routes/product.route';
import { clientRoute } from './routes/client.route';
import { checkoutRoute } from './routes/checkout.route';
import { invoiceRoute } from './routes/invoice.route';

export const app: Express = express();

app.use(express.json());

// Routes
app.use('/products', productRoute);
app.use('/clients', clientRoute);
app.use('/checkout', checkoutRoute);
app.use('/invoice', invoiceRoute);

export default app;