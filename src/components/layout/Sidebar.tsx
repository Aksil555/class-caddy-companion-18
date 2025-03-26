
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { Calendar, Book, CheckSquare, Home, PenSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { state } = useSidebar();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarComponent>
      <SidebarHeader className="flex items-center justify-between px-4 py-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center">
            <img 
              src="/lovable-uploads/f39546c5-fcde-4a50-8808-cabcf60d661e.png" 
              alt="AksilFlow Logo" 
              className="w-6 h-6"
            />
          </div>
          <span className="text-xl font-semibold">AksilFlow</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink 
                  to="/" 
                  className={`flex items-center space-x-3 ${isActive('/') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-primary transition-colors`}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink 
                  to="/schedule" 
                  className={`flex items-center space-x-3 ${isActive('/schedule') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-primary transition-colors`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Schedule</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink 
                  to="/homework" 
                  className={`flex items-center space-x-3 ${isActive('/homework') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-primary transition-colors`}
                >
                  <CheckSquare className="w-5 h-5" />
                  <span>Homework</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink 
                  to="/notes" 
                  className={`flex items-center space-x-3 ${isActive('/notes') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-primary transition-colors`}
                >
                  <PenSquare className="w-5 h-5" />
                  <span>Notes</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-4 text-center text-xs text-muted-foreground">
        <p>© 2025 AksilFlow</p>
      </SidebarFooter>

      {/* Add a rail for easier toggling */}
      <SidebarRail />

      {/* Add expand button when sidebar is collapsed */}
      {state === "collapsed" && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-20">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full rounded-l-none border-l-0 shadow-md"
            onClick={() => {
              const toggleButton = document.querySelector('[data-sidebar="trigger"]');
              if (toggleButton) {
                (toggleButton as HTMLButtonElement).click();
              }
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </SidebarComponent>
  );
};

export default Sidebar;
