import {
  Product,
  ProductVariant,
  Collection,
  Cart,
  CartItem,
  Image,
  Page,
  Blog,
  Article,
  ShopPolicy,
  Shop,
} from './types';
import {
  getProductsQuery,
  getProductByHandleQuery,
  getProductRecommendationsQuery,
  getCollectionsQuery,
  getCollectionByHandleQuery,
  createCartMutation,
  addToCartMutation,
  updateCartMutation,
  removeFromCartMutation,
  getCartQuery,
  searchQuery,
  getPageByHandleQuery,
  getPagesQuery,
  getBlogsQuery,
  getArticleQuery,
  getShopQuery,
  getShopPoliciesQuery,
} from './queries';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

function ensureConfigured() {
  if (!domain || !storefrontAccessToken) {
    throw new Error(
      'Missing Shopify configuration. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables.'
    );
  }
}

type GraphQLResponse<T> = {
  data: T;
  errors?: { message: string }[];
};

async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'force-cache',
  tags,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T> {
  ensureConfigured();
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags && { next: { tags } }),
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join('\n'));
  }

  return json.data;
}

// ─── Edge Helpers ────────────────────────────────────────────────────────────

function flattenEdges<T>(edges: { edges: { node: T }[] }): T[] {
  return edges.edges.map((edge) => edge.node);
}

function reshapeProduct(node: Record<string, unknown>): Product {
  const product = node as unknown as Product & {
    variants: { edges: { node: ProductVariant }[] };
    images: { edges: { node: Image }[] };
  };
  return {
    ...product,
    variants: product.variants?.edges
      ? flattenEdges(product.variants)
      : ([] as ProductVariant[]),
    images: product.images?.edges
      ? flattenEdges(product.images)
      : ([] as Image[]),
  };
}

function reshapeCart(cart: Record<string, unknown>): Cart {
  const c = cart as unknown as Cart & {
    lines: { edges: { node: CartItem }[] };
  };
  return {
    ...c,
    lines: c.lines?.edges ? flattenEdges(c.lines) : ([] as CartItem[]),
  };
}

// ─── Product API ─────────────────────────────────────────────────────────────

export async function getProducts(options?: {
  first?: number;
  sortKey?: string;
  reverse?: boolean;
}): Promise<Product[]> {
  const { first = 20, sortKey = 'BEST_SELLING', reverse = false } = options || {};

  const data = await shopifyFetch<{
    products: { edges: { node: Record<string, unknown> }[] };
  }>({
    query: getProductsQuery,
    variables: { first, sortKey, reverse },
    tags: ['products'],
  });

  return data.products.edges.map((edge) => reshapeProduct(edge.node));
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{
    productByHandle: Record<string, unknown> | null;
  }>({
    query: getProductByHandleQuery,
    variables: { handle },
    tags: ['products'],
  });

  if (!data.productByHandle) return null;
  return reshapeProduct(data.productByHandle);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const data = await shopifyFetch<{
    productRecommendations: Record<string, unknown>[];
  }>({
    query: getProductRecommendationsQuery,
    variables: { productId },
    tags: ['products'],
  });

  return data.productRecommendations.map(reshapeProduct);
}

// ─── Collection API ─────────────────────────────────────────────────────────

export async function getCollections(first = 20): Promise<Collection[]> {
  const data = await shopifyFetch<{
    collections: { edges: { node: Collection }[] };
  }>({
    query: getCollectionsQuery,
    variables: { first },
    tags: ['collections'],
  });

  return flattenEdges(data.collections);
}

export async function getCollectionByHandle(
  handle: string,
  options?: { first?: number; sortKey?: string; reverse?: boolean }
): Promise<Collection | null> {
  const { first = 20, sortKey = 'BEST_SELLING', reverse = false } = options || {};

  const data = await shopifyFetch<{
    collectionByHandle: (Omit<Collection, 'products'> & {
      products: { edges: { node: Record<string, unknown> }[] };
    }) | null;
  }>({
    query: getCollectionByHandleQuery,
    variables: { handle, first, sortKey, reverse },
    tags: ['collections'],
  });

  if (!data.collectionByHandle) return null;

  return {
    ...data.collectionByHandle,
    products: data.collectionByHandle.products.edges.map((edge) =>
      reshapeProduct(edge.node)
    ),
  };
}

