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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="pointer-events-none" tooltip="TaskFlow">
              <div className="flex items-center justify-center rounded bg-primary text-primary-foreground font-bold shrink-0 size-4 text-[10px] group-data-[collapsible=icon]:size-4">
                T
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
