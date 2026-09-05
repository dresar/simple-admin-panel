import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { Menu, LogOut, User, Bell } from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-card border-b border-border px-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-medium text-muted-foreground hidden sm:block">
          Admin Dashboard
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="p-2 hover:bg-muted rounded-md transition-colors relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-destructive/10 rounded-md transition-colors ml-2"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>
    </header>
  );
}
