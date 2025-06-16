import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Reply, Clock, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  timestamp: z.number().optional(),
  position: z.object({
    x: z.number().optional(),
    y: z.number().optional(),
    page: z.number().optional(),
  }).optional(),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface TimelineCommentsProps {
  projectId: string;
  comments: any[];
  clientEmail: string;
  clientName?: string;
  fileId?: string;
  currentTime?: number;
}

export default function TimelineComments({
  projectId,
  comments,
  clientEmail,
  clientName,
  fileId,
  currentTime,
}: TimelineCommentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      timestamp: currentTime,
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: CommentFormData & { parentId?: string }) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/comments`, {
        ...data,
        fileId,
        authorEmail: clientEmail,
        authorName: clientName,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/comments`] });
      form.reset();
      setShowReplyForm(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CommentFormData) => {
    createCommentMutation.mutate(data);
  };

  const onReply = (parentId: string, content: string) => {
    createCommentMutation.mutate({
      content,
      parentId,
    });
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const mainComments = comments.filter(comment => !comment.parentId);
  const getReplies = (commentId: string) => 
    comments.filter(comment => comment.parentId === commentId);

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder={
                          currentTime 
                            ? `Add a comment at ${formatTime(currentTime)}...`
                            : "Add a comment..."
                        }
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {currentTime && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Commenting at {formatTime(currentTime)}</span>
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={createCommentMutation.isPending}
                  size="sm"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {mainComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          mainComments.map((comment) => {
            const replies = getReplies(comment.id);
            
            return (
              <Card key={comment.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {comment.authorName?.[0] || comment.authorEmail[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          {comment.authorName || comment.authorEmail}
                        </span>
                        {comment.timestamp && (
                          <Badge variant="outline" className="text-xs">
                            {formatTime(comment.timestamp)}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {comment.isResolved && (
                          <Badge variant="secondary" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-3">{comment.content}</p>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowReplyForm(
                            showReplyForm === comment.id ? null : comment.id
                          )}
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>

                      {/* Reply Form */}
                      {showReplyForm === comment.id && (
                        <div className="mt-3 ml-4 border-l-2 border-gray-200 pl-4">
                          <ReplyForm
                            onSubmit={(content) => onReply(comment.id, content)}
                            onCancel={() => setShowReplyForm(null)}
                            isLoading={createCommentMutation.isPending}
                          />
                        </div>
                      )}

                      {/* Replies */}
                      {replies.length > 0 && (
                        <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4 space-y-3">
                          {replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {reply.authorName?.[0] || reply.authorEmail[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {reply.authorName || reply.authorEmail}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

function ReplyForm({ 
  onSubmit, 
  onCancel, 
  isLoading 
}: { 
  onSubmit: (content: string) => void; 
  onCancel: () => void; 
  isLoading: boolean; 
}) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        className="resize-none"
        rows={2}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={!content.trim() || isLoading}>
          {isLoading ? "Posting..." : "Reply"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
