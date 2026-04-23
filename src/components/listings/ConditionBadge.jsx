import { Badge } from '../ui/Badge';

export const ConditionBadge = ({ condition }) => {
  return (
    <Badge variant="secondary" className="shadow-md-sm">
      {condition}
    </Badge>
  );
};