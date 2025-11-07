import { SHOPIFY_GRAPHQL_URL, SHOPIFY_CONFIG } from '@/config/shopify';

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

async function shopifyFetch<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const response = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const json = await response.json();
  
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

export async function getProducts(first: number = 12) {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(query, { first });
  return data.products.edges.map(edge => edge.node);
}

export async function getProductByHandle(handle: string) {
  const query = `
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        handle
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ product: ShopifyProduct }>(query, { handle });
  return data.product;
}

export async function getCollectionByHandle(handle: string) {
  const query = `
    query GetCollectionByHandle($handle: String!) {
      collection(handle: $handle) {
        id
        title
        handle
        products(first: 20) {
          edges {
            node {
              id
              title
              description
              handle
              images(first: 2) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ collection: ShopifyCollection }>(query, { handle });
  return data.collection;
}

export async function createCheckout(lineItems: Array<{ variantId: string; quantity: number }>) {
  const query = `
    mutation CreateCheckout($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          message
          field
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    checkoutCreate: {
      checkout: { id: string; webUrl: string };
      checkoutUserErrors: Array<{ message: string; field: string[] }>;
    };
  }>(query, {
    input: {
      lineItems: lineItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    },
  });

  if (data.checkoutCreate.checkoutUserErrors.length > 0) {
    throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
  }

  return data.checkoutCreate.checkout;
}
