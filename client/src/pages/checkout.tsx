import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Shield, ArrowLeft, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ project }: { project: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/preview/${project.id}?payment=success`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <PaymentElement />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!stripe || !elements || isProcessing}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {isProcessing ? "Processing..." : `Pay $${project.price}`}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");

  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  const { data: freelancer } = useQuery({
    queryKey: [`/api/users/subdomain/${window.location.hostname.split('.')[0]}`],
    enabled: !!window.location.hostname.includes('.'),
  });

  const createPaymentIntentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        projectId,
        amount: parseFloat(project.price),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (project && project.status === 'approved') {
      createPaymentIntentMutation.mutate();
    }
  }, [project]);

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

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Setting up payment...</p>
        </div>
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
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm project={project} />
                </Elements>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-900">Secure Payment</h3>
                    <p className="text-blue-800 text-sm">
                      Your payment is processed securely by Stripe. We never store your card information.
                    </p>
                  </div>
                </div>
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
                    What happens next?
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Payment is processed securely</li>
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
