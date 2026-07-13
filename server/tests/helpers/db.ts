import { Priority, Role, Status } from '@prisma/client';
import { prisma } from '../../src/lib/prisma';

export type TestFixtures = {
  userId: number;
  openTicketId: number;
  inProgressTicketId: number;
  resolvedTicketId: number;
  closedTicketId: number;
  cancelledTicketId: number;
};

export async function resetDatabase(): Promise<void> {
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
}

export async function seedTestFixtures(): Promise<TestFixtures> {
  const user = await prisma.user.create({
    data: {
      name: 'Integration Test User',
      email: `test-user-${Date.now()}@example.com`,
      role: Role.Agent,
    },
  });

  const base = {
    description: 'Integration test ticket',
    priority: Priority.Medium,
    createdById: user.id,
    assignedToId: user.id,
  };

  const openTicket = await prisma.ticket.create({
    data: { ...base, title: 'Open ticket', status: Status.Open },
  });

  const inProgressTicket = await prisma.ticket.create({
    data: { ...base, title: 'In progress ticket', status: Status.InProgress },
  });

  const resolvedTicket = await prisma.ticket.create({
    data: { ...base, title: 'Resolved ticket', status: Status.Resolved },
  });

  const closedTicket = await prisma.ticket.create({
    data: { ...base, title: 'Closed ticket', status: Status.Closed },
  });

  const cancelledTicket = await prisma.ticket.create({
    data: { ...base, title: 'Cancelled ticket', status: Status.Cancelled },
  });

  return {
    userId: user.id,
    openTicketId: openTicket.id,
    inProgressTicketId: inProgressTicket.id,
    resolvedTicketId: resolvedTicket.id,
    closedTicketId: closedTicket.id,
    cancelledTicketId: cancelledTicket.id,
  };
}
