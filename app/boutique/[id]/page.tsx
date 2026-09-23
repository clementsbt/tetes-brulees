import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

async function getProduct(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products?id=${id}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    notFound();
  }
  
  return <ProductDetailClient product={product} />;
}
