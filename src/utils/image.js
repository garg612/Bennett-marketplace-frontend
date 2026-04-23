export const getOptimizedImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Apply high-quality Cloudinary delivery params when possible.
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto:best,dpr_auto/');
  }

  return url;
};
