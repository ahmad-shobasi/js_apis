export default class User {
  id: number;
  name: string;
  password: string;
  role: Roles;
  constructor(id?: number, name?: string, password?: string, role?: Roles) {
    this.id = id || 0;
    this.name = name || '';
    this.password = password || '';
    this.role = role || Roles.USER;
  }
}

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}
