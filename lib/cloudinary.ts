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
  const match = url.match(/\/upload\/.*\/([^/]+)\.(jpg|jpeg|png|gif|webp)/i);
  return match ? match[1] : null;
}

