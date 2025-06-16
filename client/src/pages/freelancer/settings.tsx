import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Globe, Bell, CreditCard, Shield, Crown, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  subdomain: z.string().min(3, "Subdomain must be at least 3 characters"),
  bio: z.string().optional(),
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  projectUpdates: z.boolean(),
  paymentAlerts: z.boolean(),
  clientMessages: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type NotificationFormData = z.infer<typeof notificationSchema>;

export default function FreelancerSettings() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      subdomain: user?.subdomain || "",
      bio: "",
    },
  });

  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      projectUpdates: true,
      paymentAlerts: true,
      clientMessages: true,
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiRequest("PATCH", `/api/users/${user?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
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

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        subdomain: user.subdomain || "",
        bio: "",
      });
    }
  }, [user, profileForm]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onNotificationSubmit = (data: NotificationFormData) => {
    toast({
      title: "Success",
      description: "Notification preferences updated!",
    });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "subdomain", label: "Subdomain", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Account Settings
            {user.role === 'superfreelancer' && (
              <Badge className="bg-yellow-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Super
              </Badge>
            )}
          </h1>
          <p className="mt-2 text-gray-600">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium rounded-none first:rounded-t-lg last:rounded-b-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.profileImageUrl} />
                      <AvatarFallback className="text-lg">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
                      <p className="text-gray-500">{user.email}</p>
                      <Badge variant="secondary" className="mt-1">
                        {user.role}
                      </Badge>
                    </div>
                  </div>

                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter first name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" disabled {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell clients about yourself..."
                                className="resize-none"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={updateProfileMutation.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {activeTab === "subdomain" && (
              <Card>
                <CardHeader>
                  <CardTitle>Custom Subdomain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <FormLabel>Current Subdomain</FormLabel>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="font-mono text-sm">
                          {user.subdomain ? `${user.subdomain}.payhub.com` : "Not set"}
                        </p>
                      </div>
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="subdomain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subdomain</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input 
                                placeholder="your-name"
                                className="rounded-r-none"
                                {...field}
                              />
                              <div className="flex items-center px-3 bg-gray-50 border border-l-0 rounded-r-md text-sm text-gray-500">
                                .payhub.com
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Subdomain Guidelines</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Must be at least 3 characters long</li>
                        <li>• Can only contain letters, numbers, and hyphens</li>
                        <li>• Cannot start or end with a hyphen</li>
                        <li>• Must be unique across all users</li>
                      </ul>
                    </div>

                    <Button type="submit" form="profile-form">
                      <Save className="h-4 w-4 mr-2" />
                      Update Subdomain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...notificationForm}>
                    <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div>
                              <FormLabel>Email Notifications</FormLabel>
                              <p className="text-sm text-gray-500">Receive notifications via email</p>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={notificationForm.control}
                        name="projectUpdates"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div>
                              <FormLabel>Project Updates</FormLabel>
                              <p className="text-sm text-gray-500">Get notified when clients view or approve projects</p>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="paymentAlerts"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div>
                              <FormLabel>Payment Alerts</FormLabel>
                              <p className="text-sm text-gray-500">Get notified when payments are received</p>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="clientMessages"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div>
                              <FormLabel>Client Messages</FormLabel>
                              <p className="text-sm text-gray-500">Get notified when clients send messages</p>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {activeTab === "billing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormLabel>Commission Rate</FormLabel>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold">{user.commissionRate}%</p>
                          <p className="text-sm text-gray-500">Platform commission</p>
                        </div>
                      </div>
                      
                      <div>
                        <FormLabel>Total Earnings</FormLabel>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold">${user.totalEarnings}</p>
                          <p className="text-sm text-gray-500">After commission</p>
                        </div>
                      </div>
                    </div>

                    {user.role === 'superfreelancer' && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="h-5 w-5 text-yellow-600" />
                          <h4 className="font-medium text-yellow-900">SuperFreelancer Benefits</h4>
                        </div>
                        <ul className="text-sm text-yellow-800 space-y-1">
                          <li>• Reduced commission rates</li>
                          <li>• Priority listing in search results</li>
                          <li>• Advanced analytics access</li>
                          <li>• Beta feature access</li>
                        </ul>
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Payment Information</h4>
                      <p className="text-sm text-blue-800">
                        Payments are processed automatically and deposited to your linked account within 2-3 business days.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Account Security</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Your account is secured with Replit authentication. You can manage your security settings in your Replit account.
                      </p>
                      <Button variant="outline">
                        Manage Replit Account
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Enable two-factor authentication for additional security.
                      </p>
                      <Badge variant="secondary">Managed by Replit</Badge>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">API Access</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Generate API tokens for integrating with third-party services.
                      </p>
                      <Button variant="outline" disabled>
                        Generate API Token (Coming Soon)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
