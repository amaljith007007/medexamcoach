import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSettingsProvider, useAppSettings } from "./contexts/AppSettingsContext";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";

// Import our components
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import CategorySelector from "./components/CategorySelector";
import QuestionCard from "./components/QuestionCard";
import Timer from "./components/Timer";
import MockExamResults from "./components/MockExamResults";
import SubscriptionCard from "./components/SubscriptionCard";
import AdminCategories from "./components/AdminCategories";
import AdminQuestions from "./components/AdminQuestions";
import AdminSettings from "./components/AdminSettings";
import PracticeView from "./components/PracticeView";
import MockExamSetup from "./components/MockExamSetup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import examples for demo
import HeaderExample from "./components/examples/Header";
import AuthFormExample from "./components/examples/AuthForm";
import DashboardExample from "./components/examples/Dashboard";
import CategorySelectorExample from "./components/examples/CategorySelector";
import QuestionCardExample from "./components/examples/QuestionCard";
import TimerExample from "./components/examples/Timer";
import MockExamResultsExample from "./components/examples/MockExamResults";
import SubscriptionCardExample from "./components/examples/SubscriptionCard";

function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-foreground">MedExam Pro</h1>
          <p className="text-xl text-muted-foreground">
            Medical Exam Question Bank - Component Showcase
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            This is a high-fidelity prototype showcasing all the components for the medical exam preparation platform. 
            Click buttons and interact with elements to see the functionality in action.
          </p>
        </div>

        <div className="space-y-16">
          {/* Header Component */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Header Component</h2>
            <HeaderExample />
          </section>

          {/* Authentication */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Authentication Form</h2>
            <AuthFormExample />
          </section>

          {/* Dashboard */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>
            <DashboardExample />
          </section>

          {/* Category Selector */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Category Selection</h2>
            <CategorySelectorExample />
          </section>

          {/* Question Card */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Question Interface</h2>
            <QuestionCardExample />
          </section>

          {/* Timer */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Exam Timer</h2>
            <TimerExample />
          </section>

          {/* Mock Exam Results */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Exam Results</h2>
            <MockExamResultsExample />
          </section>

          {/* Subscription */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Subscription Plans</h2>
            <SubscriptionCardExample />
          </section>
        </div>

        <div className="text-center py-12 border-t">
          <h3 className="text-lg font-medium mb-4">Ready to build the full application?</h3>
          <p className="text-muted-foreground mb-6">
            This prototype demonstrates the complete user interface. The next step would be 
            to integrate with Supabase for authentication, implement the backend API routes, 
            and add Stripe payment processing.
          </p>
          <div className="flex justify-center gap-4">
            <Button data-testid="button-start-development">
              Start Development
            </Button>
            <Button variant="outline" data-testid="button-view-docs">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Flow (would be used after authentication is implemented)
function MainAppContent() {
  const [currentView, setCurrentView] = useState<"dashboard" | "practice" | "exam" | "exam-setup" | "results" | "subscription" | "admin">("dashboard");
  const [user, setUser] = useState({
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    subscriptionTier: "premium" as "free" | "premium"
  });

  // Mock question data for practice mode
  const mockQuestion = {
    id: "q1",
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
    difficulty: "medium",
    category: "Cardiology"
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard user={user} onNavigate={setCurrentView} />;
      case "practice":
        return (
          <PracticeView 
            userTier={user.subscriptionTier}
            onNavigate={setCurrentView}
          />
        );
      case "exam":
        return (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Mock Exam - General Medicine</h1>
              <Timer duration={5400} isActive={true} variant="compact" />
            </div>
            <QuestionCard
              question={mockQuestion}
              currentIndex={0}
              totalQuestions={50}
              onAnswerSelect={(answer) => console.log("Answer:", answer)}
            />
          </div>
        );
      case "exam-setup":
        return (
          <MockExamSetup
            userTier={user.subscriptionTier}
            onNavigate={setCurrentView}
            onStartExam={(config) => {
              console.log("Starting exam with config:", config);
              setCurrentView("exam");
            }}
          />
        );
      case "subscription":
        return <SubscriptionCard currentTier={user.subscriptionTier} />;
      case "admin":
        return (
          <div className="p-6">
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="categories" className="mt-6">
                <AdminCategories />
              </TabsContent>
              <TabsContent value="questions" className="mt-6">
                <AdminQuestions />
              </TabsContent>
              <TabsContent value="settings" className="mt-6">
                <AdminSettings />
              </TabsContent>
            </Tabs>
          </div>
        );
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        onLogout={() => console.log("Logout")}
      />
      
      {/* Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-6">
          <div className="flex gap-6 py-4">
            <Button 
              variant={currentView === "dashboard" ? "default" : "ghost"}
              onClick={() => setCurrentView("dashboard")}
              data-testid="nav-dashboard"
            >
              Dashboard
            </Button>
            <Button 
              variant={currentView === "practice" ? "default" : "ghost"}
              onClick={() => setCurrentView("practice")}
              data-testid="nav-practice"
            >
              Practice
            </Button>
            <Button 
              variant={currentView === "exam" ? "default" : "ghost"}
              onClick={() => setCurrentView("exam")}
              data-testid="nav-exam"
            >
              Mock Exam
            </Button>
            <Button 
              variant={currentView === "subscription" ? "default" : "ghost"}
              onClick={() => setCurrentView("subscription")}
              data-testid="nav-subscription"
            >
              Subscription
            </Button>
            <Button 
              variant={currentView === "admin" ? "default" : "ghost"}
              onClick={() => setCurrentView("admin")}
              data-testid="nav-admin"
            >
              Admin
            </Button>
          </div>
        </div>
      </div>

      {renderCurrentView()}
    </div>
  );
}

function MainApp() {
  return (
    <AppSettingsProvider>
      <MainAppContent />
    </AppSettingsProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/app" component={MainApp} />
      <Route path="/" component={ComponentShowcase} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="medexam-pro-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;