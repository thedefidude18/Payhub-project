import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Shield, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Database,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Activity
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: users = [] } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['/api/admin/projects'],
  });

  const { data: stats = {} } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  if (!user || user.role !== 'admin') {
    return <div>Access denied. Admin privileges required.</div>;
  }

  // Calculate platform metrics
  const totalUsers = Array.isArray(users) ? users.length : 0;
  const totalProjects = Array.isArray(projects) ? projects.length : 0;
  const activeFreelancers = Array.isArray(users) ? users.filter((u: any) => u.role === 'freelancer' || u.role === 'superfreelancer').length : 0;
  const pendingProjects = Array.isArray(projects) ? projects.filter((p: any) => p.status === 'pending').length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex">
      {/* Fixed Admin Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 z-10 hidden lg:flex flex-col bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 shadow-2xl">
        {/* Admin Header in Sidebar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center ring-2 ring-red-400/30">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                Welcome, {user?.firstName || 'Admin'}
              </h1>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Platform Administrator
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-shadow">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Platform Status in Sidebar */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-800/50 to-purple-800/20 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">System Status</span>
            <span className="text-sm font-bold text-green-400">Operational</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-300">
            <CheckCircle className="h-3 w-3" />
            All systems running smoothly
          </div>
        </div>
            
        <nav className="flex-1 px-4 space-y-2">
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Overview</p>
          </div>
          <Link href="/admin" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white group flex items-center px-4 py-3 text-sm font-medium rounded-xl shadow-lg">
            <BarChart3 className="text-white mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/admin/users" className="text-gray-300 hover:bg-gray-700/50 hover:text-white group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all">
            <Users className="text-gray-400 mr-3 h-5 w-5" />
            User Management
          </Link>
          <Link href="/admin/projects" className="text-gray-300 hover:bg-gray-700/50 hover:text-white group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all">
            <FileText className="text-gray-400 mr-3 h-5 w-5" />
            Project Oversight
          </Link>
          <Link href="/admin/analytics" className="text-gray-300 hover:bg-gray-700/50 hover:text-white group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all">
            <Activity className="text-gray-400 mr-3 h-5 w-5" />
            Analytics
          </Link>
          
          <div className="mt-8 mb-4">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</p>
          </div>
          <Link href="/admin/settings" className="text-gray-300 hover:bg-gray-700/50 hover:text-white group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all">
            <Settings className="text-gray-400 mr-3 h-5 w-5" />
            Platform Settings
          </Link>
          <Link href="/admin/database" className="text-gray-300 hover:bg-gray-700/50 hover:text-white group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all">
            <Database className="text-gray-400 mr-3 h-5 w-5" />
            Database Tools
          </Link>
        </nav>
        
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-2">System Status</h3>
            <div className="flex items-center gap-2 text-xs text-purple-100">
              <CheckCircle className="h-4 w-4" />
              All systems operational
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user?.firstName || 'Admin'}
                </h1>
                <p className="text-gray-400">
                  Platform overview and management dashboard
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-white">{totalUsers}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Active Freelancers</p>
                    <p className="text-2xl font-bold text-white">{activeFreelancers}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">+8% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Projects</p>
                    <p className="text-2xl font-bold text-white">{totalProjects}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">+15% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Platform Revenue</p>
                    <p className="text-2xl font-bold text-white">$12,450</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">+25% from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-white">New freelancer registered</p>
                      <p className="text-xs text-gray-400">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-white">Project approved</p>
                      <p className="text-xs text-gray-400">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-white">Payment processed</p>
                      <p className="text-xs text-gray-400">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-white">All systems operational</p>
                      <p className="text-xs text-gray-400">No issues detected</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}