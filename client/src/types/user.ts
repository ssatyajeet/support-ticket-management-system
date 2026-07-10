import type { Role } from './enums';

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};
