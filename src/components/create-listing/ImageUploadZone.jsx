import { useEffect, useMemo, useRef, useState } from 'react';
import { ImageIcon, X } from 'lucide-react';

export const ImageUploadZone = ({ imageFiles = [], onChange, onRemoveImage, isLoading }) => {
  const acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxFiles = 5;
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const previewUrls = useMemo(() => {
    return imageFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
  }, [imageFiles]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previewUrls]);

  const emitSelectedFiles = (rawFiles) => {
    const incoming = Array.from(rawFiles || []).filter((file) => acceptedMimeTypes.includes(file.type));

    if (!incoming.length) {
      return;
    }

    const remainingSlots = maxFiles - imageFiles.length;
    if (remainingSlots <= 0) {
      return;
    }

    const limitedFiles = incoming.slice(0, remainingSlots);

    onChange({
      target: {
        name: 'imageFiles',
        files: limitedFiles
      }
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (isLoading) {
      return;
    }

    emitSelectedFiles(event.dataTransfer.files);
  };

  const handleInputChange = (event) => {
    emitSelectedFiles(event.target.files);
    event.target.value = '';
  };

  const handleBrowseClick = (event) => {
    event.preventDefault();
    if (!isLoading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="listing-image" className="block text-label text-md-on-background">Item Photo</label>
      <label
        htmlFor="listing-image"
        className={`group mt-1 flex cursor-pointer justify-center rounded-md border border-dashed px-6 pb-6 pt-5 transition-colors duration-200 ${
          isDragging
            ? 'border-md-primary bg-md-secondary-container/35'
            : 'border-md-outline bg-md-background hover:border-md-primary hover:bg-md-secondary-container/25'
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          if (!isLoading) {
            setIsDragging(true);
          }
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-md-primary" />
          <div className="flex justify-center text-sm text-md-on-background">
            <button
              type="button"
              onClick={handleBrowseClick}
              className="focus-ring rounded-md px-2 py-1 font-medium text-md-primary hover:bg-md-secondary-container/40"
              disabled={isLoading || imageFiles.length >= maxFiles}
            >
              {imageFiles.length ? 'Add more images' : 'Upload images'}
            </button>
            <p className="pl-1 text-md-on-background/80">or drag and drop</p>
          </div>
          <p className="text-xs text-md-on-background/70">
            JPEG, PNG, WEBP up to 5MB each (max 5)
          </p>
        </div>
      </label>

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {previewUrls.map((preview, index) => (
            <div key={`${preview.name}-${index}`} className="relative overflow-hidden rounded-md border border-md-outline/25 bg-md-background">
              <img src={preview.url} alt={preview.name} className="h-32 w-full object-contain bg-md-surface-container" />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="focus-ring absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-md-on-background text-md-background transition-colors duration-200 hover:bg-md-primary"
                disabled={isLoading}
                aria-label={`Remove ${preview.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        id="listing-image"
        type="file"
        name="imageFiles"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleInputChange}
        disabled={isLoading || imageFiles.length >= maxFiles}
        className="sr-only"
      />
    </div>
  );
};