import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('AddressController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    // testService = app.get(TestService);
    // await testService.deleteAll();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
  });

  describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      testService = app.get(TestService);

      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if request is invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'test_token')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postalCode: '',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create address', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'test_token')
        .send({
          street: 'test',
          city: 'test',
          province: 'test',
          country: 'test',
          postalCode: '12345',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('test');
      expect(response.body.data.city).toBe('test');
      expect(response.body.data.province).toBe('test');
      expect(response.body.data.country).toBe('test');
      expect(response.body.data.postalCode).toBe('12345');
    });
  });

  describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      testService = app.get(TestService);

      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be able to get address', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test_token');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      // expect(response.body.errors).toBe('Unauthorized')
    });

    it('should be rejected if unauthorized', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test_token_salah');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Unauthorized');
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test_token');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Contact not found');
    });

    it('should be rejected if address is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test_token');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Address not found');
    });
  });

  describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      testService = app.get(TestService);

      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if request is invalid', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test_token')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postalCode: '',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if request is unauthorized', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test_token_salah')
        .send({
          street: 'jalan test update',
          city: 'kota test update',
          province: 'provinsi test update',
          country: 'negara test update',
          postalCode: '12345',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Unauthorized');
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test_token')
        .send({
          street: 'jalan test update',
          city: 'kota test update',
          province: 'provinsi test update',
          country: 'negara test update',
          postalCode: '12345',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Contact not found');
    });

    it('should be rejected if address is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test_token')
        .send({
          street: 'jalan test update',
          city: 'kota test update',
          province: 'provinsi test update',
          country: 'negara test update',
          postalCode: '12345',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Address not found');
    });

    it('should be able to update address', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test_token')
        .send({
          street: 'jalan test update',
          city: 'kota test update',
          province: 'provinsi test update',
          country: 'negara test update',
          postalCode: '12345',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('jalan test update');
      expect(response.body.data.city).toBe('kota test update');
      expect(response.body.data.province).toBe('provinsi test update');
      expect(response.body.data.country).toBe('negara test update');
      expect(response.body.data.postalCode).toBe('12345');
    });
  });

  describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      testService = app.get(TestService);

      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be able to delete address', async () => {
      const contact = await testService.getContact();
      let address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test_token');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      address = await testService.getAddress();
      expect(address).toBeNull();
    });

    it('should be rejected if unauthorized', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test_token_salah');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Unauthorized');
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test_token');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Contact not found');
    });

    it('should be rejected if address is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test_token');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Address not found');
    });
  });

  describe('GET /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      testService = app.get(TestService);

      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be able to get list address', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'test_token');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0].street).toBe('jalan test');
      expect(response.body.data[0].city).toBe('kota test');
      expect(response.body.data[0].province).toBe('provinsi test');
      expect(response.body.data[0].country).toBe('negara test');
      expect(response.body.data[0].postalCode).toBe('12345');
      // expect(response.body.errors).toBe('Unauthorized')
    });

    it('should be rejected if unauthorized', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'test_token_salah');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Unauthorized');
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses`)
        .set('Authorization', 'test_token');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Contact not found');
    });
  });
});
