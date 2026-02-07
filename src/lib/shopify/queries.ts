// ─── Fragment Definitions ────────────────────────────────────────────────────

const imageFragment = `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

const moneyFragment = `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`;

const productVariantFragment = `
  fragment ProductVariantFields on ProductVariant {
    id
    title
    availableForSale
    selectedOptions {
      name
      value
    }
    price {
      ...MoneyFields
    }
    compareAtPrice {
      ...MoneyFields
    }
    image {
      ...ImageFields
    }
  }
  ${moneyFragment}
  ${imageFragment}
`;

const productFragment = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    featuredImage {
      ...ImageFields
    }
    options {
      id
      name
      values
    }
    priceRange {
      minVariantPrice {
        ...MoneyFields
      }
      maxVariantPrice {
        ...MoneyFields
      }
    }
    seo {
      title
      description
    }
    createdAt
    updatedAt
  }
  ${moneyFragment}
  ${imageFragment}
`;

const cartFragment = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...MoneyFields
      }
      totalAmount {
        ...MoneyFields
      }
      totalTaxAmount {
        ...MoneyFields
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                id
                handle
                title
                featuredImage {
                  ...ImageFields
                }
              }
              price {
                ...MoneyFields
              }
            }
          }
          cost {
            totalAmount {
              ...MoneyFields
            }
          }
        }
      }
    }
  }
  ${moneyFragment}
  ${imageFragment}
`;

// ─── Product Queries ─────────────────────────────────────────────────────────

export const getProductsQuery = `
  query GetProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          ...ProductFields
          variants(first: 10) {
            edges {
              node {
                ...ProductVariantFields
              }
            }
          }
          images(first: 10) {
            edges {
              node {
                ...ImageFields
              }
            }
          }
        }
      }
    }
  }
  ${productFragment}
  ${productVariantFragment}
`;

export const getProductByHandleQuery = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFields
      variants(first: 50) {
        edges {
          node {
            ...ProductVariantFields
          }
        }
      }
      images(first: 20) {
        edges {
          node {
            ...ImageFields
          }
        }
      }
    }
  }
  ${productFragment}
  ${productVariantFragment}
`;

export const getProductRecommendationsQuery = `
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFields
      variants(first: 1) {
        edges {
          node {
            ...ProductVariantFields
          }
        }
      }
      images(first: 1) {
        edges {
          node {
            ...ImageFields
          }
        }
      }
    }
  }
  ${productFragment}
  ${productVariantFragment}
`;

// ─── Collection Queries ──────────────────────────────────────────────────────

export const getCollectionsQuery = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            ...ImageFields
          }
          seo {
            title
            description
          }
        }
      }
    }
  }
  ${imageFragment}
`;

export const getCollectionByHandleQuery = `
  query GetCollectionByHandle($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      description
      image {
        ...ImageFields
      }
      seo {
        title
        description
      }
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...ProductFields
            variants(first: 1) {
              edges {
                node {
                  ...ProductVariantFields
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  ...ImageFields
                }
              }
            }
          }
        }
      }
    }
  }
  ${productFragment}
  ${productVariantFragment}
`;

// ─── Cart Mutations ──────────────────────────────────────────────────────────

export const createCartMutation = `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const addToCartMutation = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const updateCartMutation = `
  mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const removeFromCartMutation = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const getCartQuery = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${cartFragment}
`;

// ─── Search Query ────────────────────────────────────────────────────────────

export const searchQuery = `
  query Search($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFields
          variants(first: 1) {
            edges {
              node {
                ...ProductVariantFields
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                ...ImageFields
              }
            }
          }
        }
      }
    }
    pages(first: 5, query: $query) {
      edges {
        node {
          id
          handle
          title
          body
          bodySummary
          seo {
            title
            description
          }
          createdAt
          updatedAt
        }
      }
    }
  }
  ${productFragment}
  ${productVariantFragment}
`;

// ─── Page Queries ────────────────────────────────────────────────────────────

export const getPageByHandleQuery = `
  query GetPageByHandle($handle: String!) {
    pageByHandle(handle: $handle) {
      id
      handle
      title
      body
      bodySummary
      seo {
        title
        description
      }
      createdAt
      updatedAt
    }
  }
`;

export const getPagesQuery = `
  query GetPages($first: Int!) {
    pages(first: $first) {
      edges {
        node {
          id
          handle
          title
          bodySummary
          createdAt
          updatedAt
        }
      }
    }
  }
`;

// ─── Blog Queries ────────────────────────────────────────────────────────────

export const getBlogsQuery = `
  query GetBlogs($first: Int!) {
    blogs(first: $first) {
      edges {
        node {
          id
          handle
          title
          articles(first: 10) {
            edges {
              node {
                id
                handle
                title
                content
                contentHtml
                excerpt
                image {
                  ...ImageFields
                }
                author {
                  name
                }
                publishedAt
                blog {
                  handle
                  title
                }
                seo {
                  title
                  description
                }
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
`;

export const getArticleQuery = `
  query GetArticle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        id
        handle
        title
        content
        contentHtml
        excerpt
        image {
          ...ImageFields
        }
        author {
          name
        }
        publishedAt
        blog {
          handle
          title
        }
        seo {
          title
          description
        }
      }
    }
  }
  ${imageFragment}
`;

// ─── Shop Queries ────────────────────────────────────────────────────────────

export const getShopQuery = `
  query GetShop {
    shop {
      name
      description
    }
  }
`;

export const getShopPoliciesQuery = `
  query GetShopPolicies {
    shop {
      privacyPolicy {
        id
        title
        handle
        body
      }
      termsOfService {
        id
        title
        handle
        body
      }
      refundPolicy {
        id
        title
        handle
        body
      }
      shippingPolicy {
        id
        title
        handle
        body
      }
    }
  }
`;
