import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { reservationService } from '../../services/reservationService';
import { useToastStore } from '../../store/useToastStore';
import { useAuth } from '../../hooks/useAuth';

export const ActionButtons = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const addToast = useToastStore((state) => state.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationStatus, setReservationStatus] = useState(product?.viewerReservationStatus || null);
  const [reservationId, setReservationId] = useState(product?.viewerReservationId || null);
  const isOwnListing = Boolean(user?.id) && String(product?.seller?.id || '') === String(user.id);

  useEffect(() => {
    setReservationStatus(product?.viewerReservationStatus || null);
    setReservationId(product?.viewerReservationId || null);
  }, [product?.id, product?.viewerReservationId, product?.viewerReservationStatus]);

  const handleReserveNow = async () => {
    if (isOwnListing) {
      addToast('You cannot reserve your own listing.', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      const reservation = await reservationService.requestReservation(product.id);
      setReservationStatus(reservation?.status || 'pending');
      setReservationId(reservation?.id || null);
      addToast('Reservation request sent. We will update you after seller decision.');
    } catch (buyError) {
      addToast(buyError.message || 'Unable to send reservation request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReserve = async () => {
    if (!reservationId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await reservationService.cancelReservation(reservationId);
      setReservationStatus(null);
      setReservationId(null);
      addToast('Reservation cancelled. This listing is open again.');
    } catch (cancelError) {
      addToast(cancelError.message || 'Unable to cancel reservation.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageSeller = () => {
    if (isOwnListing) {
      addToast('This is your own listing.', 'info');
      return;
    }

    navigate(`/chat?productId=${encodeURIComponent(product.id)}`);
  };

  const isPending = reservationStatus === 'pending';
  const isReservedForBuyer = reservationStatus === 'reserved';
  const isReservedForOtherBuyer = product?.status === 'reserved' && !isReservedForBuyer;
  const isUnavailable = (product?.status === 'sold out' || isReservedForOtherBuyer) && !isReservedForBuyer;

  return (
    <div className="mt-auto flex flex-col gap-3 border-t border-md-outline/35 pt-6 sm:flex-row">
      <Button
        variant="primary"
        size="lg"
        className="flex-1 flex items-center justify-center gap-2"
        onClick={handleMessageSeller}
        disabled={isOwnListing}
      >
        <MessageCircle className="h-5 w-5" />
        Message Seller
      </Button>

      <div className="flex-1 block">
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={isReservedForBuyer ? handleCancelReserve : handleReserveNow}
          isLoading={isSubmitting}
          disabled={isOwnListing || isPending || isUnavailable}
        >
          {isOwnListing
            ? 'Your Listing'
            : isPending
              ? 'Request Sent'
              : isReservedForOtherBuyer
                ? 'Reserved'
              : isUnavailable
                ? 'Sold Out'
                : isReservedForBuyer
                  ? 'Cancel Reserve'
                  : 'Reserve Now'}
        </Button>
      </div>

      {isPending && (
        <p className="text-xs text-md-on-background/75 sm:basis-full">
          We will update you when the seller reserves or cancels your request.
        </p>
      )}

      {isReservedForBuyer && (
        <p className="text-xs text-md-on-background/75 sm:basis-full">
          Seller reserved this listing for you. Cancel reserve if the deal does not happen.
        </p>
      )}

    </div>
  );
};