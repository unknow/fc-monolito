import request from 'supertest';
import { app } from '../express';
import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../../client-adm/repository/client.model';

describe('E2E test for client', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a client', async () => {
    const response = await request(app)
      .post('/clients')
      .send({
        name: 'Client 1',
        email: 'client1@example.com',
        document: '12345678900',
        address: {
          street: 'Street 1',
          number: '123',
          complement: 'Complement 1',
          city: 'City 1',
          state: 'State 1',
          zipCode: '12345678'
        }
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Client created successfully');
  });
});
