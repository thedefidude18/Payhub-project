import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Play, Menu, User, Settings, LogOut, Crown, BarChart3, Upload, FileText, Home } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/freelancer", icon: Home, roles: ["freelancer", "superfreelancer"] },
    { name: "Projects", href: "/freelancer/projects", icon: FileText, roles: ["freelancer", "superfreelancer"] },
    { name: "Upload", href: "/freelancer/upload", icon: Upload, roles: ["freelancer", "superfreelancer"] },
    { name: "Analytics", href: "/freelancer/analytics", icon: BarChart3, roles: ["freelancer", "superfreelancer"] },
    { name: "Admin", href: "/admin", icon: Settings, roles: ["admin"] },
  ];

  const userNavigation = [
    { name: "Settings", href: "/freelancer/settings", icon: Settings },
    { name: "Sign out", href: "/api/logout", icon: LogOut },
  ];

  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(user?.role || "")
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-primary rounded-lg p-2 mr-3">
                <Play className="text-white h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-gray-900">PayHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                {filteredNavigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={location === item.href ? "default" : "ghost"}
                      className="flex items-center gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profileImageUrl} />
                          <AvatarFallback>
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {user?.firstName || user?.email}
                          </span>
                          {user?.role === 'superfreelancer' && (
                            <Badge className="bg-yellow-500 text-white text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Super
                            </Badge>
                          )}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5 text-sm text-gray-500">
                        Signed in as {user?.email}
                      </div>
                      <DropdownMenuSeparator />
                      {userNavigation.map((item) => (
                        <DropdownMenuItem key={item.name} asChild>
                          <a href={item.href} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            {item.name}
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <div className="py-6">
                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.profileImageUrl} />
                            <AvatarFallback>
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user?.firstName || user?.email}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                            {user?.role === 'superfreelancer' && (
                              <Badge className="bg-yellow-500 text-white text-xs mt-1">
                                <Crown className="h-3 w-3 mr-1" />
                                Super
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-2 mb-6">
                          {filteredNavigation.map((item) => (
                            <Link key={item.name} href={item.href}>
                              <Button
                                variant={location === item.href ? "default" : "ghost"}
                                className="w-full justify-start gap-2"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                              </Button>
                            </Link>
                          ))}
                        </div>

                        {/* User Menu */}
                        <div className="space-y-2 border-t pt-6">
                          {userNavigation.map((item) => (
                            <a key={item.name} href={item.href}>
                              <Button
                                variant="ghost"
                                className="w-full justify-start gap-2"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                              </Button>
                            </a>
                          ))}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/api/login" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </a>
                <Button>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
