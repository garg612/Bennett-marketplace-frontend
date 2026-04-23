import { mockCategories } from '../data/categories';

export const categoryService = {
  getAllCategories() {
    return [...mockCategories];
  }
};