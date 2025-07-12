export const getCollections = async () => {
  const collections = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/collections`
  );
  return await collections.json();
};

export const getCollectionDetails = async (collectionId: string) => {
  const collection = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/collections/${collectionId}`
  );
  return await collection.json();
};

export const getProducts = async () => {
  const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  return await products.json();
};

export const getProductDetails = async (productId: string) => {
  const product = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
  );
  return await product.json();
};

export const getSearchedProducts = async (query: string) => {
  const searchedProducts = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/search/${query}`
  );
  return await searchedProducts.json();
};

export const getOrders = async (customerId: string) => {
  const orders = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/customers/${customerId}`
  );
  return await orders.json();
};

export const getRelatedProducts = async (productId: string) => {
  const relatedProducts = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related`
  );
  return await relatedProducts.json();
};

export const getCurrencyCode = async () => {
  const currencyCode = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/currency`
  );
  return await currencyCode.json();
};

export const getRewards = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rewards`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch rewards");
  }

  const rewards = await response.json();
  
  return rewards.filter((reward: { is_active: boolean }) => reward.is_active);
};

export const getSpinPointsSetting = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spin-setting`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch spin points");
  }

  const data = await response.json();
  return data;
};