import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const PRINTFUL_TOKEN = process.env.PRINTFUL_TOKEN;
const PRINTFUL_STORE_ID = '18795037';

// Fetch store products from Printful to get variant IDs (both sync and catalog)
async function getPrintfulVariants() {
  const response = await axios.get(`https://api.printful.com/store/products?store_id=${PRINTFUL_STORE_ID}`, {
    headers: {
      'Authorization': `Bearer ${PRINTFUL_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  const variants: Record<string, any> = {};

  for (const product of response.data.result) {
    const detailResponse = await axios.get(`https://api.printful.com/store/products/${product.id}?store_id=${PRINTFUL_STORE_ID}`, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const syncVariants = detailResponse.data.result.sync_variants;
    
    for (const variant of syncVariants) {
      // Create key from product id + size + color
      const key = `${product.id}-${variant.size}-${variant.color}`;
      variants[key] = {
        id: variant.id,                    // sync_variant_id
        variantId: variant.variant_id,   // catalog variant_id (for shipping API)
        productId: product.id,
        size: variant.size,
        color: variant.color,
      };
    }
  }

  return variants;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Adresse de livraison requise' },
        { status: 400 }
      );
    }

    let shippingRates = [];
    let printfulError = null;

    try {
      // Get Printful variants to map cart items to variant IDs
      const printfulVariants = await getPrintfulVariants();
      
      // Map cart items to Printful variant IDs (use catalog variant_id for shipping API)
      const printfulItems = items.map((item: any) => {
        // Try to find matching variant by product id, size, and color
        const variantKey = Object.keys(printfulVariants).find(key => 
          key.includes(item.id) && 
          (!item.size || key.includes(item.size)) &&
          (!item.color || key.toLowerCase().includes(item.color.toLowerCase()))
        );

        const variant = variantKey ? printfulVariants[variantKey] : null;

        return {
          quantity: item.quantity || 1,
          variant_id: variant?.variantId || null,  // Use catalog variant_id, not sync_variant_id
        };
      }).filter((item: any) => item.variant_id);

      if (printfulItems.length === 0) {
        throw new Error('No valid Printful variants found');
      }

      const response = await axios.post(
        'https://api.printful.com/shipping/rates',
        {
          store_id: PRINTFUL_STORE_ID,
          recipient: {
            address1: shippingAddress.address,
            city: shippingAddress.city,
            country_code: shippingAddress.country,
            zip_code: shippingAddress.postalCode,
          },
          items: printfulItems,
        },
        {
          headers: {
            'Authorization': `Bearer ${PRINTFUL_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      shippingRates = response.data.result.map((rate: any) => ({
        id: rate.id,
        name: rate.name,
        price: parseFloat(rate.rate),
        currency: rate.currency || 'EUR',
        estimatedDays: rate.estimated_days,
      }));
    } catch (err: any) {
      printfulError = err.message;
      console.log('Printful API error, using fallback rates:', printfulError);
    }

    // If Printful failed or returned no rates, use fallback rates
    if (shippingRates.length === 0) {
      const baseRate = 5.90;
      const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      
      let countryMultiplier = 1;
      if (shippingAddress.country === 'FR') {
        countryMultiplier = 1;
      } else if (['DE', 'BE', 'NL', 'LU'].includes(shippingAddress.country)) {
        countryMultiplier = 1.2;
      } else if (['IT', 'ES', 'PT', 'AT'].includes(shippingAddress.country)) {
        countryMultiplier = 1.4;
      } else {
        countryMultiplier = 2;
      }

      const shippingCost = (baseRate * countryMultiplier) + (itemCount > 1 ? (itemCount - 1) * 2 : 0);

      shippingRates = [
        {
          id: 'standard',
          name: 'Livraison standard',
          price: Math.round(shippingCost * 100) / 100,
          currency: 'EUR',
          estimatedDays: shippingAddress.country === 'FR' ? 3 : 7,
        },
        {
          id: 'express',
          name: 'Livraison express',
          price: Math.round((shippingCost + 5) * 100) / 100,
          currency: 'EUR',
          estimatedDays: shippingAddress.country === 'FR' ? 1 : 3,
        },
      ];
    }

    shippingRates.sort((a: any, b: any) => a.price - b.price);

    return NextResponse.json({ shippingRates });
  } catch (error: any) {
    console.error('Shipping error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Erreur lors du calcul des frais de livraison' },
      { status: 500 }
    );
  }
}
