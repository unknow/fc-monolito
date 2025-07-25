import request from 'supertest';
import { app } from '../express';
import { Sequelize } from 'sequelize-typescript';
import { ProductModel } from '../../product-adm/repository/product.model';

describe('E2E test for product', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a product', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        name: 'Product 1',
        description: 'Product 1 description',
        purchasePrice: 100,
        stock: 10,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Product created successfully');
  });
});
