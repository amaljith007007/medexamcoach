import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  subscriptionTier: text("subscription_tier").notNull().default("free"), // 'free' or 'premium'
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  questionText: text("question_text").notNull(),
  questionImage: text("question_image"), // URL or path to question image
  options: jsonb("options").notNull(), // Array of 5 option strings
  correctAnswer: integer("correct_answer").notNull(), // 0-4 index
  explanation: text("explanation").notNull(),
  isHighYield: boolean("is_high_yield").notNull().default(false), // true for previous years' questions
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  questionId: varchar("question_id").notNull().references(() => questions.id),
  selectedAnswer: integer("selected_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeSpent: integer("time_spent"), // seconds
  answeredAt: timestamp("answered_at").defaultNow(),
});

export const mockExams = pgTable("mock_exams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  questionIds: jsonb("question_ids").notNull(), // Array of question IDs
  timeLimit: integer("time_limit").notNull(), // minutes
  status: text("status").notNull().default("pending"), // 'pending', 'in_progress', 'completed'
  score: integer("score"),
  totalQuestions: integer("total_questions").notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mockExamAnswers = pgTable("mock_exam_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mockExamId: varchar("mock_exam_id").notNull().references(() => mockExams.id),
  questionId: varchar("question_id").notNull().references(() => questions.id),
  selectedAnswer: integer("selected_answer"),
  isCorrect: boolean("is_correct"),
  timeSpent: integer("time_spent"),
});

export const mockExamTemplates = pgTable("mock_exam_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  categoryDistribution: jsonb("category_distribution").notNull(), // { categoryId: questionCount }
  totalQuestions: integer("total_questions").notNull(),
  timeLimit: integer("time_limit").notNull(), // minutes
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const appSettings = pgTable("app_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  appName: text("app_name").notNull().default("MedExam Pro"),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#3b82f6"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  categoryId: true,
  questionText: true,
  questionImage: true,
  options: true,
  correctAnswer: true,
  explanation: true,
  isHighYield: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  questionId: true,
  selectedAnswer: true,
  isCorrect: true,
  timeSpent: true,
});

export const insertMockExamSchema = createInsertSchema(mockExams).pick({
  userId: true,
  name: true,
  questionIds: true,
  timeLimit: true,
  totalQuestions: true,
});

export const insertMockExamTemplateSchema = createInsertSchema(mockExamTemplates).pick({
  name: true,
  description: true,
  categoryDistribution: true,
  totalQuestions: true,
  timeLimit: true,
  isActive: true,
});

export const insertAppSettingsSchema = createInsertSchema(appSettings).pick({
  appName: true,
  logoUrl: true,
  primaryColor: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertMockExam = z.infer<typeof insertMockExamSchema>;
export type MockExam = typeof mockExams.$inferSelect;
export type MockExamAnswer = typeof mockExamAnswers.$inferSelect;
export type InsertMockExamTemplate = z.infer<typeof insertMockExamTemplateSchema>;
export type MockExamTemplate = typeof mockExamTemplates.$inferSelect;
export type InsertAppSettings = z.infer<typeof insertAppSettingsSchema>;
export type AppSettings = typeof appSettings.$inferSelect;
