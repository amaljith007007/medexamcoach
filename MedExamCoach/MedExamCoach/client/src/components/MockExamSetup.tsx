import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  FileText, 
  Target, 
  Users, 
  Trophy,
  ArrowLeft,
  Play,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MockExamSetupProps {
  userTier: "free" | "premium";
  onNavigate?: (view: string) => void;
  onStartExam?: (examConfig: ExamConfig) => void;
}

interface ExamConfig {
  totalQuestions: number;
  duration: number; // in minutes
  categories: string[];
  difficulty: "mixed" | "easy" | "medium" | "hard";
}

export default function MockExamSetup({ userTier, onNavigate, onStartExam }: MockExamSetupProps) {
  const [selectedExamType, setSelectedExamType] = useState<"general" | "category-specific">("general");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"mixed" | "easy" | "medium" | "hard">("mixed");
  
  // Fetch total questions available
  const { data: questions = [] } = useQuery({
    queryKey: ['/api/questions'],
    queryFn: async () => {
      const response = await fetch('/api/questions?categories=all');
      if (!response.ok) throw new Error('Failed to fetch questions');
      return response.json();
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories']
  });

  const examConfigs = {
    general: {
      title: "General Medicine Mock Exam",
      description: "Comprehensive exam covering all medical specialties",
      totalQuestions: Math.min(50, questions.length),
      duration: 90, // 1.5 hours
      categories: ["all"],
      passRate: 70
    },
    "category-specific": {
      title: "Category-Specific Mock Exam", 
      description: "Focused exam on selected medical specialties",
      totalQuestions: Math.min(30, questions.length),
      duration: 60, // 1 hour
      categories: categories.slice(0, 3).map((c: any) => c.id),
      passRate: 75
    }
  };

  const currentConfig = examConfigs[selectedExamType];
  
  const handleStartExam = () => {
    const examConfig: ExamConfig = {
      totalQuestions: currentConfig.totalQuestions,
      duration: currentConfig.duration,
      categories: currentConfig.categories,
      difficulty: selectedDifficulty
    };
    
    onStartExam?.(examConfig);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (userTier === "free") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => onNavigate?.("dashboard")}
            className="gap-2"
            data-testid="button-back-dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mock Exams</h1>
            <p className="text-muted-foreground">
              Timed practice exams to test your knowledge
            </p>
          </div>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-8 text-center">
            <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
            <p className="text-muted-foreground mb-6">
              Mock exams are available to Premium subscribers only. Upgrade to access timed practice exams and detailed performance analytics.
            </p>
            <Button 
              onClick={() => onNavigate?.("subscription")}
              data-testid="button-upgrade-mock"
            >
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => onNavigate?.("dashboard")}
          className="gap-2"
          data-testid="button-back-dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mock Exam Setup</h1>
          <p className="text-muted-foreground">
            Choose your exam configuration and start your timed practice
          </p>
        </div>
      </div>

      {questions.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No questions available for mock exams. Please add questions through the admin panel first.
          </AlertDescription>
        </Alert>
      )}

      {questions.length > 0 && (
        <>
          {/* Exam Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Select Exam Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-colors border-2 ${
                    selectedExamType === "general" 
                      ? "border-primary bg-primary/5" 
                      : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedExamType("general")}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{examConfigs.general.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {examConfigs.general.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {examConfigs.general.totalQuestions} questions
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(examConfigs.general.duration)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-colors border-2 ${
                    selectedExamType === "category-specific" 
                      ? "border-primary bg-primary/5" 
                      : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedExamType("category-specific")}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{examConfigs["category-specific"].title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {examConfigs["category-specific"].description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {examConfigs["category-specific"].totalQuestions} questions
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(examConfigs["category-specific"].duration)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Exam Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Exam Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Questions</h3>
                  </div>
                  <p className="text-2xl font-bold">{currentConfig.totalQuestions}</p>
                  <p className="text-sm text-muted-foreground">
                    Multiple choice questions
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Duration</h3>
                  </div>
                  <p className="text-2xl font-bold">{formatDuration(currentConfig.duration)}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(currentConfig.duration / currentConfig.totalQuestions * 10) / 10} min per question
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Pass Rate</h3>
                  </div>
                  <p className="text-2xl font-bold">{currentConfig.passRate}%</p>
                  <p className="text-sm text-muted-foreground">
                    Minimum to pass
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Exam Rules:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Each question must be submitted before moving to the next</li>
                  <li>• Timer will count down and automatically submit when time expires</li>
                  <li>• You cannot return to previous questions once submitted</li>
                  <li>• Detailed results and explanations will be shown at the end</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Start Exam */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Start?</h3>
                  <p className="text-muted-foreground">
                    Make sure you have {formatDuration(currentConfig.duration)} of uninterrupted time available.
                  </p>
                </div>
                
                <Button 
                  size="lg"
                  onClick={handleStartExam}
                  className="gap-2"
                  data-testid="button-start-exam"
                >
                  <Play className="h-5 w-5" />
                  Start Mock Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}