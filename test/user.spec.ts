import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
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

  describe('POST /api/users', () => {
    beforeEach(async () => {
      testService = app.get(TestService);
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: '',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Validation Error');
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test_username',
          password: 'test_password',
          name: 'test_name',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.username).toBe('test_username');
      expect(response.body.data.name).toBe('test_name');
    });

    it('should be able rejected if username already exist', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test_username',
          password: 'test_password',
          name: 'test_name',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('username already registered');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      testService = app.get(TestService);
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
          name: '',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Validation Error');
    });

    it('should be rejected if username wrong', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test_username_wrong',
          password: 'test_password',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('username or password is wrong');
    });

    it('should be rejected if password wrong', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test_username',
          password: 'test_password_wrong',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('username or password is wrong');
    });

    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test_username',
          password: 'test_password',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.username).toBe('test_username');
      expect(response.body.data.name).toBe('test_name');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('GET /api/users/current', () => {
    beforeEach(async () => {
      testService = app.get(TestService);
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'test_token_salah');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Unauthorized');
    });

    it('should be able to get user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'test_token');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(200);
      // expect(response.body.data).toBeDefined()
      expect(response.body.data.username).toBe('test_username');
      expect(response.body.data.name).toBe('test_name');
      // expect(response.body.data.token).toBeDefined()
    });
  });

  describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
      testService = app.get(TestService);
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'test_token')
        .send({
          username: '',
          password: '',
          name: '',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Validation Error');
    });

    it('should be able to update name', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'test_token')
        .send({
          name: 'test_name_updated',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe('test_name_updated');
    });

    it('should be able to update password', async () => {
      let response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'test_token')
        .send({
          password: 'test_password_updated',
        });

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe('test_name');

      response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test_username',
          password: 'test_password_updated',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.username).toBe('test_username');
      expect(response.body.data.name).toBe('test_name');
    });
  });

  describe('DELETE /api/users/current', () => {
    beforeEach(async () => {
      testService = app.get(TestService);
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('Authorization', 'test_token_salah');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Unauthorized');
    });

    it('should be able to logout user', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('Authorization', 'test_token');

      // console.info(response.body.errors)
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      const user = await testService.getUser();
      expect(user.token).toBeNull();
    });
  });
});
