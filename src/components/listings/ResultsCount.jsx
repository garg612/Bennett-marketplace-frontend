export const ResultsCount = ({ count }) => {
  return (
    <p className="text-sm text-md-on-background/75">
      Showing <span className="font-medium text-md-on-background">{count}</span> results
    </p>
  );
};