import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { z } from 'zod';
import { CreateMessagePayload, messageSchema } from '@chat-app/contracts';

describe('Messages endpoints (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/messages (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/messages').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);
    const parsed = z.array(messageSchema).safeParse(response.body);
    expect(parsed.success).toBe(true);
  });

  it('/messages (POST)', async () => {
    const payload: CreateMessagePayload = {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      username: 'Anakin',
      message: 'This is where the fun begins',
    };
    const response = await request(app.getHttpServer()).post('/messages').send(payload).expect(201);

    const parsed = messageSchema.safeParse(response.body);
    expect(parsed.success).toBe(true);

    if (!parsed.success) {
      return;
    }

    expect(parsed.data.userId).toBe(payload.userId);
    expect(parsed.data.username).toBe(payload.username);
    expect(parsed.data.message).toBe(payload.message);
  });

  it('/messages (POST invalid)', async () => {
    const payload: CreateMessagePayload = {
      userId: 'invalid id',
      username: 'Anakin',
      message: 'This is where the fun begins',
    };
    await request(app.getHttpServer()).post('/messages').send(payload).expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
