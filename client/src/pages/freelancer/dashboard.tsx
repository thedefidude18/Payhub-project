import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, Eye, MessageSquare, Plus, Crown } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";

export default function FreelancerDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  const { data: projects } = useQuery({
    queryKey: ['/api/projects'],
    enabled: isAuthenticated && (user?.role === 'freelancer' || user?.role === 'superfreelancer'),
  });

  const { data: payments } = useQuery({
    queryKey: ['/api/payments'],
    enabled: isAuthenticated && (user?.role === 'freelancer' || user?.role === 'superfreelancer'),
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== 'freelancer' && user?.role !== 'superfreelancer'))) {
      toast({
        title: "Unauthorized",
        description: "Freelancer access required. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const recentProjects = projects?.slice(0, 5) || [];
  const totalEarnings = payments?.reduce((sum: number, payment: any) => sum + parseFloat(payment.netAmount), 0) || 0;
  const pendingProjects = projects?.filter((p: any) => p.status === 'preview' || p.status === 'draft').length || 0;
  const completedProjects = projects?.filter((p: any) => p.status === 'delivered').length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              Welcome back, {user.firstName || user.email}
              {user.role === 'superfreelancer' && (
                <Badge className="bg-yellow-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Super
                </Badge>
              )}
            </h1>
            <p className="mt-2 text-gray-600">Manage your projects and track your earnings</p>
          </div>
          <Link href="/freelancer/upload">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {completedProjects} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                After commission
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Projects</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingProjects}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
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

        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            <Link href="/freelancer/projects">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No projects yet</p>
                <Link href="/freelancer/upload">
                  <Button>Create Your First Project</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project: any) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-gray-500">{project.clientEmail}</p>
                      <p className="text-sm text-gray-500">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        project.status === 'delivered' ? 'default' :
                        project.status === 'paid' ? 'secondary' :
                        project.status === 'approved' ? 'outline' : 'destructive'
                      }>
                        {project.status}
                      </Badge>
                      <div className="text-right">
                        <p className="font-medium">${project.price}</p>
                        <p className="text-sm text-gray-500">{project.commissionRate}% commission</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
