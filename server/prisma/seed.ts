import 'dotenv/config';
import { Priority, Role, Status } from '@prisma/client';
import { prisma, disconnectPrisma } from '../src/lib/prisma';

async function main(): Promise<void> {
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const agent = await prisma.user.create({
    data: {
      name: 'Alice Agent',
      email: 'agent@support.local',
      role: Role.Agent,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Bob Manager',
      email: 'manager@support.local',
      role: Role.Manager,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Carol Admin',
      email: 'admin@support.local',
      role: Role.Admin,
    },
  });

  const openTicket = await prisma.ticket.create({
    data: {
      title: 'VPN not connecting',
      description: 'Unable to connect to corporate VPN from home network.',
      priority: Priority.High,
      status: Status.Open,
      createdById: manager.id,
      assignedToId: agent.id,
    },
  });

  const inProgressTicket = await prisma.ticket.create({
    data: {
      title: 'Email sync issue',
      description: 'Outlook stops syncing new messages after 10 minutes.',
      priority: Priority.Medium,
      status: Status.InProgress,
      createdById: manager.id,
      assignedToId: agent.id,
    },
  });

  const resolvedTicket = await prisma.ticket.create({
    data: {
      title: 'Password reset request',
      description: 'User locked out after multiple failed login attempts.',
      priority: Priority.Low,
      status: Status.Resolved,
      createdById: admin.id,
      assignedToId: agent.id,
    },
  });

  const closedTicket = await prisma.ticket.create({
    data: {
      title: 'New laptop setup',
      description: 'Install standard software stack and configure MFA.',
      priority: Priority.Medium,
      status: Status.Closed,
      createdById: manager.id,
      assignedToId: agent.id,
    },
  });

  const cancelledTicket = await prisma.ticket.create({
    data: {
      title: 'Duplicate printer ticket',
      description: 'Cancelled after duplicate was identified in the queue.',
      priority: Priority.Low,
      status: Status.Cancelled,
      createdById: agent.id,
      assignedToId: null,
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        ticketId: openTicket.id,
        message: 'Please try reconnecting after restarting the VPN client.',
        createdById: agent.id,
      },
      {
        ticketId: inProgressTicket.id,
        message: 'Reproduced the issue and checking mail server logs.',
        createdById: agent.id,
      },
      {
        ticketId: resolvedTicket.id,
        message: 'Password reset link sent and account unlocked.',
        createdById: admin.id,
      },
      {
        ticketId: closedTicket.id,
        message: 'Laptop imaged and handed over to the user.',
        createdById: manager.id,
      },
      {
        ticketId: cancelledTicket.id,
        message: 'Linked to existing ticket #12 and closed as duplicate.',
        createdById: manager.id,
      },
      {
        ticketId: openTicket.id,
        message: 'User confirmed issue started after latest Windows update.',
        createdById: manager.id,
      },
    ],
  });

  const userCount = await prisma.user.count();
  const ticketCount = await prisma.ticket.count();
  const commentCount = await prisma.comment.count();
  const ticketsByStatus = await prisma.ticket.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  console.log(`Seeded ${userCount} users, ${ticketCount} tickets, ${commentCount} comments`);
  console.log('Tickets by status:');
  for (const row of ticketsByStatus) {
    console.log(`  ${row.status}: ${row._count.status}`);
  }
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectPrisma();
  });
