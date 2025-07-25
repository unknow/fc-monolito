import { Router, Request, Response } from 'express';
import ClientAdmFacadeFactory from '../../client-adm/factory/client-adm.facade.factory';
import Address from '../../@shared/domain/value-object/address';

export const clientRoute = Router();

clientRoute.post('/', async (req: Request, res: Response) => {
  try {
    const clientFacade = ClientAdmFacadeFactory.create();

    const address = new Address(
      req.body.address.street,
      req.body.address.number,
      req.body.address.complement,
      req.body.address.city,
      req.body.address.state,
      req.body.address.zipCode
    );

    await clientFacade.add({
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: address,
    });

    res.status(201).send({ message: 'Client created successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ message: 'Error creating client', error: error.message });
  }
});
