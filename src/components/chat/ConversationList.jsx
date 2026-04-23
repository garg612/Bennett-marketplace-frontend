import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { ConversationItem } from './ConversationItem';

export const ConversationList = ({ conversations, activeChatId, onSelectChat }) => {
  return (
    // THE FIX: Removed 'hidden md:flex' so the parent page controls visibility!
    <div className="flex h-full w-full shrink-0 flex-col border-r border-md-outline/35 bg-md-surface-container">
      <div className="border-b border-md-outline/35 bg-md-surface-container p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-md-on-background/60" />
          <Input placeholder="        Search messages..." className="h-10 pl-10 pr-3 text-sm" />
        </div>
      </div>
      
      <div className="hide-scrollbar flex-1 overflow-y-auto bg-md-surface-container">
        {conversations.map((chat) => (
          <ConversationItem
            key={chat.id}
            chat={chat}
            isActive={activeChatId === chat.id}
            onClick={() => onSelectChat(chat.id)}
          />
        ))}
      </div>
    </div>
  );
};