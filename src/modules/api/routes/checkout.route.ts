import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import PaymentFacadeFactory from '../../payment/factory/payment.facade.factory';
import InvoiceFacadeFactory from '../../invoice/factory/invoice.facade.factory';

export const checkoutRoute = Router();

checkoutRoute.post('/', async (req: Request, res: Response) => {
  try {
    const paymentFacade = PaymentFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();

    // Generate a unique order ID
    const orderId = uuidv4();

    // Calculate total amount from items
    const amount = req.body.items.reduce((total: number, item: { price: number }) => {
      return total + item.price;
    }, 0);

    // Process payment
    const payment = await paymentFacade.process({
      orderId,
      amount,
    });

    // Generate invoice
    const invoice = await invoiceFacade.generate({
      name: req.body.name,
      document: req.body.document,
      street: req.body.address.street,
      number: req.body.address.number,
      complement: req.body.address.complement,
      city: req.body.address.city,
      state: req.body.address.state,
      zipCode: req.body.address.zipCode,
      items: req.body.items,
    });

    res.status(200).send({
      id: orderId,
      invoiceId: invoice.id,
      status: payment.status,
      total: amount,
      products: req.body.items,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ message: 'Error processing checkout', error: error.message });
  }
});
