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
  images: string[];
  colorImages: Record<string, string[]>;
  sizes: string[];
  colors: string[];
  variants: PrintfulVariant[];
}

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

// Fetch products from user's Printful store (not catalog)
async function fetchStoreProducts() {
  const printfulClient = getPrintfulClient();
  
  // Get products from the store
  const response = await printfulClient.get('/store/products');
  const products = response.data.result;
  
  console.log('Store products found:', products.length);
  return products;
}

async function fetchStoreProductDetails(productId: number) {
  const printfulClient = getPrintfulClient();
  
  // Get product details with variants
  const response = await printfulClient.get(`/store/products/${productId}`);
  const productData = response.data.result;
  
  const syncProduct = productData.sync_product;
  const syncVariants = productData.sync_variants;
  
  // Transform variants to our format
  const transformedVariants: PrintfulVariant[] = syncVariants.map((v: any) => ({
    id: v.id,
    product_id: v.sync_product_id,
    name: v.name,
    size: v.size,
    color: v.color,
    price: v.retail_price,
    image: v.product?.image || syncProduct.thumbnail_url,
  }));
  
  // Extract unique sizes and colors
  const sizes = [...new Set(transformedVariants.map(v => v.size).filter(Boolean))] as string[];
  const colors = [...new Set(transformedVariants.map(v => v.color).filter(Boolean))] as string[];
  
  // Extract all unique front view images WITH design from variant files (for carousel)
  const allDesignImages = new Set<string>();
  syncVariants.forEach((v: any) => {
    if (v.files) {
      v.files.forEach((f: any) => {
        // Get only preview (front view) images with design
        if (f.preview_url && f.type === 'preview') {
          allDesignImages.add(f.preview_url);
        }
      });
    }
  });
  const images = Array.from(allDesignImages);
  
  // Extract all unique blank product images from variants (for colorImages fallback)
  const allBlankImages: string[] = [];
  const seenBlankImages = new Set<string>();
  syncVariants.forEach((v: any) => {
    if (v.product?.image && !seenBlankImages.has(v.product.image)) {
      seenBlankImages.add(v.product.image);
      allBlankImages.push(v.product.image);
    }
  });
  
  // Use local custom images for carousel (provided by user)
  const localImages: Record<string, string[]> = {
    'Navy': [
      '/images/hoodie/unisex-heavy-blend-hoodie-navy-front.jpg',
      '/images/hoodie/unisex-heavy-blend-hoodie-navy-back-6ab3c4a3dc75d.jpg',
      '/images/hoodie/unisex-heavy-blend-hoodie-navy-right.jpg',
    ],
    'Ash': [
      '/images/hoodie/unisex-heavy-blend-hoodie-ash-front.jpg',
      '/images/hoodie/unisex-heavy-blend-hoodie-ash-back-6ab3c4a3dc721.jpg',
      '/images/hoodie/unisex-heavy-blend-hoodie-ash-right.jpg',
    ],
    'White': [
      '/images/hoodie/unisex-heavy-blend-hoodie-white-front.jpg',
      '/images/hoodie/unisex-heavy-blend-hoodie-white-back-6ab3c4a3dc78c.jpg',
      '/images/hoodie/unisex-heavy-blend-hoodie-white-right.jpg',
    ],
    'Navy/ White/ Navy': [
      '/images/cap/5-panel-trucker-cap-navy-white-navy-front-6ab3cb4866090.png',
      '/images/cap/5-panel-trucker-cap-navy-white-navy-back-6ab3cb48658ad.png',
      '/images/cap/5-panel-trucker-cap-navy-white-navy-left-front-6ab3cb4865d1e.png',
    ],
  };

  // Extract front view images per color
  const colorImages: Record<string, string[]> = {};
  colors.forEach((color: string) => {
    if (localImages[color]) {
      colorImages[color] = localImages[color];
    } else {
      // Fallback to Printful images if no local images
      const variant = syncVariants.find((v: any) => v.color === color);
      if (variant) {
        const colorImgList: string[] = [];
        variant.files?.forEach((f: any) => {
          if (f.preview_url && f.type === 'preview') {
            colorImgList.push(f.preview_url);
          }
        });
        if (colorImgList.length > 0) {
          colorImages[color] = colorImgList;
        }
      }
    }
  });
  
  // Use first design image as main image (thumbnail), use local images
  let mainImage = syncProduct.thumbnail_url;
  if (syncProduct.id === 474737126) {
    // Cap - use left front image
    mainImage = localImages['Navy/ White/ Navy']?.[2] || mainImage;
  } else {
    // Hoodie - use Navy front image
    mainImage = localImages['Navy']?.[0] || mainImage;
  }
  
  // Use local images as default when no color selected
  let defaultImages = localImages['Navy'] || images;
  if (syncProduct.id === 474737126) {
    // Cap - use cap images
    defaultImages = localImages['Navy/ White/ Navy'] || images;
  }
  
  return {
    id: String(syncProduct.id),
    name: syncProduct.name,
    description: '',
    price: parseFloat(syncVariants[0]?.retail_price || '0'),
    image: mainImage,
    images: defaultImages,
    colorImages,
    sizes,
    colors,
    variants: transformedVariants,
  };
}

export async function getPrintfulProducts(): Promise<ProductWithVariants[]> {
  try {
    // Get products from the store (not catalog)
    const storeProducts = await fetchStoreProducts();
    
    const products: ProductWithVariants[] = [];
    
    for (const storeProduct of storeProducts) {
      console.log('Fetching store product:', storeProduct.id, storeProduct.name);
      try {
        const product = await fetchStoreProductDetails(storeProduct.id);
        products.push(product);
      } catch (err) {
        console.error(`Error fetching product ${storeProduct.id}:`, err);
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
    const product = await fetchStoreProductDetails(parseInt(productId));
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
