import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, productName, price, quantity = 1, shipping } = body;

    if (!productName || !price) {
      return NextResponse.json(
        { error: 'Produit invalide' },
        { status: 400 }
      );
    }

    // Construire la description avec les infos de livraison
    let description = '';
    if (shipping) {
      description = `Livraison: ${shipping.firstName} ${shipping.lastName}, ${shipping.address}, ${shipping.postalCode} ${shipping.city}, ${shipping.country}`;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName,
              description: description || undefined,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/boutique/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/boutique/${productId}`,
      metadata: {
        productId,
        ...(shipping && {
          shipping_firstName: shipping.firstName,
          shipping_lastName: shipping.lastName,
          shipping_address: shipping.address,
          shipping_city: shipping.city,
          shipping_postalCode: shipping.postalCode,
          shipping_country: shipping.country,
          shipping_phone: shipping.phone,
          shipping_email: shipping.email,
        }),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
