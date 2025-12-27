'use client';

import CommentItem, { Comment } from './CommentItem';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

interface CommentListProps {
  comments: Comment[];
  currentSessionId: string | null;
  onDelete: (id: string) => void;
  onReply: (parentId: string) => void;
  onEdit?: (comment: Comment) => void;
}

export default function CommentList({
  comments,
  currentSessionId,
  onDelete,
  onReply,
  onEdit,
}: CommentListProps) {
  const { language } = useLanguage();
  const t = translations[language];
  
  // 將留言分組：主留言和回覆
  const mainComments = comments.filter((c) => !c.parentId);
  const allReplies = comments.filter((c) => c.parentId);

  // 遞歸函數：為每個留言找到其直接回覆
  const getReplies = (parentId: string): Comment[] => {
    return allReplies.filter((r) => r.parentId === parentId);
  };

  if (mainComments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t.comments.noComments}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mainComments.map((comment, index) => (
        <CommentItem
          key={`${comment._id}-${index}-${comment.createdAt}`}
          comment={comment}
          replies={getReplies(comment._id)}
          currentSessionId={currentSessionId}
          onDelete={onDelete}
          onReply={onReply}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

