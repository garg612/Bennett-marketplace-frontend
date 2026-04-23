import { Select } from '../ui/Select';

export const SortDropdown = ({ value, onChange }) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'views', label: 'Most Viewed' },
  ];

  return (
    <div className="w-44 sm:w-56">
      <Select
        options={sortOptions}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};