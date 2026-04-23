import { apiClient } from '../api/client';

const normalizeReservation = (reservation) => {
  if (!reservation) {
    return null;
  }

  return {
    id: String(reservation.id || reservation._id),
    status: reservation.status || 'pending',
    createdAt: reservation.createdAt || new Date().toISOString(),
    decidedAt: reservation.decidedAt || null,
    product: {
      id: String(reservation.product?.id || reservation.product?._id || ''),
      title: reservation.product?.title || reservation.product?.name || 'Unknown Product',
      price: reservation.product?.price || 0,
      image: reservation.product?.image || reservation.product?.images?.[0] || '',
      status: reservation.product?.status || 'available'
    },
    buyer: {
      id: String(reservation.buyer?.id || reservation.buyer?._id || ''),
      name: reservation.buyer?.name || 'Unknown Buyer',
      email: reservation.buyer?.email || ''
    },
    seller: {
      id: String(reservation.seller?.id || reservation.seller?._id || ''),
      name: reservation.seller?.name || 'Unknown Seller',
      email: reservation.seller?.email || ''
    }
  };
};

export const reservationService = {
  async requestReservation(productId) {
    const response = await apiClient.post(`/api/reservations/request/${productId}`, {});
    return normalizeReservation(response?.data?.reservation);
  },

  async getIncomingReservations() {
    const response = await apiClient.get('/api/reservations/incoming');
    const reservations = response?.data?.reservations || [];
    return reservations.map(normalizeReservation);
  },

  async getMyReservations() {
    const response = await apiClient.get('/api/reservations/mine');
    const reservations = response?.data?.reservations || [];
    return reservations.map(normalizeReservation);
  },

  async decideReservation(reservationId, action) {
    const response = await apiClient.patch(`/api/reservations/${reservationId}/decision`, { action });
    return normalizeReservation(response?.data?.reservation);
  },

  async cancelReservation(reservationId) {
    const response = await apiClient.patch(`/api/reservations/${reservationId}/cancel`, {});
    return normalizeReservation(response?.data?.reservation);
  }
};
