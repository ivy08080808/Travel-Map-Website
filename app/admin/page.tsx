'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/components/CommentItem';

type ViewMode = 'comments' | 'images';

interface CloudinaryImage {
  url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('comments');
  const [comments, setComments] = useState<Comment[]>([]);
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // 檢查是否已登錄
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // 嘗試獲取管理員留言列表來驗證身份
      const response = await fetch('/api/admin/comments');
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        setIsAuthenticated(true);
        await fetchImages();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword('');
        await fetchComments();
      } else {
        const data = await response.json();
        setError(data.error || '登錄失敗');
      }
    } catch (error) {
      setError('登錄失敗，請稍後再試');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setComments([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/admin/comments', {
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
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/images');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('folder', 'travelogues');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchImages();
        setUploadFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const data = await response.json();
        setError(data.error || 'Upload failed');
      }
    } catch (error) {
      setError('Upload failed, please try again');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (publicId: string) => {
    if (!confirm('確定要刪除這張圖片嗎？')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }),
      });

      if (response.ok) {
        await fetchImages();
      } else {
        alert('刪除失敗');
      }
    } catch (error) {
      alert('刪除失敗');
    }
  };


  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這條留言嗎？')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchComments();
      } else {
        alert('刪除失敗');
      }
    } catch (error) {
      alert('刪除失敗');
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">管理員登錄</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密碼
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              登錄
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">管理員控制面板</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              登出
            </button>
          </div>
          
          {/* View Mode Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode('comments')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'comments'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              管理留言
            </button>
            <button
              onClick={() => setViewMode('images')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'images'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              管理照片
            </button>
          </div>

          {viewMode === 'comments' && (
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-sm text-blue-600 font-medium">總留言數</div>
              <div className="text-2xl font-bold text-blue-900">{comments.length}</div>
            </div>
          )}

          {viewMode === 'images' && (
            <div className="bg-green-50 p-4 rounded">
              <div className="text-sm text-green-600 font-medium">總圖片數</div>
              <div className="text-2xl font-bold text-green-900">{images.length}</div>
            </div>
          )}
        </div>

        {/* Comments View */}
        {viewMode === 'comments' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">所有留言</h2>
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">還沒有留言</div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border-l-4 border-gray-300 bg-gray-50 p-4 rounded"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {comment.name || '匿名'}
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
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        )}

        {/* Images View */}
        {viewMode === 'images' && (
          <div className="space-y-6">
            {/* Upload Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">上傳圖片</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-1">
                    選擇圖片
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? '上傳中...' : '上傳圖片'}
                </button>
              </form>
            </div>

            {/* Images Grid */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">所有圖片</h2>
              {images.length === 0 ? (
                <div className="text-center py-8 text-gray-500">還沒有圖片</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.public_id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt={image.public_id}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <p className="text-xs text-gray-500 mb-2 truncate">
                          {image.public_id}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{image.width} × {image.height}</span>
                          <span>{image.format.toUpperCase()}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(image.url);
                              alert('圖片 URL 已複製到剪貼板');
                            }}
                            className="flex-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                          >
                            複製 URL
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image.public_id)}
                            className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            刪除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

