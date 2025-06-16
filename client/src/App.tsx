import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin/dashboard";
import FreelancerDashboard from "@/pages/freelancer/dashboard";
import FreelancerProjects from "@/pages/freelancer/projects";
import FreelancerUpload from "@/pages/freelancer/upload";
import FreelancerAnalytics from "@/pages/freelancer/analytics";
import FreelancerSettings from "@/pages/freelancer/settings";
import ClientPreview from "@/pages/client/preview";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/preview/:projectId" component={ClientPreview} />
          <Route path="/checkout/:projectId" component={Checkout} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          {user?.role === 'admin' && (
            <Route path="/admin" component={AdminDashboard} />
          )}
          {(user?.role === 'freelancer' || user?.role === 'superfreelancer') && (
            <>
              <Route path="/freelancer" component={FreelancerDashboard} />
              <Route path="/freelancer/projects" component={FreelancerProjects} />
              <Route path="/freelancer/upload" component={FreelancerUpload} />
              <Route path="/freelancer/analytics" component={FreelancerAnalytics} />
              <Route path="/freelancer/settings" component={FreelancerSettings} />
            </>
          )}
          <Route path="/preview/:projectId" component={ClientPreview} />
          <Route path="/checkout/:projectId" component={Checkout} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
