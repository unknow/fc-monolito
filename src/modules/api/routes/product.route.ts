import { Router, Request, Response } from 'express';
import ProductAdmFacadeFactory from '../../product-adm/factory/facade.factory';

export const productRoute = Router();

productRoute.post('/', async (req: Request, res: Response) => {
  try {
    const productFacade = ProductAdmFacadeFactory.create();

    await productFacade.addProduct({
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    });

    res.status(201).send({ message: 'Product created successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ message: 'Error creating product', error: error.message });
  }
});
