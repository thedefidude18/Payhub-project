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
  Crown
} from "lucide-react";
import Navbar from "@/components/layout/navbar";

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
  const recentProjects = Array.isArray(projects) ? projects.slice(0, 5) : [];
  const totalEarnings = Array.isArray(projects) ? projects.reduce((sum: number, p: any) => sum + (p.price || 0), 0) : 0;
  const completedProjects = Array.isArray(projects) ? projects.filter((p: any) => p.status === 'delivered' || p.status === 'paid').length : 0;
  const pendingProjects = Array.isArray(projects) ? projects.filter((p: any) => p.status === 'pending' || p.status === 'in_review').length : 0;
  const approvedProjects = Array.isArray(projects) ? projects.filter((p: any) => p.status === 'approved').length : 0;

  // Calculate completion rate
  const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pb-20 md:pb-0">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
            <div className="flex items-center flex-shrink-0 px-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profileImageUrl || ""} />
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-red-500 text-white">
                  {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.firstName || user.email?.split('@')[0]}</p>
                <p className="text-xs text-gray-500">Visual Designer</p>
              </div>
            </div>
            
            <nav className="mt-8 flex-1 px-2 space-y-1">
              <div className="mb-4">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</p>
              </div>
              <Link href="/freelancer" className="bg-red-50 text-red-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <Eye className="text-red-500 mr-3 h-5 w-5" />
                My Tasks
              </Link>
              <Link href="/freelancer/projects" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <MessageSquare className="text-gray-400 mr-3 h-5 w-5" />
                Inbox
                <Badge className="ml-auto bg-red-500 text-white">3</Badge>
              </Link>
              <Link href="/freelancer/upload" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <FileText className="text-gray-400 mr-3 h-5 w-5" />
                Projects
              </Link>
              <Link href="/freelancer/analytics" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <TrendingUp className="text-gray-400 mr-3 h-5 w-5" />
                Standups
              </Link>
              <Link href="/freelancer/settings" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <MessageSquare className="text-gray-400 mr-3 h-5 w-5" />
                Meetings
              </Link>
            </nav>
            
            <div className="px-2">
              <div className="mb-4">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Favorites</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center px-2 py-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Redwhale Design</span>
                </div>
                <div className="flex items-center px-2 py-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Mobile App Mock...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Hi {user.firstName || user.email?.split('@')[0]}!
                  </h1>
                  <div className="flex items-center mt-2">
                    <Progress value={completionRate} className="w-32 h-2" />
                    <span className="ml-3 text-sm text-gray-600">{completionRate.toFixed(0)}% task completed</span>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white border-0 relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">RGD for New Banking Mobile App</h3>
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-white/20 text-white border-white/30">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-0 relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Create Signup Page</h3>
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">👋</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalEarnings.toFixed(0)}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projects</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Unread messages
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Monthly Tasks</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Archive</Button>
                        <Button size="sm" className="bg-blue-600">+ New</Button>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <Button variant="ghost" size="sm" className="text-blue-600 border-b-2 border-blue-600">
                        Active Tasks
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        Completed
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProjects.length === 0 ? (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">No projects yet</p>
                          <Link href="/freelancer/upload">
                            <Button>Create Your First Project</Button>
                          </Link>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">Uber</h3>
                              <p className="text-sm text-gray-500">App Design and Upgrades with new features • In Progress 14 days</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 bg-pink-500 rounded-full"></div>
                                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">Facebook Ads</h3>
                              <p className="text-sm text-gray-500">Research Pro Comp for CreativeCloud • Last worked 5 days ago</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                                <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <span className="text-purple-600 font-bold">P</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">Payoneer</h3>
                              <p className="text-sm text-gray-500">Payment Dashboard Design • Due in 3 days</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 bg-teal-500 rounded-full"></div>
                                <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                                <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h4 className="font-medium text-gray-900 mb-3">Tomorrow</h4>
                            <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 font-bold">up</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">Upwork</h3>
                                <p className="text-sm text-gray-500">UpWorking • Viewed Just Now • Assigned 32 min ago</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                  <div className="w-6 h-6 bg-cyan-500 rounded-full"></div>
                                  <div className="w-6 h-6 bg-rose-500 rounded-full"></div>
                                  <div className="w-6 h-6 bg-amber-500 rounded-full"></div>
                                </div>
                              </div>
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
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">30 minute call with Client</CardTitle>
                    <Button size="sm" className="bg-blue-600 text-xs">+ Invite</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg">
                      <p className="text-xs mb-2">Project Discovery Call</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1">
                            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">28:35</span>
                        </div>
                        <div className="flex gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <MessageSquare className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Design Project</CardTitle>
                    <p className="text-sm text-gray-500">In Progress</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span className="font-bold text-2xl">{completedProjects}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>In Progress</span>
                        <span className="font-bold text-2xl">{pendingProjects}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Team members</span>
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 bg-pink-500 rounded-full"></div>
                          <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>New Task</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Task Title" 
                        className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button size="sm" className="w-full bg-blue-600">Create new</Button>
                      <div className="text-sm text-gray-500 mb-2">Add Collaborators:</div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">A</div>
                        <span className="text-sm">Angelo X</span>
                        <button className="ml-auto text-red-500 text-xs">✕</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">C</div>
                        <span className="text-sm">Chris</span>
                        <button className="ml-auto text-red-500 text-xs">✕</button>
                      </div>
                      <Button variant="outline" size="sm" className="w-full border-dashed">
                        <Plus className="h-4 w-4 mr-2" />
                        Add more
                      </Button>
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