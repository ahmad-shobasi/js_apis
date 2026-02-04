export default class User {
  id: number;
  name: string;
  password: string;
  role: Roles;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}
