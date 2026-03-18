import { LayoutDashboard, Sparkles } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  activeItem: 'board' | 'ai';
  onItemClick: (item: 'board' | 'ai') => void;
}

export function AppSidebar({ activeItem, onItemClick }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-bold text-sm">T</span>
              </div>
              <span className="text-sm font-semibold text-foreground">TaskFlow</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onItemClick('board')}
                  isActive={activeItem === 'board'}
                  tooltip="Board"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Board</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onItemClick('ai')}
                  isActive={activeItem === 'ai'}
                  tooltip="AI Assistant"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI Assistant</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
