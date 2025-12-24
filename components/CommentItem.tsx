'use client';

import { useState } from 'react';

export interface Comment {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  parentId: string | null;
  isApproved: boolean;
  sessionId?: string;
}

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  currentSessionId: string | null;
  onDelete: (id: string) => void;
  onReply: (parentId: string) => void;
  onEdit?: (comment: Comment) => void;
}

export default function CommentItem({
  comment,
  replies,
  currentSessionId,
  onDelete,
  onReply,
  onEdit,
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = currentSessionId === comment.sessionId && onEdit;
  const canDelete = currentSessionId === comment.sessionId;
  const hasReplies = replies.length > 0;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(comment._id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="border-l-2 border-gray-200 pl-4 py-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">
              {comment.name || 'Anonymous'}
            </span>
            {comment.email && (
              <span className="text-sm text-gray-500">{comment.email}</span>
            )}
            <span className="text-sm text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{comment.message}</p>
        </div>
        <div className="flex gap-2 ml-4">
          {canEdit && (
            <button
              onClick={() => onEdit(comment)}
              className="text-black hover:text-gray-700 text-sm"
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-black hover:text-gray-700 text-sm disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
          <button
            onClick={() => onReply(comment._id)}
            className="text-black hover:text-gray-700 text-sm"
          >
            Reply
          </button>
        </div>
      </div>

      {hasReplies && (
        <div className="mt-3">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-sm text-gray-600 hover:text-gray-800 mb-2"
          >
            {showReplies ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
          </button>
          {showReplies && (
            <div className="ml-4 space-y-2">
              {replies.map((reply, replyIndex) => (
                <CommentItem
                  key={`${reply._id}-${replyIndex}-${reply.createdAt}`}
                  comment={reply}
                  replies={[]}
                  currentSessionId={currentSessionId}
                  onDelete={onDelete}
                  onReply={onReply}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

