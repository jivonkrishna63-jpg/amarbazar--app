import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Language,
  Product,
  Shop,
  CartItem,
  Order,
  OrderStatus,
  DeliveryArea,
  Coupon,
  PromoBanner,
  AppNotification,
  ComplaintTicket,
  ProductCategory,
  LogoConfig,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_DELIVERY_AREAS,
  INITIAL_SHOPS,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPLAINTS,
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Authentication & Role
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  switchUser: (user: User) => void;
  users: User[];
  loginWithPhoneOtp: (phone: string, role: UserRole, name?: string) => Promise<boolean>;
  toggleVerifyUser: (userId: string) => void;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Location & Geo-Fencing
  serviceAreas: DeliveryArea[];
  selectedAreaId: string;
  setSelectedAreaId: (id: string) => void;
  currentLocationDetails: {
    areaId: string;
    union: string;
    ward: string;
    village: string;
    isAvailable: boolean;
  };
  setDeliveryLocation: (location: { areaId: string; union: string; ward: string; village: string }) => void;
  isServiceAvailableInArea: boolean;
  addServiceArea: (area: Omit<DeliveryArea, 'id'>) => void;
  updateServiceArea: (id: string, area: Partial<DeliveryArea>) => void;
  deleteServiceArea: (id: string) => void;
  
  // Marketplace & Products
  products: Product[];
  shops: Shop[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateShop: (id: string, shop: Partial<Shop>) => void;
  
  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  
  // Coupons & Banners
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string; discountAmount?: number };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  deleteCoupon: (id: string) => void;
  banners: PromoBanner[];
  addBanner: (banner: Omit<PromoBanner, 'id'>) => void;
  deleteBanner: (id: string) => void;
  
  // Orders & COD Tracking
  orders: Order[];
  placeOrder: (orderPayload: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  assignRiderToOrder: (orderId: string, riderId: string) => void;
  riderAcceptOrder: (orderId: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  
  // Notifications
  notifications: AppNotification[];
  unreadNotifCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  broadcastNotification: (titleEn: string, titleBn: string, messageEn: string, messageBn: string, type?: AppNotification['type']) => void;
  
  // Customer Support & Complaints
  complaints: ComplaintTicket[];
  submitComplaint: (complaint: Omit<ComplaintTicket, 'id' | 'createdAt' | 'status'>) => void;
  resolveComplaint: (id: string, resolutionNote: string) => void;
  
  // UI & Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  
  // Commission & Settings
  commissionRate: number; // e.g. 0.08
  setCommissionRate: (rate: number) => void;
  
  // Logo & Branding
  logoConfig: LogoConfig;
  updateLogoConfig: (config: Partial<LogoConfig>) => void;
  resetLogoConfig: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage helper
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`amarbazar_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveStored = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(`amarbazar_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  // State
  const [users, setUsers] = useState<User[]>(() => loadStored('users', INITIAL_USERS));
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => loadStored('role', 'customer'));
  const [language, setLanguageState] = useState<Language>(() => loadStored('lang', 'en'));
  
  // Find current user according to role
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const matched = users.find(u => u.role === currentRole);
    return matched || users[0];
  });

  const [serviceAreas, setServiceAreas] = useState<DeliveryArea[]>(() => loadStored('areas', INITIAL_DELIVERY_AREAS));
  const [selectedAreaId, setSelectedAreaIdState] = useState<string>(() => loadStored('selectedAreaId', 'area-dhanmondi'));
  
  const [currentLocationDetails, setCurrentLocationDetails] = useState(() => loadStored('locationDetails', {
    areaId: 'area-dhanmondi',
    union: 'Kalabagan Union',
    ward: '16',
    village: 'Kathalbagan',
    isAvailable: true,
  }));

  const [products, setProducts] = useState<Product[]>(() => loadStored('products', INITIAL_PRODUCTS));
  const [shops, setShops] = useState<Shop[]>(() => loadStored('shops', INITIAL_SHOPS));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  
  const [cart, setCart] = useState<CartItem[]>(() => loadStored('cart', []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadStored('wishlist', ['prod-f-1', 'prod-g-1']));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadStored('coupons', INITIAL_COUPONS));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [banners, setBanners] = useState<PromoBanner[]>(() => loadStored('banners', INITIAL_BANNERS));
  const [orders, setOrders] = useState<Order[]>(() => loadStored('orders', INITIAL_ORDERS));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadStored('notifications', INITIAL_NOTIFICATIONS));
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(() => loadStored('complaints', INITIAL_COMPLAINTS));
  const [commissionRate, setCommissionRateState] = useState<number>(() => loadStored('commission', 0.08));
  const [toasts, setToasts] = useState<Toast[]>([]);

  const defaultLogoConfig: LogoConfig = {
    preset: 'official',
    appNameEn: 'AmarBazar',
    appNameBn: 'আমারবাজার',
    taglineEn: 'Local Marketplace & Delivery',
    taglineBn: 'লোকাল মার্কেটপ্লেস ও ডেলিভারি',
    showBadge: true,
  };

  const [logoConfig, setLogoConfig] = useState<LogoConfig>(() => loadStored('logoConfig', defaultLogoConfig));

  // Sync to local storage
  useEffect(() => saveStored('users', users), [users]);
  useEffect(() => saveStored('role', currentRole), [currentRole]);
  useEffect(() => saveStored('lang', language), [language]);
  useEffect(() => saveStored('areas', serviceAreas), [serviceAreas]);
  useEffect(() => saveStored('selectedAreaId', selectedAreaId), [selectedAreaId]);
  useEffect(() => saveStored('locationDetails', currentLocationDetails), [currentLocationDetails]);
  useEffect(() => saveStored('products', products), [products]);
  useEffect(() => saveStored('shops', shops), [shops]);
  useEffect(() => saveStored('cart', cart), [cart]);
  useEffect(() => saveStored('wishlist', wishlist), [wishlist]);
  useEffect(() => saveStored('coupons', coupons), [coupons]);
  useEffect(() => saveStored('banners', banners), [banners]);
  useEffect(() => saveStored('orders', orders), [orders]);
  useEffect(() => saveStored('notifications', notifications), [notifications]);
  useEffect(() => saveStored('complaints', complaints), [complaints]);
  useEffect(() => saveStored('commission', commissionRate), [commissionRate]);
  useEffect(() => saveStored('logoConfig', logoConfig), [logoConfig]);

  const updateLogoConfig = (config: Partial<LogoConfig>) => {
    setLogoConfig(prev => ({ ...prev, ...config }));
  };

  const resetLogoConfig = () => {
    setLogoConfig(defaultLogoConfig);
  };

  // Toast system
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Switch role helper
  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    const matchedUser = users.find(u => u.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);
    }
    showToast(
      language === 'bn' 
        ? `মোড পরিবর্তন: ${role === 'customer' ? 'গ্রাহক' : role === 'seller' ? 'দোকানদার' : role === 'rider' ? 'রাইডার' : 'অ্যাডমিন'}`
        : `Switched to ${role.toUpperCase()} Mode`, 
      'info'
    );
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
    setCurrentRoleState(user.role);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setCommissionRate = (rate: number) => {
    setCommissionRateState(rate);
    showToast(language === 'bn' ? `কমিশন রেট ${(rate * 100).toFixed(0)}% এ আপডেট করা হয়েছে` : `Commission updated to ${(rate * 100).toFixed(0)}%`, 'success');
  };

  // Geo-fencing & Area check
  const selectedAreaObj = serviceAreas.find(a => a.id === selectedAreaId);
  const isServiceAvailableInArea = selectedAreaObj?.isActive ?? false;

  const setSelectedAreaId = (id: string) => {
    setSelectedAreaIdState(id);
    const area = serviceAreas.find(a => a.id === id);
    if (area) {
      setCurrentLocationDetails({
        areaId: area.id,
        union: area.unions[0] || 'Center Union',
        ward: area.wards[0] || '01',
        village: area.villages[0] || 'Main Area',
        isAvailable: area.isActive,
      });
      if (!area.isActive) {
        showToast(
          language === 'bn' ? 'দুঃখিত, এই এলাকায় বর্তমানে ডেলিভারি সেবা চালু নেই।' : 'Sorry, delivery is currently unavailable in your area.',
          'warning'
        );
      }
    }
  };

  const setDeliveryLocation = (loc: { areaId: string; union: string; ward: string; village: string }) => {
    const area = serviceAreas.find(a => a.id === loc.areaId);
    const isAvail = area ? area.isActive : false;
    setCurrentLocationDetails({
      ...loc,
      isAvailable: isAvail,
    });
    setSelectedAreaIdState(loc.areaId);
    if (!isAvail) {
      showToast('Sorry, delivery is currently unavailable in your area.', 'error');
    }
  };

  // Auth mock
  const loginWithPhoneOtp = async (phone: string, role: UserRole, name?: string): Promise<boolean> => {
    let user = users.find(u => u.phone === phone);
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: name || (role === 'seller' ? 'Shop Merchant' : role === 'rider' ? 'Express Rider' : 'Local Customer'),
        phone,
        role,
        isVerified: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers(prev => [...prev, user!]);
    } else {
      user = { ...user, role };
    }
    setCurrentUser(user);
    setCurrentRoleState(role);
    showToast(language === 'bn' ? 'সফলভাবে লগইন হয়েছে' : 'Login Successful!', 'success');
    return true;
  };

  const toggleVerifyUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
    showToast('User verification status updated', 'success');
  };

  // Service Area management
  const addServiceArea = (area: Omit<DeliveryArea, 'id'>) => {
    const newArea: DeliveryArea = {
      ...area,
      id: `area-${Date.now()}`,
    };
    setServiceAreas(prev => [...prev, newArea]);
    showToast(language === 'bn' ? 'নতুন সেবা এলাকা যুক্ত করা হয়েছে' : 'New delivery area added successfully', 'success');
  };

  const updateServiceArea = (id: string, patch: Partial<DeliveryArea>) => {
    setServiceAreas(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
    showToast(language === 'bn' ? 'এলাকার তথ্য আপডেট করা হয়েছে' : 'Delivery area updated', 'success');
  };

  const deleteServiceArea = (id: string) => {
    setServiceAreas(prev => prev.filter(a => a.id !== id));
    showToast('Delivery area removed', 'info');
  };

  // Product management
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      totalReviews: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(language === 'bn' ? 'নতুন পণ্য তালিকায় যুক্ত হয়েছে' : 'Product added to inventory', 'success');
  };

  const updateProduct = (id: string, patch: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
    showToast(language === 'bn' ? 'পণ্য সফলভাবে আপডেট করা হয়েছে' : 'Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(language === 'bn' ? 'পণ্য মুছে ফেলা হয়েছে' : 'Product deleted', 'info');
  };

  const updateShop = (id: string, patch: Partial<Shop>) => {
    setShops(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
    showToast('Store settings updated', 'success');
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedShopId: product.shopId }];
    });
    showToast(
      language === 'bn' ? `"${product.nameBn}" কার্টে যোগ করা হয়েছে` : `Added "${product.nameEn}" to cart`,
      'success'
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast(language === 'bn' ? 'কার্ট থেকে মুছে ফেলা হয়েছে' : 'Removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(language === 'bn' ? 'পছন্দের তালিকা থেকে সরানো হয়েছে' : 'Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast(language === 'bn' ? 'পছন্দের তালিকায় যুক্ত হয়েছে' : 'Added to wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  // Coupons
  const applyCouponCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!coupon) {
      return { success: false, message: language === 'bn' ? 'অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড' : 'Invalid or expired coupon code' };
    }
    const subtotal = cart.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    if (subtotal < coupon.minOrderAmount) {
      return {
        success: false,
        message: language === 'bn' 
          ? `এই কুপন ব্যবহারের জন্য সর্বনিম্ন ৳${coupon.minOrderAmount} টাকার অর্ডার প্রয়োজন`
          : `Minimum order amount for this coupon is ৳${coupon.minOrderAmount}`,
      };
    }

    setAppliedCoupon(coupon);
    showToast(language === 'bn' ? `কুপন "${coupon.code}" যুক্ত হয়েছে!` : `Coupon "${coupon.code}" applied!`, 'success');
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addCoupon = (coupon: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coupon-${Date.now()}`,
    };
    setCoupons(prev => [...prev, newCoupon]);
    showToast('New coupon created', 'success');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon removed', 'info');
  };

  // Banners
  const addBanner = (banner: Omit<PromoBanner, 'id'>) => {
    const newBanner: PromoBanner = {
      ...banner,
      id: `banner-${Date.now()}`,
    };
    setBanners(prev => [...prev, newBanner]);
    showToast('Promotional banner added', 'success');
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    showToast('Banner removed', 'info');
  };

  // Orders
  const placeOrder = async (orderPayload: Partial<Order>): Promise<Order> => {
    const orderNum = `AB-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toLocaleString();

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerId: currentUser.id,
      customerName: orderPayload.customerName || currentUser.name,
      customerPhone: orderPayload.customerPhone || currentUser.phone,
      deliveryAddress: orderPayload.deliveryAddress || {
        id: `addr-${Date.now()}`,
        title: 'Delivery Address',
        areaId: currentLocationDetails.areaId,
        areaName: selectedAreaObj?.nameEn || 'Local Delivery Area',
        unionName: currentLocationDetails.union,
        wardNo: currentLocationDetails.ward,
        villageName: currentLocationDetails.village,
        streetAddress: 'Local Address',
      },
      items: orderPayload.items || [],
      shopId: orderPayload.shopId || (orderPayload.items?.[0]?.shopId || 'shop-1'),
      shopName: orderPayload.shopName || (orderPayload.items?.[0]?.shopName || 'Local Shop'),
      shopPhone: orderPayload.shopPhone || '01811223344',
      subtotal: orderPayload.subtotal || 0,
      deliveryCharge: orderPayload.deliveryCharge || (selectedAreaObj?.deliveryCharge || 35),
      discount: orderPayload.discount || 0,
      couponCode: orderPayload.couponCode,
      totalAmount: orderPayload.totalAmount || 0,
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending',
      orderStatus: 'order_placed',
      statusHistory: [
        {
          status: 'order_placed',
          timestamp: now,
          note: 'Customer placed COD order',
        },
      ],
      placedAt: now,
      estimatedDeliveryTime: '30-40 mins',
      commissionAmount: (orderPayload.subtotal || 0) * commissionRate,
      sellerEarnings: (orderPayload.subtotal || 0) * (1 - commissionRate),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Trigger in-app notification for the customer & seller
    addNotificationInternal({
      userId: currentUser.id,
      role: 'customer',
      titleEn: `Order Placed: ${orderNum} (COD)`,
      titleBn: `অর্ডার গ্রহণ করা হয়েছে: ${orderNum} (ক্যাশ অন ডেলিভারি)`,
      messageEn: `Your order of ৳${newOrder.totalAmount} has been sent to ${newOrder.shopName}. Cash on Delivery.`,
      messageBn: `৳${newOrder.totalAmount} টাকার অর্ডারটি ${newOrder.shopName}-এ পাঠানো হয়েছে। ক্যাশ অন ডেলিভারি।`,
      type: 'order',
      orderId: newOrder.id,
      isRead: false,
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const now = new Date().toLocaleString();
    
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updatedHistory = [
            ...ord.statusHistory,
            { status: newStatus, timestamp: now, note },
          ];

          let paymentStatus = ord.paymentStatus;
          let deliveredAt = ord.deliveredAt;
          let cancelledAt = ord.cancelledAt;

          if (newStatus === 'delivered') {
            paymentStatus = 'collected_by_rider';
            deliveredAt = now;
          } else if (newStatus === 'cancelled') {
            cancelledAt = now;
          }

          // Create notification for customer
          let notifTitleEn = `Order ${ord.orderNumber} Updated`;
          let notifTitleBn = `অর্ডার ${ord.orderNumber} আপডেট`;
          let notifMsgEn = `Status: ${newStatus}`;
          let notifMsgBn = `বর্তমান অবস্থা: ${newStatus}`;

          if (newStatus === 'seller_confirmed') {
            notifTitleEn = `Seller Confirmed Order ${ord.orderNumber} ✅`;
            notifTitleBn = `দোকানদার আপনার অর্ডার ${ord.orderNumber} কনফার্ম করেছে ✅`;
            notifMsgEn = `${ord.shopName} accepted and confirmed your order.`;
            notifMsgBn = `${ord.shopName} আপনার অর্ডারটি গ্রহণ করেছে।`;
          } else if (newStatus === 'preparing') {
            notifTitleEn = `Order ${ord.orderNumber} is Preparing 🍲`;
            notifTitleBn = `অর্ডার ${ord.orderNumber} তৈরি হচ্ছে 🍲`;
            notifMsgEn = `Your items are freshly being prepared & packed.`;
            notifMsgBn = `আপনার পছন্দের পণ্যসমূহ প্রস্তুত ও প্যাকেজিং করা হচ্ছে।`;
          } else if (newStatus === 'picked_up') {
            notifTitleEn = `Rider Picked Up Order ${ord.orderNumber} 📦`;
            notifTitleBn = `রাইডার পণ্য পিকআপ করেছে 📦`;
            notifMsgEn = `Rider ${ord.riderName || 'Tanvir'} picked up your items from ${ord.shopName}.`;
            notifMsgBn = `রাইডার ${ord.riderName || 'তানভীর'} দোকান থেকে পার্সেল সংগ্রহ করেছে।`;
          } else if (newStatus === 'out_for_delivery') {
            notifTitleEn = `Out for Delivery! 🛵 (Keep ৳${ord.totalAmount} COD Ready)`;
            notifTitleBn = `ডেলিভারির জন্য বের হয়েছে! 🛵 (নগদ ৳${ord.totalAmount} প্রস্তুত রাখুন)`;
            notifMsgEn = `Rider is on the way to your doorstep with your order.`;
            notifMsgBn = `রাইডার আপনার ঠিকানার উদ্দেশ্যে রওনা দিয়েছেন।`;
          } else if (newStatus === 'delivered') {
            notifTitleEn = `Order Delivered Successfully 🎉 (COD Collected)`;
            notifTitleBn = `ডেলিভারি সম্পন্ন হয়েছে 🎉 (নগদ টাকা গ্রহণ)`;
            notifMsgEn = `Thank you for shopping with AmarBazar! Paid ৳${ord.totalAmount} in cash.`;
            notifMsgBn = `আমারবাজার থেকে কেনাকাটার জন্য ধন্যবাদ! নগদ ৳${ord.totalAmount} পরিশোধিত।`;
          }

          addNotificationInternal({
            userId: ord.customerId,
            role: 'customer',
            titleEn: notifTitleEn,
            titleBn: notifTitleBn,
            messageEn: notifMsgEn,
            messageBn: notifMsgBn,
            type: newStatus === 'delivered' || newStatus === 'out_for_delivery' ? 'delivery' : 'order',
            orderId: ord.id,
            isRead: false,
          });

          return {
            ...ord,
            orderStatus: newStatus,
            paymentStatus,
            deliveredAt,
            cancelledAt,
            statusHistory: updatedHistory,
          };
        }
        return ord;
      })
    );

    showToast(`Order status updated to "${newStatus.replace(/_/g, ' ')}"`, 'info');
  };

  const assignRiderToOrder = (orderId: string, riderId: string) => {
    const rider = users.find(u => u.id === riderId || u.role === 'rider') || users.find(u => u.role === 'rider');
    const now = new Date().toLocaleString();

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            riderId: rider?.id || 'user-rider-1',
            riderName: rider?.name || 'Tanvir Ahmed',
            riderPhone: rider?.phone || '01911223344',
            riderVehicle: 'Honda 125cc (Dhaka Metro-Ha 45-8912)',
            orderStatus: 'rider_assigned',
            statusHistory: [
              ...ord.statusHistory,
              { status: 'rider_assigned', timestamp: now, note: `Rider ${rider?.name || 'Tanvir'} assigned` },
            ],
          };
        }
        return ord;
      })
    );

    showToast('Rider assigned to order', 'success');
  };

  const riderAcceptOrder = (orderId: string) => {
    assignRiderToOrder(orderId, currentUser.id);
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'cancelled', reason || 'Cancelled by customer');
    showToast(language === 'bn' ? 'অর্ডারটি বাতিল করা হয়েছে' : 'Order cancelled successfully', 'info');
  };

  // Notifications
  const addNotificationInternal = (notif: Omit<AppNotification, 'id' | 'createdAt'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: 'Just now',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const broadcastNotification = (
    titleEn: string,
    titleBn: string,
    messageEn: string,
    messageBn: string,
    type: AppNotification['type'] = 'system'
  ) => {
    addNotificationInternal({
      role: 'all',
      titleEn,
      titleBn,
      messageEn,
      messageBn,
      type,
      isRead: false,
    });
    showToast(language === 'bn' ? 'সকল গ্রাহকের কাছে নোটিফিকেশন পাঠানো হয়েছে' : 'Broadcast notification sent to all users', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  // Complaints
  const submitComplaint = (comp: Omit<ComplaintTicket, 'id' | 'createdAt' | 'status'>) => {
    const newTicket: ComplaintTicket = {
      ...comp,
      id: `ticket-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toLocaleString(),
    };
    setComplaints(prev => [newTicket, ...prev]);
    showToast(language === 'bn' ? 'আপনার অভিযোগ জমা নেওয়া হয়েছে' : 'Support ticket submitted successfully', 'success');
  };

  const resolveComplaint = (id: string, resolutionNote: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved', resolutionNote } : c));
    showToast('Complaint ticket marked as resolved', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        switchUser,
        users,
        loginWithPhoneOtp,
        toggleVerifyUser,
        language,
        setLanguage,
        serviceAreas,
        selectedAreaId,
        setSelectedAreaId,
        currentLocationDetails,
        setDeliveryLocation,
        isServiceAvailableInArea,
        addServiceArea,
        updateServiceArea,
        deleteServiceArea,
        products,
        shops,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        updateShop,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        coupons,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        banners,
        addBanner,
        deleteBanner,
        orders,
        placeOrder,
        updateOrderStatus,
        assignRiderToOrder,
        riderAcceptOrder,
        cancelOrder,
        notifications,
        unreadNotifCount,
        markNotificationRead,
        markAllNotificationsRead,
        broadcastNotification,
        complaints,
        submitComplaint,
        resolveComplaint,
        toasts,
        showToast,
        removeToast,
        commissionRate,
        setCommissionRate,
        logoConfig,
        updateLogoConfig,
        resetLogoConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
