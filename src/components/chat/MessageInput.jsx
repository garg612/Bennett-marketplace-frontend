import { Send } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const MessageInput = ({ messageText, onMessageChange, onSendMessage }) => {
  return (
    <div className="shrink-0 border-t border-md-outline/35 bg-md-surface-container p-4">
      <form onSubmit={onSendMessage} className="flex gap-2">
        <Input 
          placeholder="Type a message..." 
          value={messageText}
          onChange={(e) => onMessageChange(e.target.value)}
          className="h-12 flex-1"
        />
        <Button type="submit" disabled={!messageText.trim()} className="shrink-0 px-3">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};