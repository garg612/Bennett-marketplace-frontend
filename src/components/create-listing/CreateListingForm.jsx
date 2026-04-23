import { Upload } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { ImageUploadZone } from './ImageUploadZone';

export const CreateListingForm = ({ 
  formData, 
  onChange, 
  onSubmit, 
  isLoading, 
  error,
  categoryOptions, 
  conditionOptions, 
  onRemoveImage,
  submitLabel = 'Post Listing',
  onCancel 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8 p-6 sm:p-8">
      
      <ImageUploadZone imageFiles={formData.imageFiles} onChange={onChange} onRemoveImage={onRemoveImage} isLoading={isLoading} />

      {error && (
        <div className="rounded-[16px] bg-md-tertiary/12 p-3 text-sm text-md-tertiary">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <Input 
            label="Listing Title" 
            name="title"
            placeholder="e.g. Introduction to Algorithms 3rd Edition"
            value={formData.title}
            onChange={onChange}
            required
            minLength={2}
            maxLength={60}
          />
        </div>

        <Input 
          label="Price (₹)" 
          name="price"
          type="number"
          min="0"
          placeholder="0.00"
          value={formData.price}
          onChange={onChange}
          required
        />

        <Select 
          label="Category"
          name="category"
          options={categoryOptions}
          value={formData.category}
          onChange={onChange}
          required
        />

        <Select 
          label="Condition"
          name="condition"
          options={conditionOptions}
          value={formData.condition}
          onChange={onChange}
          required
        />

        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label htmlFor="description" className="text-label text-md-on-background">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            className="textarea-material focus-ring flex min-h-[132px] w-full resize-y"
            placeholder="Describe your item in detail..."
            value={formData.description}
            onChange={onChange}
            required
            minLength={10}
          />
          <p className="text-xs text-md-on-background/70">Minimum 10 characters.</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-md-outline/35 pt-6">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" size="lg" isLoading={isLoading} className="w-full sm:w-auto">
          <Upload className="mr-2 h-4 w-4" />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};