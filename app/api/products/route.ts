import { NextResponse } from 'next/server';
import { getPrintfulProducts, getPrintfulProductById } from '@/lib/printful';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const debug = searchParams.get('debug');

  // Debug endpoint to check environment
  if (debug) {
    return NextResponse.json({
      hasToken: !!process.env.PRINTFUL_TOKEN,
      tokenPrefix: process.env.PRINTFUL_TOKEN?.substring(0, 10) || 'undefined',
      nodeEnv: process.env.NODE_ENV,
    });
  }

  try {
    if (id) {
      const product = await getPrintfulProductById(id);
      if (!product) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    }

    const products = await getPrintfulProducts();
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || error.toString() || 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}
