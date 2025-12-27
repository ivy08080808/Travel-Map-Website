/**
 * Cloudinary utility functions
 */

export function getCloudinaryImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
    format?: string;
  }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dn8qvxpea';
  
  let url = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  if (options) {
    const transformations: string[] = [];
    
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    
    if (transformations.length > 0) {
      url += `/${transformations.join(',')}`;
    }
  }
  
  url += `/${publicId}`;
  
  return url;
}

/**
 * Extract public_id from Cloudinary URL
 */
export function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/.*\/([^/]+)\.(jpg|jpeg|png|gif|webp|heic)/i);
  return match ? match[1] : null;
}

/**
 * Convert Cloudinary URL to web-friendly format (converts HEIC to JPG)
 */
export function convertCloudinaryUrlToWebFormat(url: string): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Check if URL contains HEIC format
  if (url.includes('.heic') || url.match(/\/heic/i)) {
    // Extract the path after /upload/
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;
    
    const beforeUpload = url.substring(0, uploadIndex + 8); // '/upload/'
    const afterUpload = url.substring(uploadIndex + 8);
    
    // Cloudinary URL structure: /upload/[transformations]/[version]/[path]
    // We need to insert f_jpg transformation before the version or path
    
    // Check if there's a version (starts with 'v' followed by numbers)
    const versionMatch = afterUpload.match(/^(v\d+)\//);
    
    if (versionMatch) {
      // Has version: /upload/v123456/path/file.heic
      // Convert to: /upload/f_jpg/v123456/path/file.jpg
      const version = versionMatch[1];
      const rest = afterUpload.substring(version.length + 1); // Remove version/
      const newPath = rest.replace(/\.heic$/i, '.jpg');
      return `${beforeUpload}f_jpg/${version}/${newPath}`;
    } else {
      // No version: /upload/path/file.heic
      // Convert to: /upload/f_jpg/path/file.jpg
      const newPath = afterUpload.replace(/\.heic$/i, '.jpg');
      return `${beforeUpload}f_jpg/${newPath}`;
    }
  }

  return url;
}

