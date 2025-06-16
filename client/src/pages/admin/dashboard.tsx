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
import Navbar from "@/components/layout/navbar";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pb-20 md:pb-0">
      <Navbar />
      
      <div className="flex">
        {/* Admin Sidebar */}
        <div className="hidden lg:flex lg:w-72 lg:flex-col">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Admin Panel</h2>
                  <p className="text-xs text-gray-400">Platform Management</p>
                </div>
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
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="px-6 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user.firstName || 'Admin'}
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
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{totalUsers}</div>
                  <p className="text-xs text-green-400">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Active Projects</CardTitle>
                  <FileText className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{totalProjects}</div>
                  <p className="text-xs text-green-400">
                    +5% from last week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">$45,231</div>
                  <p className="text-xs text-green-400">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Pending Reviews</CardTitle>
                  <Clock className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{pendingProjects}</div>
                  <p className="text-xs text-orange-400">
                    Requires attention
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Recent Platform Activity</CardTitle>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">New freelancer registration</h3>
                          <p className="text-sm text-gray-400">Sarah Chen joined the platform • 2 minutes ago</p>
                        </div>
                        <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                          New User
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">Payment processed</h3>
                          <p className="text-sm text-gray-400">$2,500 payment completed for Project #1247 • 5 minutes ago</p>
                        </div>
                        <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                          Payment
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">Project flagged for review</h3>
                          <p className="text-sm text-gray-400">Client reported issue with Project #1245 • 15 minutes ago</p>
                        </div>
                        <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30">
                          Review
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">New project created</h3>
                          <p className="text-sm text-gray-400">Marcus Rodriguez uploaded "Brand Identity Package" • 1 hour ago</p>
                        </div>
                        <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30">
                          Project
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Platform Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Server Load</span>
                        <span className="text-sm font-medium text-green-400">23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Database</span>
                        <span className="text-sm font-medium text-blue-400">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Storage</span>
                        <span className="text-sm font-medium text-yellow-400">67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Review Projects
                    </Button>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Platform Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Top Freelancers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-600 text-white text-xs">SC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">Sarah Chen</p>
                          <p className="text-xs text-gray-400">$12,500 revenue</p>
                        </div>
                        <Badge className="bg-yellow-600/20 text-yellow-400">Top</Badge>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-green-600 text-white text-xs">MR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">Marcus Rodriguez</p>
                          <p className="text-xs text-gray-400">$9,800 revenue</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-purple-600 text-white text-xs">ET</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">Emma Thompson</p>
                          <p className="text-xs text-gray-400">$8,200 revenue</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}