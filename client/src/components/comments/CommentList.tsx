import type { Comment } from '../../types/comment';

type CommentListProps = {
  comments: Comment[];
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-slate-500">No comments yet.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">{comment.createdByName}</p>
            <time className="text-xs text-slate-500" dateTime={comment.createdAt}>
              {formatDateTime(comment.createdAt)}
            </time>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {comment.message}
          </p>
        </li>
      ))}
    </ul>
  );
}
