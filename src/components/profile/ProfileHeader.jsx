import { Avatar } from '../ui/Avatar';

export const ProfileHeader = ({ user }) => {
  const isVerified = user?.studentVerification?.status === 'verified';

  return (
    <div className="mb-8 rounded-[24px] border border-md-outline/20 bg-md-surface-container p-6 shadow-md-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <Avatar src={user?.avatar} name={user?.name} size="lg" className="h-20 w-20 text-2xl sm:h-24 sm:w-24 sm:text-3xl" />

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-semibold leading-tight tracking-tight text-md-on-background sm:text-3xl">
            {user?.name || 'Student'}
          </h2>
          <p className="mt-1 truncate text-sm font-normal leading-relaxed text-md-on-background/75 sm:text-base">
            {user?.email}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
            <span className="rounded-full border border-md-outline/25 bg-md-background px-3 py-1 font-medium leading-none text-md-on-background">
              Bennett University
            </span>
            <span
              className={`rounded-full px-3 py-1 font-semibold leading-none ${
                isVerified
                  ? 'bg-md-primary text-md-on-primary'
                  : 'bg-md-tertiary text-md-on-tertiary'
              }`}
            >
              {isVerified ? 'Verified Student' : 'Verification Pending'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};