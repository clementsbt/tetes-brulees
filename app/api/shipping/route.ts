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

    // Préparer les items pour Printful
    const printfulItems = items.map((item: any) => ({
      quantity: item.quantity || 1,
      variant_id: item.variantId || item.id,
    }));

    // Appeler l'API Printful pour calculer les frais de livraison
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

    const shippingRates = response.data.result.map((rate: any) => ({
      id: rate.id,
      name: rate.name,
      price: parseFloat(rate.rate),
      currency: rate.currency || 'EUR',
      estimatedDays: rate.estimated_days,
    }));

    // Trier par prix
    shippingRates.sort((a: any, b: any) => a.price - b.price);

    return NextResponse.json({ shippingRates });
  } catch (error: any) {
    console.error('Printful shipping error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Erreur lors du calcul des frais de livraison' },
      { status: 500 }
    );
  }
}
