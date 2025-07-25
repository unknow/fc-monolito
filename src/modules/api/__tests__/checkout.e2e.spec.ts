import request from 'supertest';
import { app } from '../express';
import { Sequelize } from 'sequelize-typescript';
import { InvoiceModel, InvoiceItemModel } from '../../invoice/repository/invoice.model';
import TransactionModel from '../../payment/repository/transaction.model';

describe('E2E test for checkout', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel, TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should process a checkout', async () => {
    const response = await request(app)
      .post('/checkout')
      .send({
        name: 'Client 1',
        document: '12345678900',
        address: {
          street: 'Street 1',
          number: '123',
          complement: 'Complement 1',
          city: 'City 1',
          state: 'State 1',
          zipCode: '12345678'
        },
        items: [
          {
            id: '1',
            name: 'Product 1',
            price: 100
          },
          {
            id: '2',
            name: 'Product 2',
            price: 200
          }
        ]
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('invoiceId');
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('total', 300);
    expect(response.body.products).toHaveLength(2);
  });
});