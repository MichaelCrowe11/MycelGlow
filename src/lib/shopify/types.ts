export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: Money;
  compareAtPrice: Money | null;
  image?: Image;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: Image | null;
  images: Image[];
  options: { id: string; name: string; values: string[] }[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  seo: {
    title: string | null;
    description: string | null;
  };
  createdAt: string;
  updatedAt: string;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image | null;
  seo: {
    title: string | null;
    description: string | null;
  };
  products: Product[];
};

export type CartItem = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: Image | null;
    };
    price: Money;
  };
  cost: {
    totalAmount: Money;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: CartItem[];
};

export type Page = {
  id: string;
  handle: string;
  title: string;
  body: string;
  bodySummary: string;
  seo: {
    title: string | null;
    description: string | null;
  };
  createdAt: string;
  updatedAt: string;
};

export type Article = {
  id: string;
  handle: string;
  title: string;
  content: string;
  contentHtml: string;
  excerpt: string | null;
  image: Image | null;
  author: { name: string };
  publishedAt: string;
  blog: {
    handle: string;
    title: string;
  };
  seo: {
    title: string | null;
    description: string | null;
  };
};

export type Blog = {
  id: string;
  handle: string;
  title: string;
  articles: Article[];
};

export type ShopPolicy = {
  id: string;
  title: string;
  handle: string;
  body: string;
};

export type Shop = {
  name: string;
  description: string | null;
};

export type SearchResults = {
  products: Product[];
  pages: Page[];
  articles: Article[];
};
