'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

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
  const { language } = useLanguage();
  const t = translations[language];
  const [showReplies, setShowReplies] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = currentSessionId === comment.sessionId && onEdit;
  const canDelete = currentSessionId === comment.sessionId;
  const hasReplies = replies.length > 0;

  const handleDelete = async () => {
    const confirmMessage = language === 'zh' 
      ? '您確定要刪除這則留言嗎？' 
      : 'Are you sure you want to delete this comment?';
    if (!confirm(confirmMessage)) {
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
    return date.toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', {
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
              {t.comments.edit}
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-black hover:text-gray-700 text-sm disabled:opacity-50"
            >
              {isDeleting ? (language === 'zh' ? '刪除中...' : 'Deleting...') : t.comments.delete}
            </button>
          )}
          <button
            onClick={() => onReply(comment._id)}
            className="text-black hover:text-gray-700 text-sm"
          >
            {t.comments.reply}
          </button>
        </div>
      </div>

      {hasReplies && (
        <div className="mt-3">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-sm text-gray-600 hover:text-gray-800 mb-2"
          >
            {showReplies 
              ? (language === 'zh' ? '隱藏' : 'Hide') 
              : (language === 'zh' ? '顯示' : 'Show')} {replies.length} {language === 'zh' 
                ? (replies.length === 1 ? '則回覆' : '則回覆') 
                : (replies.length === 1 ? 'reply' : 'replies')}
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

