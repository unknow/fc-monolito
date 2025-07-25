import { Router, Request, Response } from 'express';
import InvoiceFacadeFactory from '../../invoice/factory/invoice.facade.factory';

export const invoiceRoute = Router();

invoiceRoute.get('/:id', async (req: Request, res: Response) => {
  try {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const invoice = await invoiceFacade.find({
      id: req.params.id,
    });

    res.status(200).send(invoice);
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ message: 'Error finding invoice', error: error.message });
  }
});
