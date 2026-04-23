import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export const FilterSidebar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedCondition,
  setSelectedCondition,
  selectedVerification,
  setSelectedVerification,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  categoryOptions,
  conditionOptions,
  verificationOptions,
  onClearFilters
}) => {
  const hasActiveFilters = searchQuery || selectedCategory || selectedCondition || selectedVerification || minPrice || maxPrice;

  return (
    <div className="mb-8 grid grid-cols-12 gap-4 rounded-[24px] bg-md-surface-container p-4 shadow-md-sm sm:p-6">
      <div className="col-span-12 lg:col-span-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-md-on-background/65" />
          <Input 
            placeholder="       Search items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="col-span-6 lg:col-span-2">
        <Select 
          options={categoryOptions}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="col-span-6 lg:col-span-2">
        <Select 
          options={conditionOptions}
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-2">
        <Select
          options={verificationOptions}
          value={selectedVerification}
          onChange={(e) => setSelectedVerification(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="col-span-6 sm:col-span-3 lg:col-span-1">
        <Input
          type="number"
          min="0"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="col-span-6 sm:col-span-3 lg:col-span-1">
        <Input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full"
        />
      </div>

      {hasActiveFilters && (
        <div className="col-span-12 lg:col-span-12 flex justify-start lg:justify-end">
          <Button variant="ghost" onClick={onClearFilters} className="w-full sm:w-auto">
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};