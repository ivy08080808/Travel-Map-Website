'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { dailyLife } from '@/lib/data';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import imageCompression from 'browser-image-compression';
import { convertCloudinaryUrlToWebFormat } from '@/lib/cloudinary';

// 動態導入 ReactQuill，避免 SSR 問題
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

function DailyLifeEditContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dailyLifeId = params.id as string;
  const isNew = dailyLifeId === 'new';
  const categoryParam = searchParams?.get('category') as 'daily' | 'reading' | null;

  const [dailyLifeItem, setDailyLifeItem] = useState(
    isNew ? null : dailyLife.find((d) => d.id === dailyLifeId)
  );
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<'reading' | 'daily' | ''>(categoryParam || '');
  const [content, setContent] = useState('');
  const [newId, setNewId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    if (isNew && categoryParam) {
      setCategory(categoryParam);
      // 生成新的 ID
      const generatedId = `daily-life-${Date.now()}`;
      setNewId(generatedId);
    }
    if (isNew) {
      // 檢查是否已登錄
      checkAuth();
      return;
    }

    // 即使不在 data.ts 中，也嘗試從 MongoDB 加載
    // 檢查是否已登錄
    checkAuthAndLoadCover();
  }, [dailyLifeId, categoryParam]);

  const checkAuth = async () => {
    try {
      const authResponse = await fetch('/api/admin/comments');
      if (!authResponse.ok) {
        router.push('/admin');
        return;
      }
    } catch (error) {
      router.push('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthAndLoadCover = async () => {
    try {
      // 檢查是否已登錄
      const authResponse = await fetch('/api/admin/comments');
      if (!authResponse.ok) {
        router.push('/admin');
        return;
      }

      // 先嘗試從 MongoDB 獲取數據
      const textResponse = await fetch(
        `/api/admin/daily-life/${dailyLifeId}`
      );
      
      if (textResponse.ok) {
        const data = await textResponse.json();
        // 如果 MongoDB 中有數據，使用 MongoDB 的數據
        if (data.title || data.description) {
          setTitle(data.title || '');
          setDescription(data.description || '');
          setDate(data.date || '');
          setAuthor(data.author || '');
          setCategory(data.category || '');
        } else {
          // MongoDB 中沒有，使用 data.ts 中的默認值
          setTitle(dailyLifeItem?.title || '');
          setDescription(dailyLifeItem?.description || '');
          setDate(dailyLifeItem?.date || '');
          setAuthor((dailyLifeItem as any)?.author || '');
          setCategory(dailyLifeItem?.category || '');
        }
      } else {
        // 如果 MongoDB 中沒有，檢查 data.ts 中是否有
        if (!dailyLifeItem) {
          setError('Daily Life not found');
          setIsLoading(false);
          return;
        }
        // 使用 data.ts 中的默認值
        setTitle(dailyLifeItem.title || '');
        setDescription(dailyLifeItem.description || '');
        setDate(dailyLifeItem.date || '');
        setAuthor((dailyLifeItem as any)?.author || '');
        setCategory(dailyLifeItem.category || '');
      }

      // 獲取封面圖片
      const coverResponse = await fetch(
        `/api/admin/daily-life/${dailyLifeId}/cover`
      );
      if (coverResponse.ok) {
        const data = await coverResponse.json();
        console.log('Loaded cover image from MongoDB:', data);
        setCoverImage(data.coverImage || dailyLifeItem?.coverImage || null);
      } else {
        console.log('No cover image in MongoDB, using default');
        if (dailyLifeItem?.coverImage) {
          setCoverImage(dailyLifeItem.coverImage);
        }
      }

      // 獲取 HTML 內容
      const contentResponse = await fetch(
        `/api/admin/daily-life/${dailyLifeId}/content`
      );
      if (contentResponse.ok) {
        const data = await contentResponse.json();
        setContent(data.content || '');
      }
    } catch (error) {
      console.error('Error loading cover:', error);
      // 如果出錯且不在 data.ts 中，顯示錯誤
      if (!dailyLifeItem) {
        setError('Daily Life not found');
      }
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
          `/api/admin/daily-life/${dailyLifeId}/cover`,
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      
      // 如果文件超過 10MB，自動壓縮
      if (file.size > 10485760) {
        setIsCompressing(true);
        try {
          const options = {
            maxSizeMB: 10, // 目標大小 10MB
            maxWidthOrHeight: 3840, // 最大寬高（保持高解析度）
            useWebWorker: true, // 使用 Web Worker 加速
            fileType: file.type, // 保持原始格式
            initialQuality: 0.92, // 初始品質（高品質）
          };

          const compressedFile = await imageCompression(file, options);
          
          // 如果壓縮後還是超過 10MB，進一步壓縮
          if (compressedFile.size > 10485760) {
            const furtherCompressed = await imageCompression(file, {
              ...options,
              initialQuality: 0.85,
              maxWidthOrHeight: 2560,
            });
            setUploadFile(furtherCompressed);
            setSuccess(`圖片已自動壓縮：${(file.size / 1024 / 1024).toFixed(2)} MB → ${(furtherCompressed.size / 1024 / 1024).toFixed(2)} MB`);
          } else {
            setUploadFile(compressedFile);
            setSuccess(`圖片已自動壓縮：${(file.size / 1024 / 1024).toFixed(2)} MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
          }
          setTimeout(() => setSuccess(null), 5000);
        } catch (error) {
          console.error('壓縮錯誤:', error);
          setError('圖片壓縮失敗，請手動壓縮後再試');
        } finally {
          setIsCompressing(false);
        }
      } else {
        setUploadFile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setError('請先選擇圖片');
      return;
    }

    // 如果文件還是超過 10MB，再次壓縮
    let fileToUpload = uploadFile;
    if (uploadFile.size > 10485760) {
      setIsCompressing(true);
      try {
        const options = {
          maxSizeMB: 10,
          maxWidthOrHeight: 2560,
          useWebWorker: true,
          fileType: uploadFile.type,
          initialQuality: 0.85,
        };
        fileToUpload = await imageCompression(uploadFile, options);
        setUploadFile(fileToUpload); // 更新狀態
        setSuccess(`圖片已進一步壓縮至 ${(fileToUpload.size / 1024 / 1024).toFixed(2)} MB`);
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error('壓縮錯誤:', error);
        setError('圖片壓縮失敗');
        setIsCompressing(false);
        return;
      } finally {
        setIsCompressing(false);
      }
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);
                    formData.append('folder', `daily-life/${isNew ? newId : dailyLifeId}`);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload API response:', data);
        
        // 檢查返回的數據結構
        const imageUrl = data.url || data.secure_url;
        if (!imageUrl) {
          console.error('No image URL in response:', data);
          setError('上傳成功但未返回圖片 URL');
          setIsUploading(false);
          return;
        }
        
        console.log('Upload successful, image URL:', imageUrl);
        console.log('Public ID:', data.public_id);

        // 更新到 MongoDB
        const targetId = isNew ? newId : dailyLifeId;
        const updateResponse = await fetch(
          `/api/admin/daily-life/${targetId}/cover`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ coverImage: imageUrl }),
          }
        );

        if (updateResponse.ok) {
          const updateData = await updateResponse.json();
          console.log('MongoDB update response:', updateData);
          setCoverImage(imageUrl);
          setSuccess('封面圖片已成功更新！');
          setUploadFile(null);
          // 重置文件輸入
          const fileInput = document.getElementById('file-input') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
          setTimeout(() => setSuccess(null), 3000);
        } else {
          const errorData = await updateResponse.json();
          console.error('Failed to update MongoDB:', errorData);
          setError('更新封面圖片失敗: ' + (errorData.error || 'Unknown error'));
        }
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        // 顯示詳細的錯誤訊息
        let errorMessage = errorData.error || '上傳失敗';
        // 如果是文件大小錯誤，提供更友好的訊息
        if (errorMessage.includes('File size too large')) {
          errorMessage = '文件大小超過 10MB（Cloudinary 免費計劃限制）。請壓縮圖片後再試，或升級 Cloudinary 計劃。';
        }
        setError(errorMessage);
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
      if (isNew) {
        // 創建新的 Daily Life
        if (category === 'reading') {
          if (!title || !description || !author) {
            setError('標題、描述和作者為必填項');
            setIsSaving(false);
            return;
          }
        } else {
          if (!title || !description || !date) {
            setError('標題、描述和日期為必填項');
            setIsSaving(false);
            return;
          }
        }

        const finalId = newId || `daily-life-${Date.now()}`;
        const body: any = {
          id: finalId,
          title,
          description,
          category: category || null,
        };
        if (category === 'reading') {
          body.author = author;
        } else {
          body.date = date;
        }
        if (coverImage) body.coverImage = coverImage;

        const response = await fetch('/api/admin/daily-life', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          setSuccess('Daily Life 已成功創建！');
          setTimeout(() => {
            const finalCategory = category || categoryParam || 'daily';
            router.push(`/admin/daily-life?category=${finalCategory}`);
          }, 2000);
        } else {
          const errorData = await response.json();
          setError(errorData.error || '創建失敗');
        }
        setIsSaving(false);
        return;
      }

      // 更新現有的 Daily Life
      const updateBody: any = {
        title,
        description,
        category: category || null,
      };
      if (category === 'reading') {
        updateBody.author = author;
      } else {
        updateBody.date = date;
      }
      
      const response = await fetch(
        `/api/admin/daily-life/${dailyLifeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateBody),
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

  const handleSaveContent = async () => {
    setIsSavingContent(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/daily-life/${dailyLifeId}/content`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      );

      if (response.ok) {
        setSuccess('文章內容已成功保存！');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('保存文章內容失敗');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setError('保存文章內容失敗');
    } finally {
      setIsSavingContent(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  // 只有在不是新增模式，且沒有標題（表示 MongoDB 和 data.ts 都沒有）時才顯示錯誤
  if (!isNew && !title && !dailyLifeItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            找不到此 Daily Life
          </h1>
          <button
            onClick={() => {
              const finalCategory = category || categoryParam || 'daily';
              router.push(`/admin/daily-life?category=${finalCategory}`);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回管理頁面
          </button>
        </div>
      </div>
    );
  }

  const displayImage = coverImage || (dailyLifeItem?.coverImage || null);
  
  // Check if image is from Cloudinary
  const isCloudinaryUrl = displayImage?.startsWith('http') || displayImage?.includes('cloudinary');
  let imageUrl = displayImage 
    ? (isCloudinaryUrl 
        ? convertCloudinaryUrlToWebFormat(displayImage) // Convert HEIC to JPG for web display
        : displayImage.startsWith('/')
        ? displayImage
        : `/images/${displayImage}`)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <button
              onClick={() => {
                const finalCategory = category || categoryParam || 'daily';
                router.push(`/admin/daily-life?category=${finalCategory}`);
              }}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← 返回 Daily Life 管理
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isNew ? '新增 Daily Life' : '編輯 Daily Life'}
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

          {/* 封面圖片區域 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">封面圖片</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                當前封面圖片
              </label>
              {displayImage && (
                <div className="mb-2 text-xs text-gray-500">
                  圖片 URL: {displayImage}
                </div>
              )}
              <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={title || dailyLifeItem?.title || 'Daily Life'}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                    unoptimized={isCloudinaryUrl}
                    onError={(e) => {
                      console.error('Image load error:', e);
                      console.error('Image URL:', imageUrl);
                    }}
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
                選擇圖片文件上傳（超過 10MB 將自動壓縮，盡量保持畫質）
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
                  disabled={isUploading || isCompressing || !uploadFile}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompressing ? '壓縮中...' : isUploading ? '上傳中...' : '上傳封面圖片'}
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
              {category === 'reading' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    作者
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="輸入作者名稱"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    日期 (格式: YYYY-MM)
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2025-12-24"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分類
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'reading' | 'daily' | '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">無分類</option>
                  <option value="reading">讀書心得</option>
                  <option value="daily">日常分享</option>
                </select>
              </div>
              {isNew && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID（自動生成，可修改）
                  </label>
                  <input
                    type="text"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="daily-life-xxxxx"
                  />
                </div>
              )}
              <button
                onClick={handleSaveText}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? '保存中...' : isNew ? '創建 Daily Life' : '保存文字內容'}
              </button>
            </div>
          </div>

          {/* 文章內容編輯區域 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">文章內容</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  編輯文章內容（HTML）
                </label>
                {typeof window !== 'undefined' && (
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    style={{ minHeight: '400px' }}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ indent: '-1' }, { indent: '+1' }],
                        ['link', 'image'],
                        [{ align: [] }],
                        ['clean'],
                      ],
                    }}
                  />
                )}
              </div>
              <button
                onClick={handleSaveContent}
                disabled={isSavingContent}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isSavingContent ? '保存中...' : '保存文章內容'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DailyLifeCoverPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">載入中...</div>
      </div>
    }>
      <DailyLifeEditContent />
    </Suspense>
  );
}

