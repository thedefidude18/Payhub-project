import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  FileText, 
  Upload, 
  BarChart3, 
  Settings, 
  Users,
  Crown,
  MessageSquare,
  CreditCard,
  Bell
} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const freelancerNavigation = [
    { name: "Dashboard", href: "/freelancer", icon: Home },
    { name: "Projects", href: "/freelancer/projects", icon: FileText },
    { name: "Upload", href: "/freelancer/upload", icon: Upload },
    { name: "Analytics", href: "/freelancer/analytics", icon: BarChart3 },
    { name: "Messages", href: "/freelancer/messages", icon: MessageSquare },
    { name: "Settings", href: "/freelancer/settings", icon: Settings },
  ];

  const adminNavigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Projects", href: "/admin/projects", icon: FileText },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const navigation = user?.role === 'admin' ? adminNavigation : freelancerNavigation;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              {user?.role === 'superfreelancer' && (
                <Badge className="bg-yellow-500 text-white text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Super
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={location === item.href ? "default" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        {user?.role === 'superfreelancer' && (
          <>
            <Separator className="my-6" />
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-900">SuperFreelancer</span>
              </div>
              <p className="text-xs text-yellow-800">
                You have access to premium features and reduced commission rates.
              </p>
            </div>
          </>
        )}

        <Separator className="my-6" />

        {/* Quick Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Commission Rate</span>
            <span className="text-sm font-medium">{user?.commissionRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Earnings</span>
            <span className="text-sm font-medium">${user?.totalEarnings}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
