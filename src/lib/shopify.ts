import { SHOPIFY_GRAPHQL_URL, SHOPIFY_CONFIG } from '@/config/shopify';

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  productType: string;
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
  metafields?: {
    edges: Array<{
      node: {
        key: string;
        value: string;
        namespace: string;
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

export interface PromoImage {
  id: string;
  image: {
    reference: {
      image: {
        url: string;
        altText: string | null;
      };
    };
  };
  placement: {
    value: string;
  };
  bright: {
    value: string;
  };
  title?: {
    value: string;
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
            descriptionHtml
            handle
            productType
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
            metafields(identifiers: [{namespace: "custom", key: "color"}]) {
              edges {
                node {
                  key
                  value
                  namespace
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
        descriptionHtml
        handle
        productType
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
        metafields(identifiers: [{namespace: "custom", key: "color"}]) {
          edges {
            node {
              key
              value
              namespace
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
              descriptionHtml
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

export async function getPromoImages(placement: string = 'hero-banner') {
  const query = `
    query GetPromoImages($type: String!, $first: Int!) {
      metaobjects(type: $type, first: $first) {
        edges {
          node {
            id
            fields {
              key
              value
              reference {
                ... on MediaImage {
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    metaobjects: {
      edges: Array<{
        node: {
          id: string;
          fields: Array<{
            key: string;
            value: string;
            reference?: {
              image?: {
                url: string;
                altText: string | null;
              };
            };
          }>;
        };
      }>;
    };
  }>(query, { type: 'promo_image', first: 20 });

  // Filter and transform metaobjects to get hero-banner images
  const promoImages = data.metaobjects.edges
    .map(edge => {
      const fields = edge.node.fields;
      const placementField = fields.find(f => f.key === 'placement');
      const imageField = fields.find(f => f.key === 'image');
      const titleField = fields.find(f => f.key === 'title');
      const brightField = fields.find(f => f.key === 'bright');

      return {
        id: edge.node.id,
        placement: placementField?.value || '',
        image: imageField?.reference?.image || null,
        title: titleField?.value || '',
        bright: brightField?.value || 'dark',
      };
    })
    .filter(item => item.placement === placement && item.image !== null);

  return promoImages;
}

export async function getDiscountTexts() {
  const query = `
    query GetDiscount($type: String!, $first: Int!) {
      metaobjects(type: $type, first: $first) {
        edges {
          node {
            id
            fields {
              key
              value
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      metaobjects: {
        edges: Array<{
          node: {
            id: string;
            fields: Array<{
              key: string;
              value: string;
            }>;
          };
        }>;
      };
    }>(query, { type: 'discount', first: 20 });

    const discounts = data.metaobjects.edges.map(edge => {
      const descriptionField = edge.node.fields.find(f => f.key === 'description');
      if (descriptionField?.value) {
        try {
          // Parse the rich text JSON structure
          const richText = JSON.parse(descriptionField.value);
          // Extract text from nested structure
          if (richText.children?.[0]?.children?.[0]?.value) {
            return richText.children[0].children[0].value;
          }
        } catch (e) {
          // If parsing fails, return as-is (might be plain text)
          return descriptionField.value;
        }
      }
      return null;
    }).filter(Boolean) as string[];

    return discounts.length > 0 ? discounts : ['20% הנחה בקנייה מעל מאה שקל WELCOME20'];
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return ['20% הנחה בקנייה מעל מאה שקל WELCOME20'];
  }
}

export async function getMetaobject(type: string) {
  const query = `
    query GetMetaobject($type: String!, $first: Int!) {
      metaobjects(type: $type, first: $first) {
        edges {
          node {
            id
            fields {
              key
              value
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    metaobjects: {
      edges: Array<{
        node: {
          id: string;
          fields: Array<{
            key: string;
            value: string;
          }>;
        };
      }>;
    };
  }>(query, { type, first: 20 });

  if (data.metaobjects.edges.length === 0) return null;

  const fields = data.metaobjects.edges[0].node.fields;
  const result: Record<string, string> = {};
  fields.forEach(field => {
    result[field.key] = field.value;
  });

  return result;
}

export async function getShippingDetails() {
  const query = `
    query GetShippingDetails($type: String!, $first: Int!) {
      metaobjects(type: $type, first: $first) {
        edges {
          node {
            id
            fields {
              key
              value
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    metaobjects: {
      edges: Array<{
        node: {
          id: string;
          fields: Array<{
            key: string;
            value: string;
          }>;
        };
      }>;
    };
  }>(query, { type: 'shipping_details', first: 20 });

  return data.metaobjects.edges.map(edge => {
    const fields = edge.node.fields;
    const result: Record<string, string> = {};
    fields.forEach(field => {
      if (field.key === 'description') {
        // Parse rich text JSON if it exists
        try {
          const parsed = JSON.parse(field.value);
          if (parsed.type === 'root' && parsed.children) {
            // Extract text from rich text structure
            const extractText = (node: any): string => {
              if (node.type === 'text') return node.value || '';
              if (node.children) {
                return node.children.map(extractText).join('');
              }
              return '';
            };
            result[field.key] = extractText(parsed);
          } else {
            result[field.key] = field.value;
          }
        } catch {
          result[field.key] = field.value;
        }
      } else {
        result[field.key] = field.value;
      }
    });
    return result;
  });
}

export async function getLogoPlacement(): Promise<string> {
  try {
    const data = await getMetaobject('logo_placement');
    return data?.placement || 'middle';
  } catch (error) {
    console.error('Error fetching logo placement:', error);
    return 'middle';
  }
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
