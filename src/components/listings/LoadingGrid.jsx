export const LoadingGrid = () => {
  // Create an array of 8 empty slots to render 8 skeleton cards
  const skeletons = Array(8).fill(null);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {skeletons.map((_, index) => (
        <div key={index} className="flex animate-pulse flex-col overflow-hidden rounded-[24px] bg-md-surface-container shadow-md-sm">
          {/* Image Skeleton */}
          <div className="aspect-[4/3] bg-md-surface-container-low"></div>
          
          {/* Details Skeleton */}
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="h-5 w-3/4 rounded-full bg-md-surface-container-low"></div>
            <div className="h-6 w-1/3 rounded-full bg-md-surface-container-low"></div>
            
            <div className="mt-auto flex justify-between border-t border-md-outline/20 pt-4">
              <div className="h-4 w-1/4 rounded-full bg-md-surface-container-low"></div>
              <div className="h-4 w-1/4 rounded-full bg-md-surface-container-low"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};