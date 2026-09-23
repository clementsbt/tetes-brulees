import axios from 'axios';

const PRINTFUL_API_BASE = 'https://api.printful.com';

export interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  size: string;
  color: string;
  price: string;
  image: string;
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

async function fetchProductFromCatalog(productId: number) {
  const printfulClient = getPrintfulClient();
  
  // Get product info from catalog
  const productsResponse = await printfulClient.get('/catalog/products', {
    params: { limit: 200 }
  });
  
  const product = productsResponse.data.result.products.find(
    (p: any) => p.id === productId
  );
  
  if (!product) {
    throw new Error(`Product ${productId} not found in catalog`);
  }
  
  // Get variants from catalog
  const variantsResponse = await printfulClient.get('/catalog/variants', {
    params: { product_id: productId, limit: 100 }
  });
  
  const variants = variantsResponse.data.result.variants;
  
  // Transform variants to our format
  const transformedVariants: PrintfulVariant[] = variants.map((v: any) => ({
    id: v.id,
    product_id: v.product_id,
    name: v.display_name,
    size: v.size,
    color: v.color?.color_name || '',
    price: v.price,
    image: v.image_url,
  }));
  
  // Extract unique sizes and colors
  const sizes = [...new Set(transformedVariants.map(v => v.size).filter(Boolean))] as string[];
  const colors = [...new Set(transformedVariants.map(v => v.color).filter(Boolean))] as string[];
  
  return {
    id: String(product.id),
    name: product.display_name,
    description: product.description?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
    price: parseFloat(variants[0]?.price || '0'),
    image: product.image_url,
    sizes,
    colors,
    variants: transformedVariants,
  };
}

export async function getPrintfulProducts(): Promise<ProductWithVariants[]> {
  try {
    const products: ProductWithVariants[] = [];
    
    for (const productId of TARGET_PRODUCTS) {
      console.log('Fetching product:', productId);
      try {
        const product = await fetchProductFromCatalog(productId);
        products.push(product);
      } catch (err) {
        console.error(`Error fetching product ${productId}:`, err);
      }
    }
    
    console.log('Products fetched:', products.length);
    return products;
  } catch (error: any) {
    console.error('Error fetching Printful products:', error.message);
    throw new Error(`Printful API error: ${error.message}`);
  }
}

export async function getPrintfulProductById(productId: string): Promise<ProductWithVariants | null> {
  try {
    const product = await fetchProductFromCatalog(parseInt(productId));
    return product;
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
