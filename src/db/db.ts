import { v4 as uuidv4 } from 'uuid';

import { type IUser } from '../models/User.interface';

class Database {
  private _users: IUser[];

  constructor(entryData?: IUser[]) {
    this._users = entryData ?? [];
  }

  public createUser(user: Omit<IUser, 'id'>): void {
    const newUser: IUser = {
      id: uuidv4(),
      ...user,
    } satisfies IUser;
    this._users.push(newUser);
  }

  public getUserById(id: string): IUser | undefined {
    return this._users.find((user) => user.id === id);
  }

  public updateUser(
    id: string,
    newData: { id: string } & Omit<IUser, 'id'>,
  ): void {
    const index = this._users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this._users[index] = {
        ...this._users[index],
        ...newData,
      };
    }
  }

  public deleteUser(id: string): void {
    this._users = this._users.filter((user) => user.id !== id);
  }

  public getAllUsers(): IUser[] {
    return this._users;
  }
}

const createDatabase = (): Database => {
  return new Database();
};

export { createDatabase, Database };
