import http from 'http';
import { validate } from 'uuid';

import { JSON_HEADER } from '../constants/header';
import { type Database } from '../db/db';
import { type IUser } from '../models/User.interface';
import { HttpCustomError } from '../utils/customErrors';
import { extractUUID } from '../utils/extractUuid';
import { isValidUser } from '../validation/validateUser';

class Server {
  private readonly _port: number;
  private readonly _db: Database;
  private readonly _routes: Record<
    string,
    (req: http.IncomingMessage, res: http.ServerResponse) => void
  >;

  private httpServer: http.Server;

  constructor(port: number, db: Database) {
    this._port = port;
    this._db = db;
    this._routes = {
      'GET /api/users': this.getAllUsers.bind(this),
      'GET /api/users/': this.getUserById.bind(this),
      'POST /api/users': this.createUser.bind(this),
      'PUT /api/users/': this.updateUser.bind(this),
      'DELETE /api/users/': this.deleteUser.bind(this),
    };
  }

  public start(): void {
    this.httpServer = http.createServer((req, res) => {
      const method = req.method;
      const url = req.url?.endsWith('/') ? req.url.slice(0, -1) : req.url;
      const route = `${method} ${url?.startsWith('/api/users/') ? '/api/users/' : url}`;
      const handler = this._routes[route];
      console.log(`[${method}] - [${req.headers.host}] - '${url}'`);
      if (handler) {
        handler(req, res);
      } else {
        res.writeHead(404, JSON_HEADER);
        res.end(
          JSON.stringify(
            new HttpCustomError(
              res.statusCode,
              url,
              method,
              'Route not found',
            ).toJSON(),
          ),
        );
      }
    });

    this.httpServer.listen(this._port, () => {
      console.log(`Server is running on port ${this._port}`);
    });
  }

  public stop(): void {
    this.httpServer.close(() => {
      console.log(`Server stopped on port ${this._port}`);
    });
  }

  private getAllUsers(
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): void {
    const users = this._db.getAllUsers();
    if (users.length === 0) {
      res.writeHead(404, JSON_HEADER);
      res.end(
        JSON.stringify(
          new HttpCustomError(
            res.statusCode,
            req.url,
            req.method,
            'No users found in the database',
          ).toJSON(),
        ),
      );
    }
    res.writeHead(200, JSON_HEADER);
    res.end(JSON.stringify(users));
  }

  private getUserById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): void {
    const url = req.url?.endsWith('/') ? req.url.slice(0, -1) : req.url;
    const userId = extractUUID(url);
    if (!userId || !validate(userId)) {
      res.writeHead(400, JSON_HEADER);
      res.end(
        JSON.stringify(
          new HttpCustomError(
            res.statusCode,
            req.url,
            req.method,
            'Invalid userID format',
          ).toJSON(),
        ),
      );
      return;
    }
    const user = this._db.getUserById(userId);
    if (user) {
      res.writeHead(200, JSON_HEADER);
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, JSON_HEADER);
      res.end(
        JSON.stringify(
          new HttpCustomError(
            res.statusCode,
            req.url,
            req.method,
            'User is not found',
          ).toJSON(),
        ),
      );
    }
  }

  private createUser(
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): void {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const data: unknown = JSON.parse(body);
      if (isValidUser(data as Omit<IUser, 'id'>)) {
        this._db.createUser(data as Omit<IUser, 'id'>);
        res.writeHead(201, JSON_HEADER);
        res.end();
      } else {
        res.writeHead(400, JSON_HEADER);
        res.end(
          JSON.stringify(
            new HttpCustomError(
              res.statusCode,
              req.url,
              req.method,
              'Object is not valid',
              'The only required fields are: username (string), age (number), hobbies (string[])',
            ).toJSON(),
          ),
        );
      }
    });
  }

  private updateUser(
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): void {
    const url = req.url?.endsWith('/') ? req.url.slice(0, -1) : req.url;
    const userId = extractUUID(url);
    if (!userId || !validate(userId)) {
      res.writeHead(400, JSON_HEADER);
      res.end(
        JSON.stringify(
          new HttpCustomError(
            res.statusCode,
            req.url,
            req.method,
            'Invalid userID format',
          ).toJSON(),
        ),
      );
      return;
    }
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const data = JSON.parse(body);
      if (data.username || data.hobbies || data.age) {
        this._db.updateUser(userId, data as { id: string } & Omit<IUser, 'id'>);
        res.writeHead(200, JSON_HEADER);
        res.end();
      } else {
        res.writeHead(404, JSON_HEADER);
        res.end(
          JSON.stringify(
            new HttpCustomError(
              res.statusCode,
              req.url,
              req.method,
              'User is not found',
            ).toJSON(),
          ),
        );
      }
    });
  }

  private deleteUser(
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): void {
    const url = req.url?.endsWith('/') ? req.url.slice(0, -1) : req.url;
    const userId = extractUUID(url);
    if (!userId || !validate(userId)) {
      res.writeHead(400, JSON_HEADER);
      res.end(
        JSON.stringify(
          new HttpCustomError(
            res.statusCode,
            req.url,
            req.method,
            'Invalid userID format',
          ).toJSON(),
        ),
      );
      return;
    }
    const user = this._db.getUserById(userId);
    if (user) {
      this._db.deleteUser(userId);
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404, JSON_HEADER);
      res.end(
        JSON.stringify(
          new HttpCustomError(
            res.statusCode,
            req.url,
            req.method,
            'User is not found',
          ).toJSON(),
        ),
      );
    }
  }
}

export { Server };
