import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Briefcase,
  MessageSquare,
  Settings,
  Users,
  Mail,
  ChevronLeft,
  Home,
  UserCircle,
  Shield,
  Blocks,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const menuItems = [
  { 
    group: 'Overview', 
    items: [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    ]
  },
  { 
    group: 'Content', 
    items: [
      { path: '/admin/projects', icon: FolderKanban, label: 'Projects' },
      { path: '/admin/blog', icon: FileText, label: 'Blog' },
      { path: '/admin/resume', icon: Briefcase, label: 'Resume' },
      { path: '/admin/content', icon: Blocks, label: 'Page Content' },
    ]
  },
  { 
    group: 'Communication', 
    items: [
      { path: '/admin/inbox', icon: MessageSquare, label: 'Inbox' },
      { path: '/admin/subscribers', icon: Mail, label: 'Subscribers' },
    ]
  },
  { 
    group: 'System', 
    items: [
      { path: '/admin/profile', icon: UserCircle, label: 'Profile' },
      { path: '/admin/users', icon: Users, label: 'User Management' },
      { path: '/admin/security', icon: Shield, label: 'Security' },
      { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ]
  },
];

export function AdminSidebar({ isOpen, onToggle, isMobile }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } ${isMobile ? 'relative' : 'hidden lg:block'}`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
        {isOpen && (
          <span className="text-lg font-bold text-sidebar-foreground slide-in">
            Porto Admin
          </span>
        )}
        <button
          onClick={onToggle}
          className={`p-1.5 hover:bg-sidebar-accent rounded-md transition-colors ${
            !isOpen && !isMobile ? 'mx-auto' : ''
          }`}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className={`w-5 h-5 text-sidebar-muted transition-transform ${
            !isOpen ? 'rotate-180' : ''
          }`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-4 overflow-y-auto h-[calc(100vh-3.5rem)]">
        {menuItems.map((group) => (
          <div key={group.group}>
            {isOpen && (
              <p className="px-3 py-2 text-xs font-semibold text-sidebar-muted uppercase tracking-wider">
                {group.group}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      } ${!isOpen ? 'justify-center' : ''}`
                    }
                    title={!isOpen ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span className="text-sm">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Back to Portfolio */}
        <div className="pt-4 border-t border-sidebar-border">
          <a
            href="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
              !isOpen ? 'justify-center' : ''
            }`}
            title={!isOpen ? 'Back to Portfolio' : undefined}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="text-sm">Back to Portfolio</span>}
          </a>
        </div>
      </nav>
    </aside>
  );
}
