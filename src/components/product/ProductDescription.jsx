export const ProductDescription = ({ description }) => {
  return (
    <div className="mb-8 rounded-[24px] bg-md-surface-container-low p-5 shadow-md-sm sm:p-6">
      <h3 className="mb-3 border-b border-md-outline/35 pb-2 text-label text-md-on-background">Description</h3>
      <p className="whitespace-pre-line text-body text-md-on-background/80">{description}</p>
    </div>
  );
};