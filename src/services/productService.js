import { apiClient } from '../api/client';

const productListCache = new Map();

const normalizeProduct = (product) => {
  if (!product) return null;

  const seller = product.seller && typeof product.seller === 'object'
    ? product.seller
    : { id: product.seller, name: 'Unknown Seller', email: '' };

  return {
    id: String(product.id || product._id),
    title: product.title || product.name,
    name: product.name || product.title,
    category: product.category,
    price: product.price,
    condition: product.condition || 'Good',
    description: product.description,
    images: Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : (product.image ? [product.image] : []),
    image: product.image,
    seller: {
      id: String(seller.id || seller._id || ''),
      name: seller.name || 'Unknown Seller',
      email: seller.email || '',
      avatar: seller.avatar || '',
      studentVerification: {
        status: seller.studentVerification?.status || 'unverified',
        idCardFront: seller.studentVerification?.idCardFront || '',
        idCardBack: seller.studentVerification?.idCardBack || '',
        submittedAt: seller.studentVerification?.submittedAt || null,
        reportCount: Number(seller.studentVerification?.reportCount || 0)
      }
    },
    listedAt: product.listedAt || product.createdAt || new Date().toISOString(),
    views: product.views || 0,
    tags: product.tags || [],
    status: product.status || 'available',
    viewerReservationStatus: product.viewerReservationStatus || null,
    viewerReservationId: product.viewerReservationId ? String(product.viewerReservationId) : null
  };
};

export const productService = {
  async getAllProducts({ page = 1, limit = 50 } = {}) {
    const cacheKey = `page=${page}&limit=${limit}`;
    const cached = productListCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const requestPromise = (async () => {
      const response = await apiClient.get(`/api/products?page=${page}&limit=${limit}`);
      const docs = response?.data?.products?.docs || [];
      return docs.map(normalizeProduct);
    })();

    productListCache.set(cacheKey, requestPromise);

    try {
      const products = await requestPromise;
      productListCache.set(cacheKey, Promise.resolve(products));
      return products;
    } catch (error) {
      productListCache.delete(cacheKey);
      throw error;
    }
  },

  async getFeaturedProducts(limit = 4) {
    const products = await this.getAllProducts({ page: 1, limit });
    return products.slice(0, limit);
  },

  async getProductById(id) {
    const response = await apiClient.get(`/api/products/${id}`);
    return normalizeProduct(response?.data?.product);
  },

  async getProductsBySellerId(sellerId) {
    const products = await this.getAllProducts({ page: 1, limit: 50 });
    return products.filter((product) => String(product.seller.id) === String(sellerId));
  },

  async getMyProducts() {
    const response = await apiClient.get('/api/products/mine');
    const products = response?.data?.products || [];
    return products.map(normalizeProduct);
  },

  async createProduct(productInput) {
    const formData = new FormData();
    formData.append('name', productInput.title || productInput.name || 'Untitled Product');
    formData.append('description', productInput.description || '');
    formData.append('price', String(productInput.price));
    formData.append('category', productInput.category || 'Other');

    if (productInput.condition) {
      formData.append('condition', productInput.condition);
    }

    if (productInput.tags && productInput.tags.length > 0) {
      formData.append('tags', JSON.stringify(productInput.tags));
    }

    if (Array.isArray(productInput.imageFiles) && productInput.imageFiles.length > 0) {
      productInput.imageFiles.forEach((file) => {
        formData.append('images', file);
      });
    } else if (productInput.imageFile) {
      formData.append('image', productInput.imageFile);
    }

    const response = await apiClient.post('/api/products/createproduct', formData);
    return normalizeProduct(response?.data?.product);
  },

  async updateProduct(productId, productInput) {
    const formData = new FormData();

    if (productInput.title !== undefined) {
      formData.append('name', productInput.title);
    }

    if (productInput.description !== undefined) {
      formData.append('description', productInput.description);
    }

    if (productInput.price !== undefined && productInput.price !== null && productInput.price !== '') {
      formData.append('price', String(productInput.price));
    }

    if (productInput.category !== undefined) {
      formData.append('category', productInput.category);
    }

    if (productInput.condition !== undefined) {
      formData.append('condition', productInput.condition);
    }

    if (Array.isArray(productInput.imageFiles) && productInput.imageFiles.length > 0) {
      productInput.imageFiles.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await apiClient.patch(`/api/products/${productId}`, formData);
    return normalizeProduct(response?.data?.product);
  },

  async buyProduct(productId) {
    const response = await apiClient.post(`/api/products/buyproduct/${productId}`, {});
    return response?.data?.reservation;
  },

  async requestReservation(productId) {
    return this.buyProduct(productId);
  },

  async reportSellerVerification(productId) {
    const response = await apiClient.post(`/api/products/${productId}/report_verification`, {});
    return response?.data?.studentVerification || null;
  }
};