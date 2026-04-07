import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Package, Search, LogOut, Headphones, Users } from 'lucide-react';

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const agentLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/orders', icon: Package },
    { label: 'Track Order', path: '/track', icon: Search },
  ];

  const managerLinks = [
    { label: 'Floor Overview', path: '/manager', icon: Users },
    { label: 'All Orders', path: '/orders', icon: Package },
    { label: 'Track Order', path: '/track', icon: Search },
  ];

  const links = user?.role === 'manager' ? managerLinks : agentLinks;

  return (
    <div className="w-[240px] min-h-screen bg-sidebar flex flex-col">
      {/* Brand */}
      <div className="p-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Headphones className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        <div>
          <span className="text-sm font-bold text-sidebar-foreground tracking-tight block leading-tight">
            SmartCall CRM
          </span>
          <span className="text-[10px] text-sidebar-foreground/40 uppercase tracking-wider">
            {user?.role === 'manager' ? 'Manager' : 'Agent'} Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2 space-y-1">
        <p className="label-text px-3 mb-2">Navigation</p>
        {links.map((link) => {
          const active = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? 'bg-sidebar-accent text-sidebar-primary-foreground font-medium'
                  : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="px-3 py-2.5">
          <p className="text-xs font-medium text-sidebar-foreground">{user?.name}</p>
          <p className="text-[10px] text-sidebar-foreground/40 uppercase mono-text mt-0.5">
            {user?.agentId} • {user?.role}
          </p>
        </div>

        {showLogoutConfirm ? (
          <div className="px-3 py-2 space-y-2">
            <p className="text-xs text-sidebar-foreground/70">Confirm logout?</p>
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="flex-1 text-xs font-medium bg-destructive text-destructive-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-all"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 text-xs font-medium bg-sidebar-accent text-sidebar-foreground px-3 py-1.5 rounded-md hover:opacity-80 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default AppSidebar;
