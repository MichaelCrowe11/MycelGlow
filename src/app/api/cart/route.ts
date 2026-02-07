import { NextRequest, NextResponse } from 'next/server';
import { createCart, getCart, addToCart, updateCart, removeFromCart } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  const cartId = request.nextUrl.searchParams.get('cartId');
  if (!cartId) {
    return NextResponse.json({ error: 'cartId is required' }, { status: 400 });
  }

  const cart = await getCart(cartId);
  return NextResponse.json({ cart });
}

export async function POST() {
  const cart = await createCart();
  return NextResponse.json({ cart });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { action, cartId, lines, lineIds } = body;

  let cart;

  switch (action) {
    case 'add':
      cart = await addToCart(cartId, lines);
      break;
    case 'update':
      cart = await updateCart(cartId, lines);
      break;
    case 'remove':
      cart = await removeFromCart(cartId, lineIds);
      break;
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  return NextResponse.json({ cart });
}
