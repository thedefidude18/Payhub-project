import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case 'admin':
          setLocation('/admin');
          break;
        case 'freelancer':
        case 'superfreelancer':
          setLocation('/freelancer');
          break;
        default:
          // Client or other roles stay on main dashboard
          break;
      }
    }
  }, [user, setLocation]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome to PayHub, {user.firstName || user.email}!
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700 mb-4">
            You are logged in as: <span className="font-semibold">{user.role}</span>
          </p>
          
          <div className="space-y-2">
            {user.role === 'admin' && (
              <p className="text-sm text-blue-600">
                You have admin privileges. You should be redirected to the admin dashboard.
              </p>
            )}
            {(user.role === 'freelancer' || user.role === 'superfreelancer') && (
              <p className="text-sm text-green-600">
                You have freelancer access. You should be redirected to the freelancer dashboard.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
