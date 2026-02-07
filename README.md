# MycelGlow - Next.js Headless Shopify Store

A modern headless e-commerce storefront built with Next.js and the Shopify Storefront API. Features mushroom-based wellness products with a clean, responsive design.

## Tech Stack

- **Next.js 14** - App Router with React Server Components
- **Shopify Storefront API** - Headless commerce backend
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **React Context** - Cart state management

## Features

- Product listing and detail pages with image galleries
- Collection browsing
- Shopping cart with slide-out drawer
- Product search
- Blog / article pages
- CMS pages
- Store policy pages
- Responsive design (mobile-first)
- SEO metadata for all pages
- ISR (Incremental Static Regeneration) for fast page loads

## Getting Started

### Prerequisites

- Node.js 18+
- A Shopify store with Storefront API access

### Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your Shopify credentials:

```bash
cp .env.example .env
```

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the store.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/cart/           # Cart API route
│   ├── blog/               # Blog pages
│   ├── collections/        # Collection pages
│   ├── pages/              # CMS pages
│   ├── policies/           # Policy pages
│   ├── products/           # Product pages
│   ├── search/             # Search page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── cart/               # Cart drawer
│   ├── layout/             # Header, Footer
│   ├── product/            # Product card, gallery, variants
│   └── search/             # Search bar
├── context/
│   └── cart-context.tsx    # Cart state management
└── lib/
    ├── shopify/            # Shopify API client, queries, types
    └── utils.ts            # Utility functions
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project is ready to deploy on [Vercel](https://vercel.com). Add your environment variables in the Vercel dashboard.
