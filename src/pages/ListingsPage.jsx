import { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageHeader } from '../components/ui/PageHeader';
import { FilterSidebar } from '../components/listings/FilterSidebar';
import { ListingsGrid } from '../components/listings/ListingsGrid';
import { ActiveFilters } from '../components/listings/ActiveFilters';
import { ResultsCount } from '../components/listings/ResultsCount';
import { SortDropdown } from '../components/listings/SortDropdown';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { filterProducts } from '../utils/filterProducts';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { motionTokens } from '../utils/motion';

gsap.registerPlugin(ScrollTrigger);

export const ListingsPage = () => {
  const pageRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedVerification, setSelectedVerification] = useState('');
  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to load listings.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categoryOptions = categoryService.getAllCategories().map(cat => ({
    value: cat.toLowerCase(),
    label: cat
  }));

  const conditionOptions = [
    { value: 'New', label: 'New' },
    { value: 'Like New', label: 'Like New' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
  ];

  const verificationOptions = [
    { value: 'verified', label: 'Verified Sellers' },
    { value: 'unverified', label: 'Unverified Sellers' }
  ];

  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      searchQuery,
      selectedCategory,
      selectedCondition,
      selectedVerification,
      minPrice,
      maxPrice
    });
  }, [products, searchQuery, selectedCategory, selectedCondition, selectedVerification, minPrice, maxPrice]);

  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    if (sortBy === 'price_asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'views') {
      sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  const handleCategoryChange = (val) => {
    setSelectedCategory(val);
    setSearchParams(val ? { category: val } : {});
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCondition('');
    setSelectedVerification('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setSearchParams({});
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.js-listings-reveal',
        { autoAlpha: 0, y: motionTokens.pageRevealYOffset },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionTokens.pageRevealDuration,
          ease: motionTokens.ease,
          stagger: motionTokens.pageRevealStagger,
        }
      );
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={pageRef} className="px-6 py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="js-listings-reveal mb-10 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <PageHeader 
              title="Marketplace" 
              subtitle="Discover items from fellow Bennett students."
            />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <p className="max-w-[420px] rounded-[24px] bg-md-surface-container p-6 text-body text-md-on-background/75 shadow-md-sm">
              Explore verified campus listings with structured filtering and fast local discovery.
            </p>
          </div>
        </div>

        <div className="js-listings-reveal">
          <FilterSidebar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition}
            selectedVerification={selectedVerification}
            setSelectedVerification={setSelectedVerification}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            categoryOptions={categoryOptions}
            conditionOptions={conditionOptions}
            verificationOptions={verificationOptions}
            onClearFilters={clearFilters}
          />
        </div>

        <div className="js-listings-reveal">
          <ActiveFilters 
            category={selectedCategory} 
            condition={selectedCondition}
            verification={selectedVerification}
            onClearCategory={() => handleCategoryChange('')}
            onClearCondition={() => setSelectedCondition('')}
            onClearVerification={() => setSelectedVerification('')}
          />
        </div>

        <div className="js-listings-reveal mb-8 flex flex-col items-start justify-between gap-4 rounded-[24px] bg-md-surface-container px-5 py-4 shadow-md-sm sm:flex-row sm:items-end">
          <ResultsCount count={sortedProducts.length} />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {isLoading && (
          <div className="js-listings-reveal flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        )}

        {!isLoading && error && (
          <div className="js-listings-reveal">
            <ErrorMessage
              title="Unable to load listings"
              message={error}
              action={<Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>}
            />
          </div>
        )}

        {!isLoading && !error && sortedProducts.length > 0 ? (
          <div className="js-listings-reveal">
            <ListingsGrid products={sortedProducts} onClearFilters={clearFilters} />
          </div>
        ) : null}

        {!isLoading && !error && sortedProducts.length === 0 ? (
          <div className="js-listings-reveal flex flex-col items-center justify-center rounded-[24px] bg-md-surface-container-low py-20 shadow-md-sm">
            <ErrorMessage 
              title="No matches found" 
              message="Try adjusting your filters or search terms. Maybe search for something else?"
              action={<Button variant="outline" onClick={clearFilters}>Reset All Filters</Button>}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};