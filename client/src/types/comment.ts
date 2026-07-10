export type Comment = {
  id: number;
  ticketId: number;
  message: string;
  createdBy: number;
  createdByName: string;
  createdAt: string;
};

export type CreateCommentInput = {
  message: string;
  createdBy: number;
};
