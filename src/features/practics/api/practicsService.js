import { mockProducts } from '../../../mock/mockProducts'
export const fetchProducts = async () => new Promise((resolve) => setTimeout(() => resolve({ products: [...mockProducts], total: mockProducts.length }), 300))
