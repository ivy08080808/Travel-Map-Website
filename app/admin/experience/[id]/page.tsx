'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { convertCloudinaryUrlToWebFormat } from '@/lib/cloudinary';
import { Experience, ExperienceType, ExperienceCategory } from '@/lib/data';

function ExperienceEditContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const experienceId = params.id as string;
  const isNew = experienceId === 'new';
  const categoryParam = searchParams?.get('category') as 'work' | 'exchange' | null;

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [type, setType] = useState<ExperienceType | ''>('');
  const [category, setCategory] = useState<ExperienceCategory | ''>(categoryParam || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    if (isNew && categoryParam) {
      setCategory(categoryParam);
    }
    if (isNew) {
      setIsLoading(false);
      return;
    }
    checkAuthAndLoad();
  }, [experienceId, categoryParam]);

  const checkAuthAndLoad = async () => {
    try {
      const authResponse = await fetch('/api/admin/comments');
      if (!authResponse.ok) {
        router.push('/admin');
        return;
      }

      const response = await fetch(`/api/admin/experience/${experienceId}`);
      if (response.ok) {
        const data = await response.json();
        setTitle(data.title || '');
        setOrganization(data.organization || '');
        setRole(data.role || '');
        setStartDate(data.startDate || '');
        setEndDate(data.endDate || '');
        setLocation(data.location || '');
        setDescription(data.description || '');
        setSkills(data.skills || []);
        setType(data.type || '');
        setCategory(data.category || '');
        setCoverImage(data.coverImage || null);
      }
    } catch (error) {
      console.error('Error loading experience:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      
      if (file.size > 10485760) {
        setIsCompressing(true);
        try {
          const options = {
            maxSizeMB: 10,
            maxWidthOrHeight: 3840,
            useWebWorker: true,
            fileType: file.type,
            initialQuality: 0.92,
          };

          const compressedFile = await imageCompression(file, options);
          
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
        setUploadFile(fileToUpload);
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
      formData.append('folder', `experience/${experienceId}`);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.url || data.secure_url;
        
        if (!imageUrl) {
          setError('上傳成功但未返回圖片 URL');
          setIsUploading(false);
          return;
        }

        const updateResponse = await fetch(
          `/api/admin/experience/${experienceId}/cover`,
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

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSave = async () => {
    // All fields are optional now, but we need at least an id
    if (isNew && !experienceId) {
      setError('請提供 ID');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isNew) {
        // 創建新經驗需要生成 ID
        const newId = `experience-${Date.now()}`;
        const body: any = {
          id: newId,
        };
        if (title) body.title = title;
        if (organization) body.organization = organization;
        if (role) body.role = role;
        if (startDate) body.startDate = startDate;
        if (endDate) body.endDate = endDate;
        if (location) body.location = location;
        if (description) body.description = description;
        if (skills && skills.length > 0) body.skills = skills;
        if (type) body.type = type;
        if (category) body.category = category;
        if (coverImage) body.coverImage = coverImage;

        const response = await fetch('/api/admin/experience', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          setSuccess('Experience 已成功創建！');
          setTimeout(() => {
            const finalCategory = body.category || categoryParam || 'work';
            router.push(`/admin/experience?category=${finalCategory}`);
          }, 2000);
        } else {
          const errorData = await response.json();
          setError(errorData.error || '創建失敗');
        }
        setIsSaving(false);
        return;
      }

      // 更新現有經驗
      const url = `/api/admin/experience/${experienceId}`;
      const body: any = {};
      if (title !== undefined) body.title = title || null;
      if (organization !== undefined) body.organization = organization || null;
      if (role !== undefined) body.role = role || null;
      if (startDate !== undefined) body.startDate = startDate || null;
      if (endDate !== undefined) body.endDate = endDate || null;
      if (location !== undefined) body.location = location || null;
      if (description !== undefined) body.description = description || null;
      if (skills !== undefined) body.skills = skills || [];
      if (type !== undefined) body.type = type || null;
      if (category !== undefined) body.category = category || null;
      if (coverImage !== undefined) body.coverImage = coverImage || null;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setSuccess('Experience 已成功更新！');
        setTimeout(() => {
          const finalCategory = body.category || category || categoryParam || 'work';
          router.push(`/admin/experience?category=${finalCategory}`);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || '更新失敗');
      }
    } catch (error) {
      console.error('Error saving:', error);
      setError('保存失敗');
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

  const displayImage = coverImage;
  const isCloudinaryUrl = displayImage?.startsWith('http') || displayImage?.includes('cloudinary');
  const imageUrl = displayImage
    ? (isCloudinaryUrl
        ? convertCloudinaryUrlToWebFormat(displayImage)
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
                const finalCategory = category || categoryParam || 'work';
                router.push(`/admin/experience?category=${finalCategory}`);
              }}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← 返回 Experience 管理
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isNew ? '新增 Experience' : '編輯 Experience'}
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
            {displayImage && (
              <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-4">
                <Image
                  src={imageUrl || displayImage}
                  alt="Cover"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                  unoptimized={isCloudinaryUrl}
                />
              </div>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              />
              {uploadFile && (
                <p className="text-sm text-gray-500 mb-2">
                  已選擇: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              <button
                onClick={handleUpload}
                disabled={isUploading || isCompressing || !uploadFile}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isCompressing ? '壓縮中...' : isUploading ? '上傳中...' : '上傳封面圖片'}
              </button>
            </div>
          </div>

          {/* 表單區域 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                標題
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                組織/公司
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                職位/角色
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  開始日期 (YYYY-MM)
                </label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="2024-01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  結束日期 (YYYY-MM，留空表示進行中)
                </label>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="2024-12"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                地點
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分類
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExperienceCategory | '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- 選擇分類 --</option>
                  <option value="work">工作經驗 (Professional Experience)</option>
                  <option value="exchange">交換經驗 (Exchange Experience)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  類型
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ExperienceType | '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- 選擇類型 --</option>
                  <option value="internship">實習 (Internship)</option>
                  <option value="volunteer">志工 (Volunteer)</option>
                  <option value="selection">徵選選上 (Selection)</option>
                  <option value="other">其他 (Other)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                技能
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="輸入技能後按 Enter"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  新增
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? '保存中...' : isNew ? '創建 Experience' : '保存更改'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceEditPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    }>
      <ExperienceEditContent />
    </Suspense>
  );
}

