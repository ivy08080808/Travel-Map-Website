'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { travelogues } from '@/lib/data';
import Image from 'next/image';

export default function TravelogueCoverPage() {
  const params = useParams();
  const router = useRouter();
  const travelogueId = params.id as string;

  const [travelogue, setTravelogue] = useState(
    travelogues.find((t) => t.id === travelogueId)
  );
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    if (!travelogue) {
      setError('Travelogue not found');
      setIsLoading(false);
      return;
    }

    // 檢查是否已登錄
    checkAuthAndLoadCover();
  }, [travelogueId]);

  const checkAuthAndLoadCover = async () => {
    try {
      // 檢查是否已登錄
      const authResponse = await fetch('/api/admin/comments');
      if (!authResponse.ok) {
        router.push('/admin');
        return;
      }

      // 獲取封面圖片
      const coverResponse = await fetch(
        `/api/admin/travelogues/${travelogueId}/cover`
      );
      if (coverResponse.ok) {
        const data = await coverResponse.json();
        setCoverImage(data.coverImage || travelogue?.coverImage || null);
      }

      // 獲取文字內容
      const textResponse = await fetch(
        `/api/admin/travelogues/${travelogueId}`
      );
      if (textResponse.ok) {
        const data = await textResponse.json();
        setTitle(data.title || travelogue?.title || '');
        setDescription(data.description || travelogue?.description || '');
        setDate(data.date || travelogue?.date || '');
      } else {
        // 如果 MongoDB 中沒有，使用 data.ts 中的默認值
        setTitle(travelogue?.title || '');
        setDescription(travelogue?.description || '');
        setDate(travelogue?.date || '');
      }
    } catch (error) {
      console.error('Error loading cover:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = async (result: any) => {
    if (result.event === 'success') {
      setIsUploading(false);
      const imageUrl = result.info.secure_url;

      try {
        // 更新到 MongoDB
        const response = await fetch(
          `/api/admin/travelogues/${travelogueId}/cover`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ coverImage: imageUrl }),
          }
        );

        if (response.ok) {
          setCoverImage(imageUrl);
          setSuccess('封面圖片已成功更新！');
          setError(null);
          // 3秒後清除成功訊息
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError('更新封面圖片失敗');
        }
      } catch (error) {
        console.error('Error updating cover:', error);
        setError('更新封面圖片失敗');
      }
    }
  };

  const handleUploadError = (error: any) => {
    setIsUploading(false);
    setError(error?.message || '圖片上傳失敗');
    console.error('Cloudinary upload error:', error);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 檢查文件大小 (20MB)
      if (file.size > 20000000) {
        setError('文件大小超過 20MB，請選擇較小的圖片');
        return;
      }
      setUploadFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setError('請先選擇圖片');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('folder', `travelogues/${travelogueId}`);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.url;

        // 更新到 MongoDB
        const updateResponse = await fetch(
          `/api/admin/travelogues/${travelogueId}/cover`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ coverImage: imageUrl }),
          }
        );

        if (updateResponse.ok) {
          setCoverImage(imageUrl);
          setSuccess('封面圖片已成功更新！');
          setUploadFile(null);
          // 重置文件輸入
          const fileInput = document.getElementById('file-input') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError('更新封面圖片失敗');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || '上傳失敗');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      setError('上傳失敗，請稍後再試');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveText = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/travelogues/${travelogueId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            date,
          }),
        }
      );

      if (response.ok) {
        setSuccess('文字內容已成功更新！');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('更新文字內容失敗');
      }
    } catch (error) {
      console.error('Error updating text:', error);
      setError('更新文字內容失敗');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  if (!travelogue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            找不到此 Travelogue
          </h1>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回管理頁面
          </button>
        </div>
      </div>
    );
  }

  const displayImage = coverImage || travelogue.coverImage;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <button
              onClick={() => router.push('/admin')}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← 返回管理頁面
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              管理 Travelogue
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* 文字內容編輯區域 */}
          <div className="mb-6 border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">文字內容</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  標題
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  日期 (格式: YYYY-MM)
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2024-12"
                />
              </div>
              <button
                onClick={handleSaveText}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? '保存中...' : '保存文字內容'}
              </button>
            </div>
          </div>

          {/* 封面圖片區域 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">封面圖片</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                當前封面圖片
              </label>
              <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt={travelogue.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    尚未上傳封面圖片
                  </div>
                )}
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">
                選擇圖片文件上傳（最大 20MB）
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
                    選擇圖片
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {uploadFile && (
                    <p className="text-sm text-gray-500 mt-2">
                      已選擇: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !uploadFile}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? '上傳中...' : '上傳封面圖片'}
                </button>
                {coverImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">圖片 URL:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={coverImage}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(coverImage);
                          setSuccess('URL 已複製到剪貼板');
                          setTimeout(() => setSuccess(null), 2000);
                        }}
                        className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                      >
                        複製
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

