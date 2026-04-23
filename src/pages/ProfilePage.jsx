import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/ui/PageHeader';
import { productService } from '../services/productService';
import { Spinner } from '../components/ui/Spinner';

// Import our newly architected components!
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileTabs } from '../components/profile/ProfileTabs';
import { MyListings } from '../components/profile/MyListings';
import { ReservationRequests } from '../components/profile/ReservationRequests';
import { WishlistTab } from '../components/profile/WishlistTab';
import { PurchaseHistory } from '../components/profile/PurchaseHistory';
import { SettingsSection } from '../components/profile/SettingsSection';

export const ProfilePage = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromQuery = searchParams.get('tab');
  
  // State to track which tab is currently selected
  const [activeTab, setActiveTab] = useState(tabFromQuery || 'listings');
  const [myListings, setMyListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  useEffect(() => {
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [activeTab, tabFromQuery]);

  useEffect(() => {
    let isMounted = true;

    const loadMyListings = async () => {
      if (!user?.id) {
        if (isMounted) {
          setMyListings([]);
          setIsLoadingListings(false);
        }
        return;
      }

      if (isMounted) {
        setIsLoadingListings(true);
      }
      try {
        const products = await productService.getMyProducts();
        if (isMounted) {
          setMyListings(products);
        }
      } finally {
        if (isMounted) {
          setIsLoadingListings(false);
        }
      }
    };

    loadMyListings();

    const handleWindowFocus = () => {
      if (activeTab === 'listings') {
        loadMyListings();
      }
    };

    window.addEventListener('focus', handleWindowFocus);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [activeTab, user?.id]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleVerificationUpdated = (updatedUser) => {
    if (updatedUser) {
      login(updatedUser);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-20">
      <PageHeader title="My Profile" />

      <ProfileHeader user={user} />

      <div className="min-h-[400px] rounded-[24px] bg-md-surface-container p-6 shadow-md-md sm:p-8">
        
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content Rendering */}
        <div className="mt-6">
          {activeTab === 'listings' && (
            isLoadingListings
              ? <div className="flex justify-center py-10"><Spinner /></div>
              : <MyListings listings={myListings} />
          )}
          {activeTab === 'requests' && <ReservationRequests />}
          {activeTab === 'wishlist' && <WishlistTab />}
          {activeTab === 'purchases' && <PurchaseHistory />}
          {activeTab === 'settings' && (
            <SettingsSection user={user} onLogout={handleLogout} onVerificationUpdated={handleVerificationUpdated} />
          )}
        </div>

      </div>
    </div>
  );
};