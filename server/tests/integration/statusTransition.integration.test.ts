import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { resetDatabase, seedTestFixtures, type TestFixtures } from '../helpers/db';

describe('Ticket API integration', () => {
  let fixtures: TestFixtures;

  beforeEach(async () => {
    await resetDatabase();
    fixtures = await seedTestFixtures();
  });

  describe('valid status transitions (AC-17)', () => {
    it('Open → In Progress returns 200', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${fixtures.openTicketId}/status`)
        .send({ status: 'In Progress' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('In Progress');
    });

    it('In Progress → Resolved returns 200', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${fixtures.inProgressTicketId}/status`)
        .send({ status: 'Resolved' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Resolved');
    });

    it('Resolved → Closed returns 200', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${fixtures.resolvedTicketId}/status`)
        .send({ status: 'Closed' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Closed');
    });

    it('Open → Cancelled returns 200', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${fixtures.openTicketId}/status`)
        .send({ status: 'Cancelled' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Cancelled');
    });

    it('In Progress → Cancelled returns 200', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${fixtures.inProgressTicketId}/status`)
        .send({ status: 'Cancelled' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Cancelled');
    });
  });

  describe('invalid status transitions (AC-18)', () => {
    it('Open → Resolved (skip) returns 400 INVALID_STATUS_TRANSITION', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${fixtures.openTicketId}/status`)
        .send({ status: 'Resolved' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_STATUS_TRANSITION');
    });

    it('Open → Closed (skip) returns 400 INVALID_STATUS_TRANSITION', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${fixtures.openTicketId}/status`)
        .send({ status: 'Closed' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_STATUS_TRANSITION');
    });

    it('Resolved → Open (revert) returns 400 INVALID_STATUS_TRANSITION', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${fixtures.resolvedTicketId}/status`)
        .send({ status: 'Open' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_STATUS_TRANSITION');
    });

    it('Closed → In Progress returns 400 INVALID_STATUS_TRANSITION', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${fixtures.closedTicketId}/status`)
        .send({ status: 'In Progress' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_STATUS_TRANSITION');
    });

    it('Cancelled → In Progress returns 400 INVALID_STATUS_TRANSITION', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${fixtures.cancelledTicketId}/status`)
        .send({ status: 'In Progress' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_STATUS_TRANSITION');
    });

    it('Cancelled → Closed returns 400 INVALID_STATUS_TRANSITION', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${fixtures.cancelledTicketId}/status`)
        .send({ status: 'Closed' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_STATUS_TRANSITION');
    });
  });

  describe('API guards and validation', () => {
    it('PATCH /tickets/:id with status field returns 400 STATUS_NOT_ALLOWED_HERE', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${fixtures.openTicketId}`)
        .send({ status: 'In Progress' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('STATUS_NOT_ALLOWED_HERE');
    });

    it('GET /tickets?status=Invalid returns 400 INVALID_FILTER', async () => {
      const response = await request(app).get('/api/tickets?status=Invalid');

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_FILTER');
    });

    it('POST /tickets without title returns 400 VALIDATION_ERROR', async () => {
      const response = await request(app).post('/api/tickets').send({
        description: 'Missing title',
        priority: 'Low',
        createdBy: fixtures.userId,
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('GET /tickets/99999 returns 404 NOT_FOUND', async () => {
      const response = await request(app).get('/api/tickets/99999');

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('POST /tickets with malformed JSON returns 400 VALIDATION_ERROR (EC-19)', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .set('Content-Type', 'application/json')
        .send('{invalid');

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toMatch(/invalid json/i);
    });
  });
});
