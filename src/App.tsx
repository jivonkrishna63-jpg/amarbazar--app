import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { LocationPickerModal } from './components/common/LocationPickerModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AuthModal } from './components/common/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';
import { BottomNav, CustomerTab } from './components/common/BottomNav';
import { InstallModal } from './components/common/InstallModal';
import { InstallBanner } from './components/common/InstallBanner';

// Customer Views & Modals
import { CustomerHome } from './components/customer/CustomerHome';
import { CategoriesView } from './components/customer/CategoriesView';
import { CartView } from './components/customer/CartView';
import { OrderHistoryView } from './components/customer/OrderHistoryView';
import { ProfileView } from './components/customer/ProfileView';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { ShopDetailModal } from './components/customer/ShopDetailModal';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackingModal } from './components/customer/OrderTrackingModal';

// Other Role Dashboards
import { SellerDashboard } from './components/seller/SellerDashboard';
import { RiderDashboard } from './components/rider/RiderDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { Product, ProductCategory, Order } from './types';
import { translations } from './utils/translations';

const MainLayout: React.FC = () => {
  const { currentRole, language, setSelectedCategory } = useApp();
  const t = translations[language];

  // Customer Navigation State
  const [customerTab, setCustomerTab] = useState<CustomerTab>('home');

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Capture PWA install prompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Detail modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directBuyItem, setDirectBuyItem] = useState<{ product: Product; quantity: number } | null>(null);

  const handleSelectCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setCustomerTab('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickBuyNow = (product: Product, quantity: number) => {
    setDirectBuyItem({ product, quantity });
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setDirectBuyItem(null);
    setActiveTrackingOrderId(order.id);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Smart PWA Install Top Banner */}
      <InstallBanner
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        deferredPrompt={deferredPrompt}
      />

      {/* Top Main Navigation Header */}
      <Header
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Role Switcher Floating Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3">
        <RoleSwitcher />
      </div>

      {/* Main Container Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {currentRole === 'customer' && (
          <>
            {customerTab === 'home' && (
              <CustomerHome
                onSelectProduct={prod => setSelectedProduct(prod)}
                onSelectShop={shopId => setSelectedShopId(shopId)}
                onSelectCategory={handleSelectCategory}
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
                onQuickBuyNow={handleQuickBuyNow}
              />
            )}

            {customerTab === 'categories' && (
              <CategoriesView
                onSelectProduct={prod => setSelectedProduct(prod)}
                onQuickBuyNow={handleQuickBuyNow}
              />
            )}

            {customerTab === 'cart' && (
              <CartView
                onStartShopping={() => setCustomerTab('home')}
                onProceedCheckout={() => {
                  setDirectBuyItem(null);
                  setIsCheckoutOpen(true);
                }}
              />
            )}

            {customerTab === 'orders' && (
              <OrderHistoryView
                onOpenTracking={orderId => setActiveTrackingOrderId(orderId)}
                onStartShopping={() => setCustomerTab('home')}
              />
            )}

            {customerTab === 'profile' && (
              <ProfileView
                onSelectProduct={prod => setSelectedProduct(prod)}
                deferredPrompt={deferredPrompt}
              />
            )}
          </>
        )}

        {currentRole === 'seller' && <SellerDashboard />}
        {currentRole === 'rider' && <RiderDashboard />}
        {currentRole === 'admin' && <AdminDashboard />}
      </main>

      {/* Customer Mobile Bottom Navigation Bar */}
      {currentRole === 'customer' && (
        <BottomNav activeTab={customerTab} setActiveTab={setCustomerTab} />
      )}

      {/* Shared Modals */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        onOpenOrder={orderId => {
          setIsNotifDrawerOpen(false);
          setActiveTrackingOrderId(orderId);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
      />

      {/* Customer Detail Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenShop={shopId => {
          setSelectedProduct(null);
          setSelectedShopId(shopId);
        }}
        onBuyNow={(prod, qty) => {
          setSelectedProduct(null);
          handleQuickBuyNow(prod, qty);
        }}
      />

      <ShopDetailModal
        shopId={selectedShopId}
        onClose={() => setSelectedShopId(null)}
        onSelectProduct={prod => setSelectedProduct(prod)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectBuyItem(null);
        }}
        directBuyItem={directBuyItem}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackingModal
        orderId={activeTrackingOrderId}
        onClose={() => setActiveTrackingOrderId(null)}
      />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
