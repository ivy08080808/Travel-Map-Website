'use client';

import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentList, { Comment } from './CommentList';

export default function CommentBoard() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [showForm, setShowForm] = useState(false);

  // 從 localStorage 獲取或生成 sessionId
  useEffect(() => {
    let sessionId = localStorage.getItem('commentSessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('commentSessionId', sessionId);
    }
    setCurrentSessionId(sessionId);
  }, []);

  // 獲取留言列表
  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // 提交留言
  const handleSubmit = async (data: {
    name: string;
    email: string;
    message: string;
    parentId?: string;
  }) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error or server error' }));
        console.error('Submit error:', error);
        throw new Error(error.error || `Failed to submit comment (${response.status})`);
      }

      const result = await response.json();
      
      // 保存 sessionId 到 localStorage
      if (result.sessionId) {
        localStorage.setItem('commentSessionId', result.sessionId);
        setCurrentSessionId(result.sessionId);
      }

      // 重新獲取留言列表
      await fetchComments();
      setReplyingTo(null);
      setShowForm(false);
    } catch (error) {
      console.error('Submit error details:', error);
      throw error;
    }
  };

  // 刪除留言
  const handleDelete = async (id: string) => {
    const sessionId = localStorage.getItem('commentSessionId');
    if (!sessionId) {
      alert('Unable to identify your session');
      return;
    }

    const response = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.error || 'Failed to delete');
      return;
    }

    // 重新獲取留言列表
    await fetchComments();
  };

  // 編輯留言
  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setShowForm(true);
  };

  // 更新留言
  const handleUpdate = async (data: {
    name: string;
    email: string;
    message: string;
    parentId?: string;
  }) => {
    if (!editingComment) return;

    const sessionId = localStorage.getItem('commentSessionId');
    if (!sessionId) {
      alert('Unable to identify your session');
      return;
    }

    const response = await fetch(`/api/comments/${editingComment._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        name: data.name,
        email: data.email,
        message: data.message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update comment');
    }

    // 重新獲取留言列表
    await fetchComments();
    setEditingComment(null);
    setShowForm(false);
  };

  // 回覆留言
  const handleReply = (parentId: string) => {
    const parentComment = comments.find((c) => c._id === parentId);
    if (parentComment) {
      setReplyingTo({ id: parentId, author: parentComment.name || 'Anonymous' });
      setShowForm(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Comments</h2>

      {!showForm && !replyingTo && !editingComment && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Write a Comment
        </button>
      )}

      {(showForm || replyingTo || editingComment) && (
        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
          <CommentForm
            onSubmit={editingComment ? handleUpdate : handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setReplyingTo(null);
              setEditingComment(null);
            }}
            parentId={replyingTo?.id}
            parentAuthor={replyingTo?.author}
            initialData={editingComment ? {
              name: editingComment.name,
              email: editingComment.email,
              message: editingComment.message,
            } : undefined}
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : (
        <CommentList
          comments={comments}
          currentSessionId={currentSessionId}
          onDelete={handleDelete}
          onReply={handleReply}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

