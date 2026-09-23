import axios from 'axios';

const PRINTFUL_API_BASE = 'https://api.printful.com';

export interface PrintfulProduct {
  id: number;
  title: string;
  type_name: string;
  thumbnail_url: string;
}

export interface PrintfulVariant {
  id: number;
  product_id: number;
  title: string;
  size: string;
  color: string;
  price: string;
  image?: string;
}

export interface ProductWithVariants {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  variants: PrintfulVariant[];
}

// Liste des produits Printful à utiliser (par ID de catalogue)
// Ces IDs viennent du catalogue Printful public
const TARGET_PRODUCTS = [
  71,   // T-shirt Bella + Canvas 3001
  438,  // T-shirt Gildan 5000
  508,  // T-shirt Cotton Heritage
  12,   // T-shirt Gildan Softstyle
  146,  // Hoodie Gildan
  145,  // Sweatshirt Gildan
];

function getPrintfulClient() {
  const token = process.env.PRINTFUL_TOKEN;
  if (!token) {
    throw new Error('PRINTFUL_TOKEN not set');
  }
  return axios.create({
    baseURL: PRINTFUL_API_BASE,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function getPrintfulProducts(): Promise<ProductWithVariants[]> {
  const printfulClient = getPrintfulClient();
  
  try {
    const products: ProductWithVariants[] = [];
    
    for (const productId of TARGET_PRODUCTS) {
      console.log('Fetching product:', productId);
      const response = await printfulClient.get(`/products/${productId}`);
      const product = response.data.result;
      
      const sizes = [...new Set(product.variants.map((v: any) => v.size))] as string[];
      const colors = [...new Set(product.variants.map((v: any) => v.color))] as string[];
      
      products.push({
        id: String(product.id),
        name: product.title,
        description: product.type_name,
        price: parseFloat(product.variants[0]?.price || '0'),
        image: product.thumbnail_url,
        sizes,
        colors,
        variants: product.variants,
      });
    }
    
    console.log('Products fetched:', products.length);
    return products;
  } catch (error: any) {
    console.error('Error fetching Printful products:', error.message, error.response?.data);
    throw new Error(`Printful API error: ${error.message}`);
  }
}

export async function getPrintfulProductById(productId: string): Promise<ProductWithVariants | null> {
  const printfulClient = getPrintfulClient();
  
  try {
    const response = await printfulClient.get(`/products/${productId}`);
    const product = response.data.result;
    
    const sizes = [...new Set(product.variants.map((v: any) => v.size))] as string[];
    const colors = [...new Set(product.variants.map((v: any) => v.color))] as string[];
    
    return {
      id: String(product.id),
      name: product.title,
      description: product.type_name,
      price: parseFloat(product.variants[0]?.price || '0'),
      image: product.thumbnail_url,
      sizes,
      colors,
      variants: product.variants,
    };
  } catch (error: any) {
    console.error('Error fetching Printful product:', error.message);
    return null;
  }
}

export async function createPrintfulOrder(
  recipient: {
    name: string;
    address1: string;
    city: string;
    state_code?: string;
    country_code: string;
    zip: string;
    phone: string;
    email: string;
  },
  items: Array<{
    variant_id: number;
    quantity: number;
    price?: string;
  }>
) {
  const printfulClient = getPrintfulClient();
  
  try {
    const response = await printfulClient.post('/orders', {
      recipient,
      items,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating Printful order:', error.response?.data || error.message);
    throw error;
  }
}
