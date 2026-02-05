export default class User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Roles;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}
