import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const PRINTFUL_TOKEN = process.env.PRINTFUL_TOKEN;

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

    // Printful catalog variant IDs for our products
    // Hoodie (product 146) - we need to find valid variant IDs
    // Cap (product 100) - we need to find valid variant IDs
    // For now, use a simplified approach with fixed fallback rates
    
    // Try to get shipping rates from Printful
    // Note: This requires valid Printful catalog variant IDs which are different from store sync variant IDs
    let shippingRates = [];
    let printfulError = null;
    
    try {
      // These would need to be the Printful catalog variant IDs, not our store variant IDs
      // For now, we'll return fallback rates based on the product type
      const printfulItems = items.map((item: any) => ({
        quantity: item.quantity || 1,
        // Using placeholder - in production you'd map store IDs to Printful catalog IDs
        variant_id: 1, // Placeholder that will cause error, triggering fallback
      }));

      const response = await axios.post(
        'https://api.printful.com/shipping/rates',
        {
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
      // Calculate based on destination and item count
      const baseRate = 5.90; // Base shipping cost
      const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      
      // Adjust based on country
      let countryMultiplier = 1;
      if (shippingAddress.country === 'FR') {
        countryMultiplier = 1;
      } else if (['DE', 'BE', 'NL', 'LU'].includes(shippingAddress.country)) {
        countryMultiplier = 1.2;
      } else if (['IT', 'ES', 'PT', 'AT'].includes(shippingAddress.country)) {
        countryMultiplier = 1.4;
      } else {
        countryMultiplier = 2; // Rest of Europe/world
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

    // Sort by price
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
