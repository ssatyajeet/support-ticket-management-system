import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { CommentDto } from './ticketService';
import { CreateCommentInput } from '../validators/commentValidators';

const commentWithAuthorInclude = {
  createdBy: { select: { id: true, name: true } },
} satisfies Prisma.CommentInclude;

type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: typeof commentWithAuthorInclude;
}>;

function toCommentDto(comment: CommentWithAuthor): CommentDto {
  return {
    id: comment.id,
    ticketId: comment.ticketId,
    message: comment.message,
    createdBy: comment.createdById,
    createdByName: comment.createdBy.name,
    createdAt: comment.createdAt.toISOString(),
  };
}

async function assertUserExists(userId: number): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new AppError(404, 'NOT_FOUND', `User with id ${userId} not found`);
  }
}

export async function create(
  ticketId: number,
  data: CreateCommentInput,
): Promise<CommentDto> {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true },
  });

  if (!ticket) {
    throw new AppError(404, 'NOT_FOUND', `Ticket with id ${ticketId} not found`);
  }

  await assertUserExists(data.createdBy);

  const comment = await prisma.comment.create({
    data: {
      ticketId,
      message: data.message,
      createdById: data.createdBy,
    },
    include: commentWithAuthorInclude,
  });

  return toCommentDto(comment);
}
