import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { productService } from '../../services/productService';
import { useToastStore } from '../../store/useToastStore';
import { useAuth } from '../../hooks/useAuth';

export const SellerCard = ({ seller, productId, onVerificationChanged }) => {
  const { user } = useAuth();
  const addToast = useToastStore((state) => state.addToast);
  const [isReporting, setIsReporting] = useState(false);
  const isVerified = seller?.studentVerification?.status === 'verified';
  const isFraud = seller?.studentVerification?.status === 'fraud';
  const isOwnListing = Boolean(user?.id) && String(user.id) === String(seller?.id);

  const handleReport = async () => {
    if (!productId || isOwnListing) {
      return;
    }

    setIsReporting(true);
    try {
      const updatedVerification = await productService.reportSellerVerification(productId);
      onVerificationChanged?.(updatedVerification);
      addToast('Report submitted. We will mark seller as fraud after repeated reports.', 'info');
    } catch (error) {
      addToast(error.message || 'Unable to submit report.', 'error');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="mb-8 rounded-[24px] bg-md-surface-container p-5 shadow-md-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar src={seller.avatar} name={seller.name} size="lg" />
          <div>
            <p className="font-medium text-md-on-background">{seller.name}</p>
            <div className={`mt-0.5 flex items-center text-xs font-medium ${isVerified ? 'text-md-on-background' : 'text-md-tertiary'}`}>
              <ShieldCheck className="h-3 w-3 mr-1" />
              {isFraud ? 'Fraud Reported Seller' : (isVerified ? 'Verified Student Seller' : 'Not Verified')}
            </div>
            {typeof seller?.studentVerification?.reportCount === 'number' && seller.studentVerification.reportCount > 0 && (
              <p className="mt-1 text-[11px] font-medium text-md-tertiary">Reports: {seller.studentVerification.reportCount}</p>
            )}
          </div>
        </div>
      </div>

      {!isOwnListing && isVerified && !isFraud && (
        <div className="mt-5 border-t border-md-outline/35 pt-4">
          <Button variant="danger" size="sm" onClick={handleReport} isLoading={isReporting}>
            Report Seller Verification
          </Button>
        </div>
      )}
    </div>
  );
};