export const RelatedListings = () => {
  return (
    <div className="mt-12 pt-8 lg:pt-10">
      <h3 className="mb-6 text-subtitle font-medium tracking-tight text-md-on-background">Similar Items You Might Like</h3>
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        {/* Placeholder cards for future data */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="col-span-12 flex aspect-[4/3] animate-pulse items-center justify-center rounded-[24px] bg-md-surface-container-low sm:col-span-6 lg:col-span-3">
            <span className="text-sm font-medium text-md-on-background/70">More items coming</span>
          </div>
        ))}
      </div>
    </div>
  );
};