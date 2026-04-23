export const filterProducts = (products, filters) => {
  const {
    searchQuery = '',
    selectedCategory = '',
    selectedCondition = '',
    selectedVerification = '',
    minPrice = '',
    maxPrice = ''
  } = filters;

  const normalizedSearch = searchQuery.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch = normalizedSearch
      ? product.title.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch)
      : true;

    const matchesCategory = selectedCategory
      ? product.category.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    const matchesCondition = selectedCondition
      ? product.condition === selectedCondition
      : true;

    const isVerifiedSeller = product?.seller?.studentVerification?.status === 'verified';
    const matchesVerification = selectedVerification === ''
      ? true
      : (selectedVerification === 'verified' ? isVerifiedSeller : !isVerifiedSeller);

    const meetsMinPrice = minPrice === '' || product.price >= Number(minPrice);
    const meetsMaxPrice = maxPrice === '' || product.price <= Number(maxPrice);

    return matchesSearch && matchesCategory && matchesCondition && matchesVerification && meetsMinPrice && meetsMaxPrice;
  });
};