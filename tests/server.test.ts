import * as http from 'http';

import { Database } from '../src/db/db';
import { Server } from '../src/server/server';

import { mockDb } from './mock/mockDb';

describe('Server API', () => {
  let server: Server;
  let db: Database;
  const port = 3000;

  beforeAll(() => {
    db = new Database(mockDb);
    server = new Server(port, db);
    server.start();
  });

  afterAll(() => {
    server.stop();
  });

  test('GET /api/users should return all users', (done) => {
    http.get('http://localhost:3000/api/users', (res) => {
      expect(res.statusCode).toBe(200);
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const users = JSON.parse(data);
        expect(users).toEqual(mockDb);
        done();
      });
    });
  });

  test('GET /api/users/:userId should return user by ID if it exists', (done) => {
    http.get(
      'http://localhost:3000/api/users/6d03624f-16ec-4590-9ab3-3531a5eb9f25',
      (res) => {
        expect(res.statusCode).toBe(200);
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const user = JSON.parse(data);
          expect(user).toBeDefined();
          done();
        });
      },
    );
  });

  test('GET /api/users/:userId should return 400 if userId is invalid', (done) => {
    http.get('http://localhost:3000/api/users/invalidId', (res) => {
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  test('POST /api/users should return 400 if request body does not contain required fields', (done) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      expect(res.statusCode).toBe(400);
      done();
    });

    req.on('error', (error) => {
      done(error);
    });
    req.write(JSON.stringify(''));
    req.end();
  });
});
