import { ProductModel, UserModel } from '../../../../src/data';
import { TestDatabase } from '../../../test-database';
import { testServer } from '../../../test-server';
import request from 'supertest';

describe('Api routes testing', () => {
  const productsRoute = '/api/v1/products';
  const loginRoute = '/api/v1/auth/login';

  afterAll(() => {
    testServer.close();
    TestDatabase.close();
  });

  beforeEach(async () => {
    await UserModel.deleteMany();
    await ProductModel.deleteMany();
  });

  beforeAll(async () => {
    await testServer.start();
    await TestDatabase.start();
  });

  const product1 = {
    name: 'Product 1',
    price: 1,
    tags: ['motor'],
    image: '',
  };

  const product2 = {
    name: 'Product 2',
    price: 2,
    tags: ['lifestyle', 'motor'],
    image: '',
  };

  describe('Products route test get', () => {
    test('should return an array of products', async () => {
      await UserModel.create({
        name: 'Tester',
        email: 'test@example.com',
        password: 'M5e5k5i57.',
      });

      const loginResponse = await request(testServer.app)
        .post(loginRoute)
        .send({
          email: 'test@example.com',
          password: 'M5e5k5i57.',
        });

      const tokenCookie = loginResponse.headers['set-cookie'];

      // Extract the token from the response and set the cookie
      const token = loginResponse.body.token; // Adjust this based on your actual response structure
      const oneDay = 1000 * 60 * 60 * 24;

      await Promise.all([
        request(testServer.app)
          .post(productsRoute)
          .set('Cookie', tokenCookie) // Attach the token as a cookie in subsequent requests
          .send(product1)
          .expect(201),
        request(testServer.app)
          .post(productsRoute)
          .set('Cookie', tokenCookie) // Attach the token as a cookie in subsequent requests
          .send(product2)
          .expect(201),
      ]);

      const { body } = await request(testServer.app)
        .get(productsRoute)
        .set('Cookie', tokenCookie)
        .expect(200);

      expect(body).toEqual(
        expect.objectContaining({
          currentPage: expect.any(Number),
          maxPages: expect.any(Number),
          limit: expect.any(Number),
          total: expect.any(Number),
          next: expect.any(String) || null,
          prev: expect.any(String) || null,
          products: expect.any(Array),
        })
      );
    });
  });
});