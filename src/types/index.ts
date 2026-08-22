export type UserRole = 'customer' | 'seller' | 'rider' | 'admin';

export type Language = 'en' | 'bn';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  email?: string;
  shopId?: string; // If seller
  riderId?: string; // If rider
  isVerified?: boolean;
  addresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  title: string; // Home, Office, etc.
  areaId: string;
  areaName: string;
  unionName: string;
  wardNo: string;
  villageName: string;
  streetAddress: string;
  deliveryNote?: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface DeliveryArea {
  id: string;
  nameEn: string;
  nameBn: string;
  district: string;
  upazila: string;
  unions: string[];
  wards: string[];
  villages: string[];
  radiusKm: number;
  deliveryCharge: number;
  minOrderAmount: number;
  estimatedDeliveryMin: number;
  isActive: boolean;
}

export type ProductCategory =
  | 'grocery'
  | 'food'
  | 'pharmacy'
  | 'clothing'
  | 'electronics'
  | 'vegetables_fruits'
  | 'home_kitchen'
  | 'cosmetics'
  | 'local_shops';

export interface CategoryInfo {
  id: ProductCategory;
  nameEn: string;
  nameBn: string;
  iconName: string;
  color: string;
  bgGradient: string;
  itemCount?: number;
}

export interface Shop {
  id: string;
  nameEn: string;
  nameBn: string;
  category: ProductCategory;
  ownerId: string;
  ownerName: string;
  phone: string;
  areaId: string;
  areaName: string;
  addressEn: string;
  addressBn: string;
  rating: number;
  totalReviews: number;
  image: string;
  bannerImage: string;
  isOpen: boolean;
  openingHours: string;
  minOrder: number;
  avgDeliveryTime: string;
  isVerified: boolean;
  commissionRate: number; // e.g. 0.08 for 8%
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  shopId: string;
  shopName: string;
  category: ProductCategory;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  price: number;
  discountPrice?: number;
  unit: string; // kg, piece, packet, liter, etc.
  stock: number;
  inStock: boolean;
  images: string[];
  rating: number;
  totalReviews: number;
  reviews?: ProductReview[];
  isFeatured?: boolean;
  isOfferOfTheDay?: boolean;
  tags?: string[];
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedShopId: string;
}

export type OrderStatus =
  | 'order_placed'
  | 'seller_confirmed'
  | 'preparing'
  | 'rider_assigned'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  shopId: string;
  shopName: string;
}

export interface OrderTrackingStep {
  status: OrderStatus;
  labelEn: string;
  labelBn: string;
  descriptionEn: string;
  descriptionBn: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: Address;
  items: OrderItem[];
  shopId: string;
  shopName: string;
  shopPhone: string;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  riderVehicle?: string;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: 'cash_on_delivery' | 'online_payment';
  paymentStatus: 'pending' | 'collected_by_rider' | 'settled';
  orderStatus: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  placedAt: string;
  estimatedDeliveryTime?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  riderCurrentLocation?: {
    lat: number;
    lng: number;
    heading?: number;
  };
  commissionAmount: number;
  sellerEarnings: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validUntil: string;
  isActive: boolean;
  descriptionEn: string;
  descriptionBn: string;
}

export interface PromoBanner {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  badgeEn: string;
  badgeBn: string;
  discountText: string;
  imageUrl: string;
  bgGradient: string;
  targetCategory?: ProductCategory;
  targetShopId?: string;
  active: boolean;
}

export interface AppNotification {
  id: string;
  userId?: string; // specific user or all
  role?: UserRole | 'all';
  titleEn: string;
  titleBn: string;
  messageEn: string;
  messageBn: string;
  type: 'order' | 'promo' | 'system' | 'delivery' | 'earning';
  orderId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ComplaintTicket {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userRole: UserRole;
  orderId?: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolutionNote?: string;
}

export interface AppSettings {
  defaultCommissionRate: number; // e.g. 0.08 (8%)
  baseDeliveryCharge: number; // e.g. 40
  minOrderAmount: number; // e.g. 100
  appName: string;
  supportPhone: string;
  supportEmail: string;
  currencySymbol: string; // ৳
}

export type LogoPreset = 'official' | 'emerald_bag' | 'bangla_monogram' | 'speed_rider' | 'custom_url';

export interface LogoConfig {
  preset: LogoPreset;
  customUrl?: string;
  appNameEn?: string;
  appNameBn?: string;
  taglineEn?: string;
  taglineBn?: string;
  showBadge?: boolean;
}
