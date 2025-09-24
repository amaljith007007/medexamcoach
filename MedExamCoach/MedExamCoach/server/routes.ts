import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertQuestionSchema, insertAppSettingsSchema } from "@shared/schema";

// Simple admin middleware - checks if user is admin
const requireAdmin = (req: any, res: any, next: any) => {
  // In development mode only, allow x-admin-access header
  if (process.env.NODE_ENV === 'development' && req.headers['x-admin-access'] === 'true') {
    return next();
  }
  
  // In production, this should validate actual user session and role
  // For now, return 403 for any production access
  return res.status(403).json({ 
    message: 'Admin access requires proper authentication. This is a demo - admin features are only available in development mode.' 
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Public API routes (non-admin)
  
  // Get questions for practice (public endpoint)
  app.get('/api/questions', async (req, res) => {
    try {
      const { categories } = req.query;
      let questions;
      
      if (!categories || categories === 'all') {
        // Get all questions
        questions = await storage.getQuestions();
      } else {
        // Get questions for specific categories
        const categoryArray = Array.isArray(categories) ? categories : [categories];
        const allQuestions = await storage.getQuestions();
        questions = allQuestions.filter(q => categoryArray.includes(q.categoryId));
      }
      
      // Include category information
      const categories_data = await storage.getCategories();
      const questionsWithCategories = questions.map(q => ({
        ...q,
        category: categories_data.find(c => c.id === q.categoryId)
      }));
      
      res.json(questionsWithCategories);
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ message: 'Failed to fetch questions' });
    }
  });

  // Get categories (public endpoint) 
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  // Admin category management routes
  app.get('/api/admin/categories', requireAdmin, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  app.post('/api/admin/categories', requireAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      console.error('Error creating category:', error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: 'Invalid category data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create category' });
      }
    }
  });

  app.put('/api/admin/categories/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      
      res.json(category);
    } catch (error: any) {
      console.error('Error updating category:', error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: 'Invalid category data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update category' });
      }
    }
  });

  app.delete('/api/admin/categories/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCategory(id);
      
      if (!deleted) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Failed to delete category' });
    }
  });

  // Admin question management routes
  app.get('/api/admin/questions', requireAdmin, async (req, res) => {
    try {
      const questions = await storage.getQuestions();
      res.json(questions);
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ message: 'Failed to fetch questions' });
    }
  });

  app.post('/api/admin/questions', requireAdmin, async (req, res) => {
    try {
      const validatedData = insertQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(validatedData);
      res.status(201).json(question);
    } catch (error: any) {
      console.error('Error creating question:', error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: 'Invalid question data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create question' });
      }
    }
  });

  app.post('/api/admin/questions/bulk', requireAdmin, async (req, res) => {
    try {
      const { questions } = req.body;
      if (!Array.isArray(questions)) {
        res.status(400).json({ message: 'Questions must be an array' });
        return;
      }

      const results = { created: [], failed: [] };
      
      for (let i = 0; i < questions.length; i++) {
        try {
          const validatedData = insertQuestionSchema.parse(questions[i]);
          const question = await storage.createQuestion(validatedData);
          results.created.push({ index: i, question });
        } catch (error: any) {
          results.failed.push({ 
            index: i, 
            error: error.name === 'ZodError' ? error.errors : error.message,
            data: questions[i] 
          });
        }
      }

      if (results.failed.length > 0) {
        res.status(207).json({ // 207 Multi-Status
          message: `Created ${results.created.length} questions, ${results.failed.length} failed`,
          ...results
        });
      } else {
        res.status(201).json({
          message: `Successfully created ${results.created.length} questions`,
          created: results.created.map(r => r.question)
        });
      }
    } catch (error: any) {
      console.error('Error creating questions in bulk:', error);
      res.status(500).json({ message: 'Failed to process bulk questions' });
    }
  });

  app.put('/api/admin/questions/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertQuestionSchema.parse(req.body);
      const question = await storage.updateQuestion(id, validatedData);
      
      if (!question) {
        res.status(404).json({ message: 'Question not found' });
        return;
      }
      
      res.json(question);
    } catch (error: any) {
      console.error('Error updating question:', error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: 'Invalid question data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update question' });
      }
    }
  });

  app.delete('/api/admin/questions/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteQuestion(id);
      
      if (!deleted) {
        res.status(404).json({ message: 'Question not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: 'Failed to delete question' });
    }
  });

  // Admin settings management routes
  app.get('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getAppSettings();
      if (!settings) {
        // Return default settings if none exist
        const defaultSettings = {
          id: "default",
          appName: "MedExam Pro",
          logoUrl: null,
          primaryColor: "#3b82f6",
          updatedAt: new Date()
        };
        res.json(defaultSettings);
      } else {
        res.json(settings);
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ message: 'Failed to fetch settings' });
    }
  });

  app.put('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const validatedData = insertAppSettingsSchema.parse(req.body);
      const settings = await storage.updateAppSettings(validatedData);
      res.json(settings);
    } catch (error: any) {
      console.error('Error updating settings:', error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: 'Invalid settings data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update settings' });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
