
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
  SidebarGroup
} from '@/components/ui/sidebar';
import { Calendar, Book, CheckSquare, Home, PenSquare } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarComponent>
      <SidebarHeader className="flex items-center justify-between px-4 py-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Book className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold">StudyMate</span>
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
        <p>© 2023 StudyMate</p>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
