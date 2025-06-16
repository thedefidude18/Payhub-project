import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, ArrowLeft, Clock, Check } from "lucide-react";
import type { Project, User } from "@shared/schema";

const CheckoutForm = ({ project }: { project: Project }) => {
  const { toast } = useToast();

  const handleNotifyInterest = () => {
    toast({
      title: "Interest Noted",
      description: "Payment system will be available soon with Paystack integration.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
        <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Payment System Coming Soon</h3>
        <p className="text-yellow-700 mb-4">
          We're integrating Paystack for secure payments. This feature will be available shortly.
        </p>
      </div>
      
      <Button 
        onClick={handleNotifyInterest}
        className="w-full" 
        size="lg"
        variant="outline"
      >
        <CreditCard className="h-4 w-4 mr-2" />
        Notify Me When Payment is Ready
      </Button>
    </div>
  );
};

export default function Checkout() {
  const { projectId } = useParams();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  const { data: freelancer } = useQuery<User>({
    queryKey: [`/api/users/subdomain/${window.location.hostname.split('.')[0]}`],
    enabled: !!window.location.hostname.includes('.'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600">The project you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (project.status !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Not Available</h2>
            <p className="text-gray-600 mb-4">
              This project needs to be approved before payment can be processed.
            </p>
            <Button 
              variant="outline"
              onClick={() => window.location.href = `/preview/${projectId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Preview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const commissionAmount = (parseFloat(project.price) * parseFloat(project.commissionRate)) / 100;
  const freelancerAmount = parseFloat(project.price) - commissionAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = `/preview/${projectId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Preview
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
              <p className="text-gray-600">Complete your payment for "{project.title}"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CheckoutForm project={project} />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  {freelancer && (
                    <p className="text-gray-600">by {freelancer.firstName} {freelancer.lastName}</p>
                  )}
                  <Badge variant="outline" className="mt-2">
                    {project.status}
                  </Badge>
                </div>

                {project.description && (
                  <div>
                    <h4 className="font-medium mb-1">Description</h4>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Project Price</span>
                    <span className="font-medium">${project.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Platform Fee ({project.commissionRate}%)</span>
                    <span>${commissionAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Goes to Freelancer</span>
                    <span>${freelancerAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${project.price}</span>
                </div>

                {/* What happens next */}
                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    What will happen when payment is ready?
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Payment will be processed securely with Paystack</li>
                    <li>• You'll receive an email confirmation</li>
                    <li>• Files will be delivered to your email</li>
                    <li>• Freelancer will be notified of payment</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}