import request from 'supertest';
import { app } from '../express';
import { Sequelize } from 'sequelize-typescript';
import { InvoiceModel, InvoiceItemModel } from '../../invoice/repository/invoice.model';
import { v4 as uuidv4 } from 'uuid';

describe('E2E test for invoice', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should get an invoice', async () => {
    // Create a test invoice in the database
    const invoiceId = uuidv4();
    const invoice = await InvoiceModel.create({
      id: invoiceId,
      name: 'Client 1',
      document: '12345678900',
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipcode: '12345678',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create test invoice items
    await InvoiceItemModel.create({
      id: uuidv4(),
      name: 'Product 1',
      price: 100,
      invoiceId: invoiceId,
    });

    await InvoiceItemModel.create({
      id: uuidv4(),
      name: 'Product 2',
      price: 200,
      invoiceId: invoiceId,
    });

    // Test the GET /invoice/:id endpoint
    const response = await request(app)
      .get(`/invoice/${invoiceId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', invoiceId);
    expect(response.body).toHaveProperty('name', 'Client 1');
    expect(response.body).toHaveProperty('document', '12345678900');
    expect(response.body).toHaveProperty('address');
    expect(response.body.address).toHaveProperty('street', 'Street 1');
    expect(response.body.items).toHaveLength(2);
    expect(response.body).toHaveProperty('total', 300);
  });
});