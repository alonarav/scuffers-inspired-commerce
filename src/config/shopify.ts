// Shopify Storefront API Configuration
// Replace these values with your actual Shopify store details

export const SHOPIFY_CONFIG = {
  // Your store's myshopify domain (e.g., 'your-store.myshopify.com')
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com',
  
  // Your Storefront API access token (public token - safe for frontend)
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || 'your-storefront-access-token',
  
  // API version
  apiVersion: '2024-07',
};

export const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_CONFIG.storeDomain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;
