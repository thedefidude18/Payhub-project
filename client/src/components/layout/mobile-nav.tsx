import { Link, useLocation } from "wouter";
import { 
  Home, 
  FileText, 
  Upload, 
  BarChart3, 
  Settings,
  User,
  Shield
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [location] = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const getNavItems = () => {
    const baseItems = [
      {
        href: "/",
        icon: Home,
        label: "Dashboard",
        active: location === "/" || location === "/dashboard"
      }
    ];

    if (user.role === 'admin') {
      return [
        ...baseItems,
        {
          href: "/admin",
          icon: Shield,
          label: "Admin",
          active: location.startsWith("/admin")
        },
        {
          href: "/admin/users",
          icon: User,
          label: "Users",
          active: location === "/admin/users"
        },
        {
          href: "/admin/stats",
          icon: BarChart3,
          label: "Stats",
          active: location === "/admin/stats"
        }
      ];
    }

    if (user.role === 'freelancer' || user.role === 'superfreelancer') {
      return [
        ...baseItems,
        {
          href: "/freelancer/projects",
          icon: FileText,
          label: "Projects",
          active: location.startsWith("/freelancer/projects")
        },
        {
          href: "/freelancer/upload",
          icon: Upload,
          label: "Upload",
          active: location === "/freelancer/upload"
        },
        {
          href: "/freelancer/analytics",
          icon: BarChart3,
          label: "Analytics",
          active: location === "/freelancer/analytics"
        },
        {
          href: "/freelancer/settings",
          icon: Settings,
          label: "Settings",
          active: location === "/freelancer/settings"
        }
      ];
    }

    // Client navigation
    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4 h-16">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex flex-col items-center justify-center h-full space-y-1 transition-colors",
                item.active 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-400 hover:text-gray-600"
              )}>
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </div>
  );
}