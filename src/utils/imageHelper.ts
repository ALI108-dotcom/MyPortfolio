/**
 * Reads and optimizes an image file selected via the file input / File Explorer.
 * Resizes large dimensions to max 1200px and compresses to high-quality JPEG (0.88)
 * to keep persistence payloads lightweight and fast.
 */
export function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image (JPG, PNG, WEBP, etc.)'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file from disk.'));
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onerror = () => resolve(dataUrl); // Fallback to raw data URL
      img.onload = () => {
        try {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(dataUrl);

          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          resolve(compressed);
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
