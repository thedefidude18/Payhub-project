import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertProjectSchema, insertFileSchema, insertCommentSchema } from "@shared/schema";
import { supabase } from "./supabaseClient";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Supabase Auth middleware
async function supabaseAuthMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    req.user = null;
    return next();
  }
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    req.user = null;
    return next();
  }
  req.user = data.user;
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(supabaseAuthMiddleware);

  // Auth middleware
  // await setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User routes
  app.get('/api/users/subdomain/:subdomain', async (req, res) => {
    try {
      const user = await storage.getUserBySubdomain(req.params.subdomain);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user by subdomain:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch('/api/users/:id/role', async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.id);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { role } = req.body;
      const user = await storage.updateUserRole(req.params.id, role);
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Project routes
  app.post('/api/projects', async (req: any, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        freelancerId: req.user.id,
      });

      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.get('/api/projects', async (req: any, res) => {
    try {
      const projects = await storage.getProjectsByFreelancer(req.user.id);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.patch('/api/projects/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      const project = await storage.updateProjectStatus(req.params.id, status);
      
      // Create analytics event
      await storage.createAnalyticsEvent({
        projectId: req.params.id,
        event: status === 'approved' ? 'approve' : 'status_change',
        metadata: { status },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json(project);
    } catch (error) {
      console.error("Error updating project status:", error);
      res.status(500).json({ message: "Failed to update project status" });
    }
  });

  // File routes
  app.post('/api/projects/:projectId/files', upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileData = insertFileSchema.parse({
        projectId: req.params.projectId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype.split('/')[0],
        fileSize: req.file.size,
        filePath: req.file.path,
        metadata: {
          mimetype: req.file.mimetype,
        },
      });

      const file = await storage.createFile(fileData);
      res.json(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.get('/api/projects/:projectId/files', async (req, res) => {
    try {
      const files = await storage.getFilesByProject(req.params.projectId);
      res.json(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  // Comment routes
  app.post('/api/projects/:projectId/comments', async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse({
        ...req.body,
        projectId: req.params.projectId,
      });

      const comment = await storage.createComment(commentData);
      
      // Create analytics event
      await storage.createAnalyticsEvent({
        projectId: req.params.projectId,
        event: 'comment',
        metadata: { commentId: comment.id },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.get('/api/projects/:projectId/comments', async (req, res) => {
    try {
      const comments = await storage.getCommentsByProject(req.params.projectId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Analytics routes
  app.post('/api/analytics', async (req, res) => {
    try {
      const analytics = await storage.createAnalyticsEvent({
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      res.json(analytics);
    } catch (error) {
      console.error("Error creating analytics event:", error);
      res.status(500).json({ message: "Failed to create analytics event" });
    }
  });

  app.get('/api/projects/:projectId/analytics', async (req, res) => {
    try {
      const analytics = await storage.getProjectAnalytics(req.params.projectId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Payment routes - TODO: Implement with Paystack later

  // Admin routes
  app.get('/api/admin/users', async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.id);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/stats', async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.id);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }

      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', async (req: any, res) => {
    try {
      if (req.user.id) {
        const currentUser = await storage.getUser(req.user.id);
        if (currentUser?.role !== 'admin') {
          return res.status(403).json({ message: "Admin access required" });
        }
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/projects', async (req: any, res) => {
    try {
      if (req.user.id) {
        const currentUser = await storage.getUser(req.user.id);
        if (currentUser?.role !== 'admin') {
          return res.status(403).json({ message: "Admin access required" });
        }
      }
      
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/admin/stats', async (req: any, res) => {
    try {
      if (req.user.id) {
        const currentUser = await storage.getUser(req.user.id);
        if (currentUser?.role !== 'admin') {
          return res.status(403).json({ message: "Admin access required" });
        }
      }
      
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
