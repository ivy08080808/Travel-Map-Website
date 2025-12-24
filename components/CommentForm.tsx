'use client';

import { useState, useEffect } from 'react';

interface CommentFormProps {
  onSubmit: (data: { name: string; email: string; message: string; parentId?: string }) => Promise<void>;
  onCancel?: () => void;
  parentId?: string;
  parentAuthor?: string;
  initialData?: { name: string; email: string; message: string };
}

export default function CommentForm({
  onSubmit,
  onCancel,
  parentId,
  parentAuthor,
  initialData,
}: CommentFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [message, setMessage] = useState(initialData?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 當 initialData 改變時更新表單
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setMessage(initialData.message || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!message.trim()) {
      setError('Please fill in the message');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim() || '',
        email: email.trim() || '',
        message: message.trim(),
        parentId,
      });
      // 重置表單
      setName('');
      setEmail('');
      setMessage('');
      if (onCancel) {
        onCancel();
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Submission failed, please try again';
      setError(errorMessage);
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {parentAuthor && (
        <div className="text-sm text-gray-600 mb-2">
          Replying to <span className="font-semibold">{parentAuthor}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email (Optional)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (initialData ? 'Updating...' : 'Submitting...') : (initialData ? 'Update Comment' : 'Submit Comment')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

