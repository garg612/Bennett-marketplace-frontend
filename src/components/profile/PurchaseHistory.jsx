import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { reservationService } from '../../services/reservationService';
import { formatDateTime } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import { Spinner } from '../ui/Spinner';

export const PurchaseHistory = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadReservations = async () => {
      try {
        const reservations = await reservationService.getMyReservations();
        if (mounted) {
          setItems(reservations);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadReservations();
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="py-10 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="animate-in fade-in duration-300">
        <EmptyState 
          icon={ShoppingBag}
          title="No reservations yet"
          description="Listings you reserve will appear here with latest seller decision."
          action={
            <Link to="/listings">
              <Button variant="outline">Start Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h3 className="text-card-title font-medium tracking-tight text-md-on-background">My Reservations</h3>
      {items.map((item) => (
        <div key={item.id} className="rounded-[24px] bg-md-surface-container-low p-4 shadow-md-sm">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[16px] bg-md-surface-container">
              <img
                src={item.product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={item.product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link to={`/listings/${item.product.id}`} className="focus-ring rounded-md text-sm font-medium text-md-on-background transition-colors duration-300 ease-material hover:text-md-primary">
                {item.product.title}
              </Link>
              <p className="text-sm font-medium text-md-primary">{formatPrice(item.product.price)}</p>
              <p className="mt-1 text-xs text-md-on-background/70">Requested {formatDateTime(item.createdAt)}</p>
              <span className="mt-2 inline-flex rounded-full bg-md-secondary-container px-3 py-1 text-[11px] font-medium text-md-on-secondary-container">
                {item.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};