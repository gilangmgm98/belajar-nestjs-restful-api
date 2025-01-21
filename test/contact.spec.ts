import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ContactController', () => {
  let app: INestApplication;
  let logger: Logger
  let testService: TestService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER)
  });

  describe("POST /api/contacts", () => {

    beforeEach(async () => {
      testService = app.get(TestService)
      await testService.deleteContact()
      await testService.deleteUser()

      await testService.createUser()
    })

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test_token')
        .send({
          first_name: "",
          last_name: "",
          email: "salah",
          phone: ""
        })

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(400)
      expect(response.body.errors).toBeDefined()
    })

    it("should be able to create contact", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test_token')
        .send({
          first_name: "test",
          last_name: "test",
          email: "test@test.com",
          phone: "0123456789"
        })

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.id).toBeDefined()
      expect(response.body.data.first_name).toBe('test')
      expect(response.body.data.last_name).toBe('test')
      expect(response.body.data.email).toBe('test@test.com')
      expect(response.body.data.phone).toBe('0123456789')
    })


  })

  describe("GET /api/contacts/:contactId", () => {

    beforeEach(async () => {
      testService = app.get(TestService)
      await testService.deleteContact()
      await testService.deleteUser()

      await testService.createUser()
      await testService.createContact()
    })

    it("should be rejected if contact is not found", async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}`)
        .set('Authorization', 'test_token')

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(404)
      expect(response.body.errors).toBeDefined()
    })

    it("should be able to get contact", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test_token')

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.id).toBeDefined()
      expect(response.body.data.first_name).toBe('test')
      expect(response.body.data.last_name).toBe('test')
      expect(response.body.data.email).toBe('test@test.com')
      expect(response.body.data.phone).toBe('0123456789')
    })


  })

  describe("PUT /api/contacts/:contactId", () => { 
    beforeEach(async () => {
      testService = app.get(TestService)

      await testService.deleteContact()
      await testService.deleteUser()

      await testService.createUser()
      await testService.createContact()
    })

    it("should be rejected if request is invalid", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test_token')
        .send({
          first_name: "",
          last_name: "",
          email: "",
          phone: ""
        })

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(400)
      expect(response.body.errors).toBeDefined()
    })

    it("should be rejected if contact is not found", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
      
      .put(`/api/contacts/${contact.id + 1}`)
      .set('Authorization', 'test_token')
      .send({
        first_name: "test",
        last_name: "test",
        email: "test@test.com",
        phone: "0123456789"
      })
      
      // console.log(`INI LOH ${contact.id + 1}`)
      // console.info(response.body)
      logger.info(response.body)
      expect(response.status).toBe(404)
      expect(response.body.errors).toBeDefined()
    })

    it("should be able to update contact", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test_token')
        .send({
          first_name: "test_update",
          last_name: "test_update",
          email: "testUpdated@test.com",
          phone: "9876543210"
        })

      console.info(response.body)
      logger.info(response.body)
      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.id).toBeDefined()
      expect(response.body.data.first_name).toBe('test_update')
      expect(response.body.data.last_name).toBe('test_update')
      expect(response.body.data.email).toBe('testUpdated@test.com')
      expect(response.body.data.phone).toBe('9876543210')
    })


  })

  describe("DELETE /api/contacts/:contactId", () => {

    beforeEach(async () => {
      testService = app.get(TestService)
      await testService.deleteContact()
      await testService.deleteUser()

      await testService.createUser()
      await testService.createContact()
    })

    it("should be rejected if contact is not found", async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 1}`)
        .set('Authorization', 'test_token')

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(404)
      expect(response.body.errors).toBeDefined()
    })

    it("should be able to remove contact", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test_token')

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data).toBe(true)
    })
  })

  describe("GET /api/contacts", () => {

    beforeEach(async () => {
      testService = app.get(TestService)
      await testService.deleteContact()
      await testService.deleteUser()

      await testService.createUser()
      await testService.createContact()
    })

    it("should be able to search contacts", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('Authorization', 'test_token')

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.length).toBe(1)
    })

    it("should be able to search contacts by name", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          name: 'es',
        })
        .set('Authorization', 'test_token')

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.length).toBe(1)
    })

    it("should be able to search contacts by name not found", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          name: 'esterlina',
        })
        .set('Authorization', 'test_token')

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.length).toBe(0)
    })
    
    it("should be able to search contacts by email", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          email: 'es',
        })
        .set('Authorization', 'test_token')

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.length).toBe(1)
    })
    
    it("should be able to search contacts by email not found", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          email: 'esterlina',
        })
        .set('Authorization', 'test_token')

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.length).toBe(0)
    })
    
    it("should be able to search contacts by phone", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          phone: '345',
        })
        .set('Authorization', 'test_token')

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.length).toBe(1)
    })
    it("should be able to search contacts by phone not found", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          phone: '543',
        })
        .set('Authorization', 'test_token')

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.length).toBe(0)
    })

    it("should be able to search contacts with page", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          size: 1,
          page: 2
        })
        .set('Authorization', 'test_token')

      // console.info(response.body.errors)
      logger.info(response.body)
      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.length).toBe(0)
      expect(response.body.paging.current_page).toBe(2)
      expect(response.body.paging.total_page).toBe(1)
      expect(response.body.paging.size).toBe(1)
    })

  })

});