// ─── Cart API ────────────────────────────────────────────────────────────────

export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: Record<string, unknown> };
  }>({
    query: createCartMutation,
    variables: { input: {} },
    cache: 'no-store',
  });

  return reshapeCart(data.cartCreate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{
    cart: Record<string, unknown> | null;
  }>({
    query: getCartQuery,
    variables: { cartId },
    cache: 'no-store',
  });

  if (!data.cart) return null;
  return reshapeCart(data.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: Record<string, unknown> };
  }>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  return reshapeCart(data.cartLinesAdd.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: Record<string, unknown> };
  }>({
    query: updateCartMutation,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  return reshapeCart(data.cartLinesUpdate.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: Record<string, unknown> };
  }>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: 'no-store',
  });

  return reshapeCart(data.cartLinesRemove.cart);
}

// ─── Search API ──────────────────────────────────────────────────────────────

export async function searchProducts(query: string, first = 20): Promise<{
  products: Product[];
  pages: Page[];
}> {
  const data = await shopifyFetch<{
    products: { edges: { node: Record<string, unknown> }[] };
    pages: { edges: { node: Page }[] };
  }>({
    query: searchQuery,
    variables: { query, first },
    cache: 'no-store',
  });

  return {
    products: data.products.edges.map((edge) => reshapeProduct(edge.node)),
    pages: flattenEdges(data.pages),
  };
}

// ─── Pages API ───────────────────────────────────────────────────────────────

export async function getPageByHandle(handle: string): Promise<Page | null> {
  const data = await shopifyFetch<{
    pageByHandle: Page | null;
  }>({
    query: getPageByHandleQuery,
    variables: { handle },
    tags: ['pages'],
  });

  return data.pageByHandle;
}

export async function getPages(first = 20): Promise<Page[]> {
  const data = await shopifyFetch<{
    pages: { edges: { node: Page }[] };
  }>({
    query: getPagesQuery,
    variables: { first },
    tags: ['pages'],
  });

  return flattenEdges(data.pages);
}

// ─── Blog API ────────────────────────────────────────────────────────────────

export async function getBlogs(first = 10): Promise<Blog[]> {
  const data = await shopifyFetch<{
    blogs: {
      edges: {
        node: Omit<Blog, 'articles'> & {
          articles: { edges: { node: Article }[] };
        };
      }[];
    };
  }>({
    query: getBlogsQuery,
    variables: { first },
    tags: ['blogs'],
  });

  return data.blogs.edges.map((edge) => ({
    ...edge.node,
    articles: flattenEdges(edge.node.articles),
  }));
}

export async function getArticle(
  blogHandle: string,
  articleHandle: string
): Promise<Article | null> {
  const data = await shopifyFetch<{
    blog: { articleByHandle: Article | null } | null;
  }>({
    query: getArticleQuery,
    variables: { blogHandle, articleHandle },
    tags: ['blogs'],
  });

  return data.blog?.articleByHandle ?? null;
}

// ─── Shop API ────────────────────────────────────────────────────────────────

export async function getShop(): Promise<Shop> {
  const data = await shopifyFetch<{ shop: Shop }>({
    query: getShopQuery,
    tags: ['shop'],
  });

  return data.shop;
}

export async function getShopPolicies(): Promise<ShopPolicy[]> {
  const data = await shopifyFetch<{
    shop: {
      privacyPolicy: ShopPolicy | null;
      termsOfService: ShopPolicy | null;
      refundPolicy: ShopPolicy | null;
      shippingPolicy: ShopPolicy | null;
    };
  }>({
    query: getShopPoliciesQuery,
    tags: ['policies'],
  });

  const policies: ShopPolicy[] = [];
  if (data.shop.privacyPolicy) policies.push(data.shop.privacyPolicy);
  if (data.shop.termsOfService) policies.push(data.shop.termsOfService);
  if (data.shop.refundPolicy) policies.push(data.shop.refundPolicy);
  if (data.shop.shippingPolicy) policies.push(data.shop.shippingPolicy);

  return policies;
}
