export class Employee {
  id: number;
  name: string;
  role: EmployeeRoles;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export enum EmployeeRoles {
  ENGINEER = 'ENGINEER',
  MANAGER = 'MANAGER',
  HR = 'HR',
}
