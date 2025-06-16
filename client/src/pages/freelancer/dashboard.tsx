import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  Eye,
  Plus,
  Crown,
  Settings,
  LogOut
} from "lucide-react";

export default function FreelancerDashboard() {
  const { user } = useAuth();

  const { data: projects = [] } = useQuery({
    queryKey: ['/api/projects'],
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  // Calculate stats with safe array handling
  const totalProjects = Array.isArray(projects) ? projects.length : 0;
  const recentProjects = Array.isArray(projects) ? projects.slice(0, 3) : [];
  const totalEarnings = Array.isArray(projects) ? projects.reduce((sum: number, p: any) => sum + (p.price || 0), 0) : 0;
  const completedProjects = Array.isArray(projects) ? projects.filter((p: any) => p.status === 'delivered' || p.status === 'paid').length : 0;
  const pendingProjects = Array.isArray(projects) ? projects.filter((p: any) => p.status === 'pending' || p.status === 'in_review').length : 0;

  const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 75;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 z-10 hidden lg:flex flex-col bg-white shadow-xl border-r border-gray-200">
        {/* Header in Sidebar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-blue-200">
              <AvatarImage src={user.profileImageUrl || ""} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-red-500 text-white text-lg font-bold">
                {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Hi {user.firstName || user.email?.split('@')[0]}!
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Visual Designer
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-shadow">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress in Sidebar */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Task Progress</span>
            <span className="text-sm font-bold text-blue-600">{completionRate.toFixed(0)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">Great work! Keep it up</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">WORKSPACE</p>
          </div>
          <div className="space-y-2">
            <Link href="/freelancer" className="bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-l-4 border-red-500 group flex items-center px-4 py-3 text-sm font-medium rounded-r-lg transition-all hover:shadow-sm">
              <Eye className="text-red-500 mr-3 h-5 w-5" />
              My Tasks
            </Link>
            <Link href="/freelancer/projects" className="text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900 group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all">
              <MessageSquare className="text-gray-400 mr-3 h-5 w-5" />
              Inbox
              <Badge className="ml-auto bg-red-500 text-white text-xs">3</Badge>
            </Link>
            <Link href="/freelancer/upload" className="text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900 group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all">
              <FileText className="text-gray-400 mr-3 h-5 w-5" />
              Projects
            </Link>
            <Link href="/freelancer/analytics" className="text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900 group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all">
              <TrendingUp className="text-gray-400 mr-3 h-5 w-5" />
              Analytics
            </Link>
            <Link href="/freelancer/settings" className="text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900 group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all">
              <Settings className="text-gray-400 mr-3 h-5 w-5" />
              Settings
            </Link>
          </div>

          <div className="mt-8">
            <div className="mb-4">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">RECENT PROJECTS</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-3 h-3 bg-orange-400 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-sm text-gray-600 truncate">Banking App Design</span>
              </div>
              <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-sm text-gray-600 truncate">E-commerce Platform</span>
              </div>
              <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-sm text-gray-600 truncate">Brand Identity</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer with logout */}
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            className="w-full text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors"
            onClick={() => window.location.href = '/api/logout'}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-80">
        <div className="h-screen overflow-y-auto">
          <div className="px-6 py-8">
            {/* Today's Schedule Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Today's Schedule</h2>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <Link href="/freelancer/upload">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white border-0 relative overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">RGD for New Banking Mobile App</h3>
                      <div className="flex -space-x-2 mb-4">
                        <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30"></div>
                        <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30"></div>
                        <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30"></div>
                      </div>
                      <Button variant="secondary" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        View Project
                      </Button>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full"></div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-0 relative overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Create Signup Page</h3>
                      <div className="flex -space-x-2 mb-4">
                        <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30"></div>
                        <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30"></div>
                        <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30"></div>
                      </div>
                      <Button variant="secondary" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        Continue Work
                      </Button>
                    </div>
                    <div className="text-4xl">👋</div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full"></div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</div>
                  <p className="text-xs text-green-600 font-medium">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
                  <FileText className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{totalProjects}</div>
                  <p className="text-xs text-blue-600 font-medium">
                    +5 new this week
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{completedProjects}</div>
                  <p className="text-xs text-purple-600 font-medium">
                    {completionRate.toFixed(0)}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Messages</CardTitle>
                  <MessageSquare className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <p className="text-xs text-orange-600 font-medium">
                    3 unread messages
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900">Monthly Tasks</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-gray-300">Archive</Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">+ New</Button>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <Button variant="ghost" size="sm" className="text-blue-600 border-b-2 border-blue-600 rounded-none pb-2">
                        Active Tasks
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                        Completed
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProjects.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                          <p className="text-gray-500 mb-6">Start by creating your first project to showcase your work</p>
                          <Link href="/freelancer/upload">
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                              <Plus className="h-4 w-4 mr-2" />
                              Create Your First Project
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">Uber App Redesign</h3>
                              <p className="text-sm text-gray-500">App Design and Upgrades with new features • In Progress 14 days</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-2">
                                <div className="w-7 h-7 bg-pink-500 rounded-full border-2 border-white"></div>
                                <div className="w-7 h-7 bg-blue-500 rounded-full border-2 border-white"></div>
                                <div className="w-7 h-7 bg-green-500 rounded-full border-2 border-white"></div>
                              </div>
                              <Badge className="bg-green-100 text-green-700">On Track</Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <MessageSquare className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">Facebook Ads Campaign</h3>
                              <p className="text-sm text-gray-500">Research Pro Comp for CreativeCloud • Last worked 5 days ago</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-2">
                                <div className="w-7 h-7 bg-orange-500 rounded-full border-2 border-white"></div>
                                <div className="w-7 h-7 bg-purple-500 rounded-full border-2 border-white"></div>
                              </div>
                              <Badge className="bg-yellow-100 text-yellow-700">Review</Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-green-600 font-bold text-lg">P</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">Payoneer Dashboard</h3>
                              <p className="text-sm text-gray-500">Payment Dashboard Design • Due in 3 days</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-2">
                                <div className="w-7 h-7 bg-teal-500 rounded-full border-2 border-white"></div>
                                <div className="w-7 h-7 bg-yellow-500 rounded-full border-2 border-white"></div>
                              </div>
                              <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-900">Client Call</CardTitle>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">+ Invite</Button>
                    </div>
                    <p className="text-sm text-gray-500">30 minute discovery session</p>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-xl">
                      <p className="text-xs mb-2 opacity-90">Project Discovery Call</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1">
                            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                          </div>
                          <span className="text-lg font-bold">28:35</span>
                        </div>
                        <div className="flex gap-2">
                          <TrendingUp className="h-5 w-5" />
                          <MessageSquare className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">Project Stats</CardTitle>
                    <p className="text-sm text-gray-500">Current month overview</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completed</span>
                        <span className="text-2xl font-bold text-green-600">{completedProjects}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">In Progress</span>
                        <span className="text-2xl font-bold text-blue-600">{pendingProjects}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Team Members</span>
                        <div className="flex -space-x-2">
                          <div className="w-7 h-7 bg-pink-500 rounded-full border-2 border-white"></div>
                          <div className="w-7 h-7 bg-blue-500 rounded-full border-2 border-white"></div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Success Rate</span>
                          <span className="font-bold text-gray-900">{completionRate.toFixed(0)}%</span>
                        </div>
                        <Progress value={completionRate} className="mt-2 h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/freelancer/upload" className="block">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                    </Link>
                    <Link href="/freelancer/projects" className="block">
                      <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View All Projects
                      </Button>
                    </Link>
                    <Link href="/freelancer/analytics" className="block">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                    </Link>
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