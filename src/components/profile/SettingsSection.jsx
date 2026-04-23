import { useEffect, useState } from 'react';
import { CheckCircle2, LogOut, Settings, ShieldCheck, MailCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { authService } from '../../services/authService';
import { useToastStore } from '../../store/useToastStore';

export const SettingsSection = ({ user, onLogout, onVerificationUpdated }) => {
  const addToast = useToastStore((state) => state.addToast);
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const isVerified = user?.studentVerification?.status === 'verified';
  const canResendOtp = secondsLeft <= 0;

  useEffect(() => {
    if (!otpExpiresAt) {
      setSecondsLeft(0);
      return;
    }

    const updateCountdown = () => {
      const expiresAtMs = new Date(otpExpiresAt).getTime();
      const remainingSeconds = Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000));
      setSecondsLeft(remainingSeconds);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [otpExpiresAt]);

  const formatCountdown = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();

    setIsSendingOtp(true);
    try {
      if (isOtpSent && !canResendOtp) {
        return;
      }

      const response = await authService.requestStudentVerificationOtp();
      setIsOtpSent(true);
      setOtpExpiresAt(response?.otpExpiresAt || new Date(Date.now() + 10 * 60 * 1000).toISOString());
      addToast('OTP sent to your registered email. Please enter it below.', 'success');
    } catch (error) {
      addToast(error.message || 'Unable to send OTP.', 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp.trim())) {
      addToast('Please enter a valid 6 digit OTP.', 'error');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const updatedUser = await authService.verifyStudentVerificationOtp({
        otp: otp.trim()
      });
      onVerificationUpdated?.(updatedUser);
      addToast('Student verification completed successfully.', 'success');
      setOtp('');
      setIsOtpSent(false);
      setOtpExpiresAt(null);
      setSecondsLeft(0);
    } catch (error) {
      addToast(error.message || 'Unable to verify OTP.', 'error');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <h3 className="mb-4 flex items-center gap-2 text-card-title font-medium tracking-tight text-md-on-background">
            <Settings className="h-5 w-5 text-md-primary" /> 
            Account Details
          </h3>
          <div className="space-y-5 rounded-[24px] bg-md-surface-container-low p-6 shadow-md-sm">
            <Input label="Full Name" defaultValue={user.name} disabled />
            <Input label="Bennett Email" defaultValue={user.email} disabled />
            <p className="mt-2 text-xs text-md-on-background/70">
              * To change your verified campus email, please contact support.
            </p>
          </div>
        </div>

        <div className="xl:col-span-7">
          <h3 className="mb-4 flex items-center gap-2 text-card-title font-medium tracking-tight text-md-on-background">
            <ShieldCheck className="h-5 w-5 text-md-primary" />
            Verify Your Student Status
          </h3>

          <div className="space-y-4 rounded-[24px] bg-md-surface-container p-6 shadow-md-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                isVerified
                  ? 'bg-md-primary text-md-on-primary'
                  : 'bg-md-tertiary text-md-on-tertiary'
              }`}>
                <CheckCircle2 className="h-3 w-3" />
                {isVerified ? 'Verified Student' : 'Not Verified'}
              </span>
              <span className="text-xs text-md-on-background/70">Click send OTP and enter the code received on your registered email.</span>
            </div>

            {!isVerified && (
              <div className="space-y-4">
                <form onSubmit={handleSendOtp}>
                  <Button
                    type="submit"
                    isLoading={isSendingOtp}
                    disabled={isOtpSent && !canResendOtp}
                    className="flex items-center gap-2"
                  >
                    <MailCheck className="h-4 w-4" />
                    {isOtpSent
                      ? (canResendOtp ? 'Resend OTP' : `Resend OTP in ${formatCountdown(secondsLeft)}`)
                      : 'Send OTP'}
                  </Button>
                </form>

                {isOtpSent && (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <Input
                      label="Enter 6-digit OTP"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                    />
                    <Button type="submit" isLoading={isVerifyingOtp}>
                      Verify OTP
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-md-outline/35 pt-6">
        <h3 className="mb-4 text-card-title font-medium tracking-tight text-md-tertiary">Danger Zone</h3>
        <div className="flex flex-col items-center justify-between gap-4 rounded-[24px] bg-md-surface-container p-6 shadow-md-sm sm:flex-row">
          <div>
            <h4 className="font-medium text-md-on-background">Log Out</h4>
            <p className="text-sm text-md-on-background/75">Safely log out of your marketplace account.</p>
          </div>
          <Button variant="danger" onClick={onLogout} className="flex items-center gap-2 shrink-0">
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};