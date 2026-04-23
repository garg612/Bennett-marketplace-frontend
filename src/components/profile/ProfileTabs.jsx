export const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'listings', label: 'My Listings' },
    { id: 'requests', label: 'Reservation Requests' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'purchases', label: 'Purchase History' },
    { id: 'settings', label: 'Account Settings' }
  ];

  return (
    // 1. Added 'flex-nowrap' to the container
    <div className="mb-6 flex snap-x flex-nowrap space-x-2 overflow-x-auto pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          // 2. Added 'shrink-0' to the button
          className={`focus-ring shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ease-material ${
            activeTab === tab.id 
              ? 'border-md-primary bg-md-primary text-md-on-primary' 
              : 'border-md-outline/50 text-md-on-background/75 hover:bg-md-secondary-container hover:text-md-on-background'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};