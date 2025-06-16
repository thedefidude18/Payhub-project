import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, MessageSquare, Check, CreditCard, Download, Clock, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import PreviewPlayer from "@/components/ui/preview-player";
import TimelineComments from "@/components/ui/timeline-comments";

export default function ClientPreview() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [clientInfo, setClientInfo] = useState({ email: "", name: "" });

  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  const { data: files } = useQuery({
    queryKey: [`/api/projects/${projectId}/files`],
    enabled: !!projectId,
  });

  const { data: comments } = useQuery({
    queryKey: [`/api/projects/${projectId}/comments`],
    enabled: !!projectId,
  });

  const { data: freelancer } = useQuery({
    queryKey: [`/api/users/subdomain/${window.location.hostname.split('.')[0]}`],
    enabled: !!window.location.hostname.includes('.'),
  });

  const approveProjectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PATCH", `/api/projects/${projectId}/status`, {
        status: "approved"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Approved",
        description: "You can now proceed to payment.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const trackViewMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/analytics", {
        projectId,
        event: "view",
        metadata: { page: "preview" },
      });
    },
  });

  useEffect(() => {
    if (projectId) {
      trackViewMutation.mutate();
    }
  }, [projectId]);

  useEffect(() => {
    // Prompt for client info if not provided
    if (project && !clientInfo.email) {
      const email = prompt("Please enter your email to continue:");
      const name = prompt("Please enter your name (optional):");
      
      if (email) {
        setClientInfo({ email, name: name || "" });
      }
    }
  }, [project, clientInfo.email]);

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

  const mainFile = files?.find((f: any) => !f.isPreview) || files?.[0];
  const canApprove = project.status === 'preview' && project.clientEmail === clientInfo.email;
  const isApproved = project.status === 'approved' || project.status === 'paid' || project.status === 'delivered';
  const isPaid = project.status === 'paid' || project.status === 'delivered';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {freelancer && (
                <Avatar>
                  <AvatarImage src={freelancer.profileImageUrl} />
                  <AvatarFallback>
                    {freelancer.firstName?.[0]}{freelancer.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-600">
                  by {freelancer?.firstName} {freelancer?.lastName}
                </p>
              </div>
            </div>
            <Badge variant={
              project.status === 'delivered' ? 'default' :
              project.status === 'paid' ? 'secondary' :
              project.status === 'approved' ? 'outline' : 'destructive'
            }>
              {project.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview Player */}
            {mainFile && (
              <Card>
                <CardContent className="p-0">
                  <PreviewPlayer file={mainFile} project={project} />
                </CardContent>
              </Card>
            )}

            {/* Project Description */}
            {project.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({comments?.length || 0})
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                >
                  {showComments ? "Hide" : "Show"} Comments
                </Button>
              </CardHeader>
              {showComments && (
                <CardContent>
                  <TimelineComments 
                    projectId={projectId!}
                    comments={comments || []}
                    clientEmail={clientInfo.email}
                    clientName={clientInfo.name}
                  />
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price</span>
                  <span className="text-2xl font-bold">${project.price}</span>
                </div>
                
                {project.deadline && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Client: {project.clientEmail}</span>
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tags:</p>
                    <div className="flex gap-2 flex-wrap">
                      {project.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {canApprove && (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => approveProjectMutation.mutate()}
                      disabled={approveProjectMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {approveProjectMutation.isPending ? "Approving..." : "Approve Preview"}
                    </Button>
                  )}

                  {isApproved && !isPaid && (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => window.location.href = `/checkout/${projectId}`}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Payment
                    </Button>
                  )}

                  {isPaid && (
                    <div className="text-center">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                        <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-green-800 font-medium">Payment Complete!</p>
                        <p className="text-green-700 text-sm">Files will be delivered via email</p>
                      </div>
                      
                      {project.status === 'delivered' && (
                        <Button variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download Files
                        </Button>
                      )}
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowComments(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Notice */}
            {!isApproved && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Play className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <h3 className="font-medium text-yellow-900 mb-1">Preview Mode</h3>
                    <p className="text-yellow-800 text-sm">
                      This is a preview version. The full files will be available after approval and payment.
                    </p>
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
