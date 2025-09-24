import { type User, type InsertUser, type Category, type InsertCategory, type Question, type InsertQuestion, type AppSettings, type InsertAppSettings } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category management
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: InsertCategory): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  // Question management
  getQuestions(): Promise<Question[]>;
  getQuestion(id: string): Promise<Question | undefined>;
  getQuestionsByCategory(categoryId: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  createQuestions(questions: InsertQuestion[]): Promise<Question[]>;
  updateQuestion(id: string, question: InsertQuestion): Promise<Question | undefined>;
  deleteQuestion(id: string): Promise<boolean>;
  
  // App settings management
  getAppSettings(): Promise<AppSettings | undefined>;
  updateAppSettings(settings: InsertAppSettings): Promise<AppSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private questions: Map<string, Question>;
  private appSettings: AppSettings | null = null;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.questions = new Map();
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample categories
    const cardiologyCategory = await this.createCategory({
      name: "Cardiology",
      description: "Heart and cardiovascular system questions"
    });

    const neurologyCategory = await this.createCategory({
      name: "Neurology", 
      description: "Brain and nervous system questions"
    });

    const pharmacologyCategory = await this.createCategory({
      name: "Pharmacology",
      description: "Drug therapy and medication questions"
    });

    // Create sample questions
    await this.createQuestion({
      categoryId: cardiologyCategory.id,
      questionText: "A 45-year-old patient presents with chest pain, shortness of breath, and diaphoresis. The ECG shows ST-elevation in leads V2-V4. What is the most likely diagnosis?",
      options: [
        "Unstable angina",
        "ST-elevation myocardial infarction (STEMI)",
        "Non-ST-elevation myocardial infarction (NSTEMI)",
        "Pericarditis",
        "Pulmonary embolism"
      ],
      correctAnswer: 1,
      explanation: "ST-elevation in leads V2-V4 indicates an anterior STEMI, which is typically caused by occlusion of the left anterior descending (LAD) coronary artery.",
      isHighYield: true
    });

    await this.createQuestion({
      categoryId: cardiologyCategory.id,
      questionText: "Which medication is considered first-line treatment for acute ST-elevation myocardial infarction?",
      options: [
        "Metoprolol",
        "Aspirin",
        "Atorvastatin",
        "Lisinopril",
        "Furosemide"
      ],
      correctAnswer: 1,
      explanation: "Aspirin is the first-line antiplatelet therapy for STEMI, reducing mortality when given early.",
      isHighYield: true
    });

    await this.createQuestion({
      categoryId: neurologyCategory.id,
      questionText: "A 28-year-old woman presents with sudden onset severe headache, photophobia, and neck stiffness. What is the most appropriate initial investigation?",
      options: [
        "MRI brain",
        "CT head without contrast",
        "Lumbar puncture",
        "EEG",
        "Carotid ultrasound"
      ],
      correctAnswer: 1,
      explanation: "CT head without contrast is the initial investigation for suspected subarachnoid hemorrhage to rule out bleeding before considering lumbar puncture.",
      isHighYield: true
    });

    await this.createQuestion({
      categoryId: pharmacologyCategory.id,
      questionText: "Which of the following is a common side effect of ACE inhibitors?",
      options: [
        "Hyperkalemia",
        "Dry cough",
        "Angioedema",
        "Renal impairment",
        "All of the above"
      ],
      correctAnswer: 4,
      explanation: "ACE inhibitors can cause all of these side effects: hyperkalemia, dry cough, angioedema, and renal impairment.",
      isHighYield: false
    });

    await this.createQuestion({
      categoryId: neurologyCategory.id,
      questionText: "A 65-year-old patient with diabetes presents with sudden onset weakness on the right side of the body and slurred speech. What is the most likely diagnosis?",
      options: [
        "Migraine with aura",
        "Hypoglycemic episode",
        "Acute stroke",
        "Seizure",
        "Transient ischemic attack"
      ],
      correctAnswer: 2,
      explanation: "Sudden onset focal neurological deficits in a diabetic patient strongly suggest acute stroke.",
      isHighYield: true
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      subscriptionTier: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Category management methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      description: insertCategory.description || null,
      createdAt: new Date()
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, insertCategory: InsertCategory): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) {
      return undefined;
    }
    
    const updatedCategory: Category = {
      ...existingCategory,
      name: insertCategory.name,
      description: insertCategory.description || null
    };
    
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Question management methods
  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }

  async getQuestion(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestionsByCategory(categoryId: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(q => q.categoryId === categoryId);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = {
      ...insertQuestion,
      id,
      isHighYield: insertQuestion.isHighYield ?? false,
      questionImage: insertQuestion.questionImage ?? null,
      createdAt: new Date()
    };
    this.questions.set(id, question);
    return question;
  }

  async createQuestions(insertQuestions: InsertQuestion[]): Promise<Question[]> {
    const createdQuestions: Question[] = [];
    for (const insertQuestion of insertQuestions) {
      const question = await this.createQuestion(insertQuestion);
      createdQuestions.push(question);
    }
    return createdQuestions;
  }

  async updateQuestion(id: string, insertQuestion: InsertQuestion): Promise<Question | undefined> {
    const existingQuestion = this.questions.get(id);
    if (!existingQuestion) {
      return undefined;
    }
    
    const updatedQuestion: Question = {
      ...existingQuestion,
      ...insertQuestion
    };
    
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    return this.questions.delete(id);
  }

  // App settings management methods
  async getAppSettings(): Promise<AppSettings | undefined> {
    return this.appSettings || undefined;
  }

  async updateAppSettings(insertSettings: InsertAppSettings): Promise<AppSettings> {
    const id = this.appSettings?.id || randomUUID();
    const settings: AppSettings = {
      id,
      appName: insertSettings.appName,
      logoUrl: insertSettings.logoUrl || null,
      primaryColor: insertSettings.primaryColor || null,
      updatedAt: new Date()
    };
    this.appSettings = settings;
    return settings;
  }
}

export const storage = new MemStorage();
