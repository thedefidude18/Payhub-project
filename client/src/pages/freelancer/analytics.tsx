import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Play, MessageSquare, DollarSign, TrendingUp, Users, Clock, Download } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import StatsCard from "@/components/ui/stats-card";

export default function FreelancerAnalytics() {
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

  const totalEarnings = payments?.reduce((sum: number, payment: any) => sum + parseFloat(payment.netAmount), 0) || 0;
  const totalRevenue = payments?.reduce((sum: number, payment: any) => sum + parseFloat(payment.amount), 0) || 0;
  const totalCommission = payments?.reduce((sum: number, payment: any) => sum + parseFloat(payment.commission), 0) || 0;
  const conversionRate = projects?.length > 0 ? (payments?.length / projects.length) * 100 : 0;

  const recentProjects = projects?.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your performance and earnings</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Earnings"
            value={`$${totalEarnings.toFixed(2)}`}
            subtitle="After commission"
            icon={DollarSign}
            trend="+12%"
            trendUp={true}
          />
          
          <StatsCard
            title="Total Projects"
            value={projects?.length || 0}
            subtitle="All time"
            icon={Eye}
            trend="+5%"
            trendUp={true}
          />
          
          <StatsCard
            title="Conversion Rate"
            value={`${conversionRate.toFixed(1)}%`}
            subtitle="Preview to payment"
            icon={TrendingUp}
            trend="+8%"
            trendUp={true}
          />
          
          <StatsCard
            title="Commission Paid"
            value={`$${totalCommission.toFixed(2)}`}
            subtitle="Platform fees"
            icon={Users}
            trend="-2%"
            trendUp={false}
          />
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Gross Revenue</span>
                  <span className="font-semibold">${totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Commission</span>
                  <span className="font-semibold text-red-600">-${totalCommission.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-semibold">Net Earnings</span>
                  <span className="font-bold text-green-600">${totalEarnings.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Project Value</span>
                  <span className="font-semibold">
                    ${projects?.length > 0 ? (totalRevenue / projects.length).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Projects Completed</span>
                  <span className="font-semibold">
                    {projects?.filter((p: any) => p.status === 'delivered').length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Commission Rate</span>
                  <span className="font-semibold">{user.commissionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Project Performance</CardTitle>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No projects to analyze yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project: any) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-gray-500">{project.clientEmail}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span>0 views</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MessageSquare className="h-4 w-4" />
                          <span>0 comments</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        project.status === 'delivered' ? 'default' :
                        project.status === 'paid' ? 'secondary' :
                        project.status === 'approved' ? 'outline' : 'destructive'
                      }>
                        {project.status}
                      </Badge>
                      <p className="text-lg font-bold mt-1">${project.price}</p>
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
