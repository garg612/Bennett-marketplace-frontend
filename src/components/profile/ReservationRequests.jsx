import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellRing } from 'lucide-react';
import { reservationService } from '../../services/reservationService';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Spinner } from '../ui/Spinner';
import { formatDateTime } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import { useToastStore } from '../../store/useToastStore';

export const ReservationRequests = () => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadRequests = async () => {
      try {
        const incoming = await reservationService.getIncomingReservations();
        if (mounted) {
          setRequests(incoming);
        }
      } catch (error) {
        if (mounted) {
          addToast(error.message || 'Unable to load reservation requests.', 'error');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadRequests();
    const poll = setInterval(loadRequests, 10000);

    return () => {
      mounted = false;
      clearInterval(poll);
    };
  }, [addToast]);

  const handleDecision = async (requestId, action) => {
    setProcessingId(requestId);
    try {
      await reservationService.decideReservation(requestId, action);
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
      addToast(action === 'reserve' ? 'Listing reserved for buyer.' : 'Reservation request cancelled.');
    } catch (error) {
      addToast(error.message || 'Unable to update request.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={BellRing}
        title="No reservation requests"
        description="Reserve requests from interested buyers will appear here until you reserve or cancel."
        action={
          <Link to="/listings">
            <Button variant="outline">Browse marketplace</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-card-title font-medium tracking-tight text-md-on-background">Reservation Requests</h3>
        <span className="text-xs text-md-on-background/70">Pending and reserved deals</span>
      </div>

      {requests.map((request) => {
        const isReserved = request.status === 'reserved';
        const isProcessing = processingId === request.id;

        return (
          <div key={request.id} className="rounded-[24px] bg-md-surface-container-low p-4 shadow-md-sm">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[16px] bg-md-surface-container">
                <img
                  src={request.product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={request.product.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Link to={`/listings/${request.product.id}`} className="focus-ring rounded-md text-sm font-medium text-md-on-background transition-colors duration-300 ease-material hover:text-md-primary">
                    {request.product.title}
                  </Link>
                  <span className="rounded-full bg-md-secondary-container px-3 py-1 text-xs font-medium text-md-on-secondary-container">
                    {isReserved ? 'Reserved' : 'Pending decision'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-md-on-background/80">
                  Buyer: {request.buyer.name} ({request.buyer.email || 'no email'})
                </p>
                <p className="mt-1 text-sm font-medium text-md-primary">{formatPrice(request.product.price)}</p>
                <p className="mt-1 text-xs text-md-on-background/70">Requested on {formatDateTime(request.createdAt)}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {!isReserved && (
                    <Button
                      size="sm"
                      variant="primary"
                      isLoading={isProcessing}
                      onClick={() => handleDecision(request.id, 'reserve')}
                    >
                      Reserve for buyer
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={isProcessing}
                    onClick={() => handleDecision(request.id, 'cancel')}
                  >
                    {isReserved ? 'Cancel reserve' : 'Cancel request'}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/chat?productId=${encodeURIComponent(request.product.id)}&participantId=${encodeURIComponent(request.buyer.id)}`)}
                  >
                    Chat first
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
