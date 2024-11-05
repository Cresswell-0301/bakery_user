type CollectionType = {
  _id: string;
  title: string;
  products: number;
  image: string;
};

type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: [string];
  category: string;
  collections: [string];
  tags: [string];
  price: number;
  cost: number;
  sizes: [string];
  colors: [string];
  status: string;
  createdAt: string;
  updatedAt: string;
};

type UserType = {
  clerkId: string;
  wishlist: [string];
  createdAt: string;
  updatedAt: string;
};

type OrderType = {
  _id: string;
  customerClerkId: string;
  orderId: string;
  products: [OrderItemType];
  shippingAddress: Object;
  shippingRate: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  class: string;
  block: string;
  phoneNo: string;
  attachment: string;
  remarks: string;
  createdAt: string;
};

type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
  status: string;
  _id: string;
};

type CurrencyCodeType = {
  code: string;
};

type PaymentMethodType = {
  _id: string;
  name: string;
  image: string;
  active: string;
};

type CustomPaymentType = {
  _id: string;
  clerkId: string;
  orderId: string;
  shippingRate: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  class: string;
  block: string;
  phoneNo: string;
  attachment: string;
  createdAt: string;
};
