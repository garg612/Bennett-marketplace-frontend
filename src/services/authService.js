import { apiClient } from '../api/client';

const getApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  return configuredBaseUrl ? configuredBaseUrl.replace(/\/+$/, '') : '';
};

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    id: String(user.id || user._id),
    name: user.name,
    email: user.email,
    avatar: user.avatar || '',
    studentVerification: {
      status: user.studentVerification?.status || 'unverified',
      idCardFront: user.studentVerification?.idCardFront || '',
      idCardBack: user.studentVerification?.idCardBack || '',
      submittedAt: user.studentVerification?.submittedAt || null,
      reportCount: Number(user.studentVerification?.reportCount || 0)
    }
  };
};

export const authService = {
  async logout() {
    await apiClient.post('/api/users/logout', {});
    return true;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/api/users/profile');
    return normalizeUser(response?.data?.user);
  },

  async requestStudentVerificationOtp() {
    const response = await apiClient.post('/api/users/verify_student', {});
    return {
      otpExpiresAt: response?.data?.otpExpiresAt || null
    };
  },

  async verifyStudentVerificationOtp({ otp }) {
    const response = await apiClient.post('/api/users/verify_student/otp', { otp });
    return normalizeUser(response?.data?.user);
  },

  loginWithMicrosoft() {
    const base = getApiBaseUrl();
    window.location.href = base ? `${base}/auth/microsoft` : '/auth/microsoft';
  }
};