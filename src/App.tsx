import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HomePage } from './components/HomePage.tsx';
import { MarketplaceView } from './components/MarketplaceView.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { FarmerPortal } from './components/FarmerPortal.tsx';
import { BusinessProcurement } from './components/BusinessProcurement.tsx';
import { InputMarketplaceView } from './components/InputMarketplaceView.tsx';
import { LogisticsHubPortal } from './components/LogisticsHubPortal.tsx';
import { FinancePortal } from './components/FinancePortal.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { AboutPage } from './components/AboutPage.tsx';
import { Footer } from './components/Footer.tsx';
import { NotificationsModal } from './components/NotificationsModal.tsx';
import { USSDModal } from './components/USSDModal.tsx';
import { RegisterModal } from './components/RegisterModal.tsx';
import { BrandModal } from './components/BrandModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CallCenterModal } from './components/CallCenterModal.tsx';
import { User, Product, ProductCategory, CartItem, Notification } from './types/index.ts';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  // Cart State
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotalEtb, setSubtotalEtb] = useState(0);
  const [deliveryFeeEtb, setDeliveryFeeEtb] = useState(0);
  const [serviceFeeEtb, setServiceFeeEtb] = useState(0);
  const [grandTotalEtb, setGrandTotalEtb] = useState(0);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notifsModalOpen, setNotifsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [ussdModalOpen, setUssdModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [callCenterModalOpen, setCallCenterModalOpen] = useState(false);

  // Initial Data Fetching
  const fetchAuthAndPlatformData = async () => {
    try {
      const [usrRes, curRes, catRes, prodRes, notifRes] = await Promise.all([
        fetch('/api/auth/users'),
        fetch('/api/auth/current'),
        fetch('/api/categories'),
        fetch('/api/products'),
        fetch('/api/notifications'),
      ]);

      if (usrRes.ok) setAllUsers(await usrRes.json());
      
      // If user previously logged in, restore session; otherwise default to open Guest Mode
      const isAuthSaved = localStorage.getItem('agrilink_authenticated') === 'true';
      if (isAuthSaved && curRes.ok) {
        setCurrentUser(await curRes.json());
      } else {
        setCurrentUser(null);
      }

      if (catRes.ok) setCategories(await catRes.json());
      if (prodRes.ok) setFeaturedProducts(await prodRes.json());
      if (notifRes.ok) setNotifications(await notifRes.json());
    } catch (err) {
      console.error('Initial load error:', err);
    }
  };

  const fetchCartData = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
        setSubtotalEtb(data.subtotalEtb || 0);
        setDeliveryFeeEtb(data.deliveryFeeEtb || 0);
        setServiceFeeEtb(data.serviceFeeEtb || 0);
        setGrandTotalEtb(data.grandTotalEtb || 0);
      }
    } catch (err) {
      console.error('Cart fetch error:', err);
    }
  };

  useEffect(() => {
    fetchAuthAndPlatformData();
    fetchCartData();
  }, []);

  // Switch Active User / Stakeholder Persona
  const handleSwitchUser = async (userId: number) => {
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        const curRes = await fetch('/api/auth/current');
        if (curRes.ok) {
          const user = await curRes.json();
          setCurrentUser(user);
          localStorage.setItem('agrilink_authenticated', 'true');
          fetchCartData();
          
          // Auto route to relevant tab on switch for convenience
          if (user.role === 'FARMER') setActiveTab('farmer-portal');
          else if (user.role === 'BUSINESS_BUYER') setActiveTab('procurement');
          else if (user.role === 'INPUT_SUPPLIER') setActiveTab('inputs');
          else if (user.role === 'DRIVER' || user.role === 'LOGISTICS_ADMIN' || user.role === 'HUB_OPERATOR') setActiveTab('logistics');
          else if (user.role === 'FINANCIAL_INSTITUTION') setActiveTab('finance');
          else if (user.role === 'PLATFORM_ADMIN') setActiveTab('admin');
        }
      }
    } catch (err) {
      console.error('Switch user error:', err);
    }
  };

  // Log Out / Return to Open Guest Mode
  const handleLogoutToGuest = () => {
    localStorage.removeItem('agrilink_authenticated');
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Add Item to Persistent Cart
  const handleAddToCart = async (item: any, quantity: number) => {
    try {
      const isInput = item.itemType === 'INPUT' || item.priceEtb !== undefined;
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: isInput ? 'INPUT' : 'PRODUCE',
          productId: isInput ? null : item.id,
          inputProductId: isInput ? item.id : null,
          quantity,
          unitPriceEtb: isInput ? item.priceEtb : item.pricePerUnitEtb,
        }),
      });

      if (res.ok) {
        await fetchCartData();
        setCartDrawerOpen(true);
      }
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  // Update Cart Quantity
  const handleUpdateCartQty = async (itemId: number, newQty: number) => {
    try {
      await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      });
      fetchCartData();
    } catch (err) {
      console.error('Update qty error:', err);
    }
  };

  // Remove Cart Item
  const handleRemoveCartItem = async (itemId: number) => {
    try {
      await fetch(`/api/cart/items/${itemId}`, { method: 'DELETE' });
      fetchCartData();
    } catch (err) {
      console.error('Remove item error:', err);
    }
  };

  // Clear Cart
  const handleClearCart = async () => {
    try {
      await fetch('/api/cart', { method: 'DELETE' });
      fetchCartData();
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  const handleMarkNotifRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error('Mark notif error:', err);
    }
  };

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-zinc-100/70 text-zinc-900 flex flex-col justify-between font-sans antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Sticky Top Navigation */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItemCount={cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
        onOpenCart={() => setCartDrawerOpen(true)}
        unreadNotifsCount={unreadNotifs}
        onOpenNotifs={() => setNotifsModalOpen(true)}
        onOpenUSSD={() => setUssdModalOpen(true)}
        onOpenRegister={() => setRegisterModalOpen(true)}
        onOpenBrandModal={() => setBrandModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogoutToGuest={handleLogoutToGuest}
        onOpenCallCenter={() => setCallCenterModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-20 sm:pt-[88px]">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={setActiveTab}
            categories={categories}
            featuredProducts={featuredProducts}
            onSelectProduct={(p) => setSelectedProduct(p)}
            currentUser={currentUser}
            onOpenLogin={() => setAuthModalOpen(true)}
            onOpenSignUp={() => setRegisterModalOpen(true)}
            onOpenUSSD={() => setUssdModalOpen(true)}
            onOpenBrand={() => setBrandModalOpen(true)}
            onLogoutToGuest={handleLogoutToGuest}
            onOpenCallCenter={() => setCallCenterModalOpen(true)}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceView
            categories={categories}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'inputs' && (
          <InputMarketplaceView onAddToCart={handleAddToCart} />
        )}

        {activeTab === 'farmer-portal' && (
          <FarmerPortal
            currentUser={currentUser}
            onRefreshData={fetchAuthAndPlatformData}
            onNavigateToFinance={() => setActiveTab('finance')}
            onOpenUSSD={() => setUssdModalOpen(true)}
          />
        )}

        {activeTab === 'procurement' && (
          <BusinessProcurement
            currentUser={currentUser}
            onSelectProductForQuote={() => setActiveTab('marketplace')}
          />
        )}

        {activeTab === 'logistics' && (
          <LogisticsHubPortal currentUser={currentUser} />
        )}

        {activeTab === 'finance' && (
          <FinancePortal currentUser={currentUser} />
        )}

        {activeTab === 'admin' && (
          <AdminPortal
            currentUser={currentUser}
            onRefreshAll={fetchAuthAndPlatformData}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage onNavigate={setActiveTab} />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onRequestQuote={() => {
          setSelectedProduct(null);
          setActiveTab('procurement');
        }}
      />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        subtotalEtb={subtotalEtb}
        deliveryFeeEtb={deliveryFeeEtb}
        serviceFeeEtb={serviceFeeEtb}
        grandTotalEtb={grandTotalEtb}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderSuccess={() => {
          fetchCartData();
          fetchAuthAndPlatformData();
        }}
      />

      <NotificationsModal
        isOpen={notifsModalOpen}
        onClose={() => setNotifsModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifRead}
      />

      {/* Offline USSD Code Simulator Modal */}
      <USSDModal
        isOpen={ussdModalOpen}
        onClose={() => setUssdModalOpen(false)}
        currentUserPhone={currentUser?.phone || '0961123330'}
      />

      {/* Stakeholder & Farmer Classification Registration Modal */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegisteredSuccess={(newUser) => {
          fetchAuthAndPlatformData();
          setCurrentUser(newUser);
        }}
      />

      {/* Pro Authentication & Login/Sign In Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        allUsers={allUsers}
        currentUser={currentUser}
        onSelectExistingUser={handleSwitchUser}
        onOpenSignUp={() => {
          setAuthModalOpen(false);
          setRegisterModalOpen(true);
        }}
        onOpenUSSD={() => {
          setAuthModalOpen(false);
          setUssdModalOpen(true);
        }}
        onContinueAsGuest={handleLogoutToGuest}
        onOpenCallCenter={() => {
          setAuthModalOpen(false);
          setCallCenterModalOpen(true);
        }}
        onOpenBrand={() => {
          setAuthModalOpen(false);
          setBrandModalOpen(true);
        }}
      />

      {/* 24/7 Call Center & Customer Desk Modal */}
      <CallCenterModal
        isOpen={callCenterModalOpen}
        onClose={() => setCallCenterModalOpen(false)}
        onOpenUSSD={() => {
          setCallCenterModalOpen(false);
          setUssdModalOpen(true);
        }}
      />

      {/* Official Brand Identity & High-Res Emblem Modal */}
      <BrandModal
        isOpen={brandModalOpen}
        onClose={() => setBrandModalOpen(false)}
        onNavigateHome={() => setActiveTab('home')}
      />

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
