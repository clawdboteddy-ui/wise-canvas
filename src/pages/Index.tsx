import { useState } from 'react';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const Index = () => {
  const [aiOpen, setAiOpen] = useState(false);

  const handleItemClick = (item: 'board' | 'ai') => {
    if (item === 'ai') {
      setAiOpen(prev => !prev);
    } else {
      setAiOpen(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-background">
        <AppSidebar activeItem={aiOpen ? 'ai' : 'board'} onItemClick={handleItemClick} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-0">
            <SidebarTrigger className="absolute top-4 left-2 z-10" />
          </header>
          <KanbanBoard aiOpen={aiOpen} onAiClose={() => setAiOpen(false)} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
