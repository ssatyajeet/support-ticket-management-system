import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';

export type UserDto = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export async function list(): Promise<UserDto[]> {
  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return users;
}
