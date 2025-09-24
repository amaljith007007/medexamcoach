import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shuffle, BookOpen, Trophy, Target, CheckCircle, XCircle } from "lucide-react";
import CategorySelector from "./CategorySelector";
import QuestionCard from "./QuestionCard";

interface Question {
  id: string;
  categoryId: string;
  questionText: string;
  questionImage?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  isHighYield: boolean;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    description: string;
  };
}

interface PracticeViewProps {
  userTier: "free" | "premium";
  onNavigate?: (view: string) => void;
}

export default function PracticeView({ userTier, onNavigate }: PracticeViewProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentMode, setCurrentMode] = useState<"select" | "practice">("select");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [practiceStats, setPracticeStats] = useState<{correct: number, total: number, answers: {questionId: string, isCorrect: boolean}[]}>({
    correct: 0,
    total: 0,
    answers: []
  });
  const [practiceComplete, setPracticeComplete] = useState(false);

  // Fetch available questions based on selected categories
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['/api/questions', selectedCategories],
    queryFn: async () => {
      if (selectedCategories.length === 0) return [];
      
      let url = '/api/questions';
      if (selectedCategories.includes('all')) {
        url = '/api/questions?categories=all';
      } else {
        const params = new URLSearchParams();
        selectedCategories.forEach(cat => params.append('categories', cat));
        url = `/api/questions?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch questions');
      return response.json();
    },
    enabled: selectedCategories.length > 0 && currentMode === "practice"
  });

  // Shuffle questions if shuffle mode is enabled (memoized to prevent re-shuffling)
  const questionsToShow = useMemo(() => {
    if (shuffleMode && questions.length > 0) {
      return [...questions].sort(() => Math.random() - 0.5);
    }
    return questions;
  }, [questions, shuffleMode]);

  const currentQuestion = questionsToShow[currentQuestionIndex];

  const handleCategorySelect = (categories: string[]) => {
    console.log("Selected categories:", categories);
    setSelectedCategories(categories);
    if (categories.length > 0) {
      setCurrentMode("practice");
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handlePracticeAllRandom = () => {
    setSelectedCategories(["all"]);
    setShuffleMode(true);
    setCurrentMode("practice");
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    setShowAnswer(true);
    
    // Track the answer for statistics
    if (currentQuestion && selectedAnswer !== null) {
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      setPracticeStats(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
        answers: [...prev.answers, {
          questionId: currentQuestion.id,
          isCorrect
        }]
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsToShow.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      // End of practice - show completion
      setPracticeComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handleBackToCategories = () => {
    setCurrentMode("select");
    setSelectedCategories([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setShuffleMode(false);
    setPracticeStats({correct: 0, total: 0, answers: []});
    setPracticeComplete(false);
  };

  if (currentMode === "select") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Practice Mode</h1>
            <p className="text-muted-foreground">
              Select categories to practice or try random questions
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={handlePracticeAllRandom}
            className="gap-2"
            data-testid="button-practice-random"
          >
            <Shuffle className="h-4 w-4" />
            Practice All Random
          </Button>
        </div>

        <CategorySelector 
          onCategorySelect={handleCategorySelect}
          userTier={userTier}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (questionsToShow.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Questions Available</h3>
            <p className="text-muted-foreground mb-4">
              There are no questions available for the selected categories.
            </p>
            <Button onClick={handleBackToCategories}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Practice completion view
  if (practiceComplete) {
    const percentage = practiceStats.total > 0 ? Math.round((practiceStats.correct / practiceStats.total) * 100) : 0;
    const isPassing = percentage >= 70;
    
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToCategories}
            className="gap-2"
            data-testid="button-back-categories"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Button>
          
          <div>
            <h1 className="text-xl font-bold">Practice Complete!</h1>
            <p className="text-muted-foreground">Here's how you performed</p>
          </div>
        </div>

        <Card className={`border-2 ${isPassing ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-orange-200 bg-orange-50 dark:bg-orange-950/20'}`}>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              {isPassing ? (
                <Trophy className="h-16 w-16 text-green-600 dark:text-green-400" />
              ) : (
                <Target className="h-16 w-16 text-orange-600 dark:text-orange-400" />
              )}
            </div>
            
            <h2 className="text-3xl font-bold mb-2">{percentage}%</h2>
            <p className="text-lg mb-6 text-muted-foreground">
              {isPassing ? "Great job! You're doing well." : "Keep practicing to improve your score."}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{practiceStats.total}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">{practiceStats.correct}</span>
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">{practiceStats.total - practiceStats.correct}</span>
                </div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center mt-8">
              <Button
                onClick={handleBackToCategories}
                data-testid="button-practice-again"
              >
                Practice Again
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate?.("dashboard")}
                data-testid="button-back-dashboard"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToCategories}
            className="gap-2"
            data-testid="button-back-categories"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Button>
          
          <div>
            <h1 className="text-xl font-bold">Practice Session</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {shuffleMode ? (
                <Badge variant="outline" className="gap-1">
                  <Shuffle className="h-3 w-3" />
                  Random Mode
                </Badge>
              ) : (
                selectedCategories.map(catId => {
                  // Find category name for display
                  const categoryName = catId === "all" ? "All Categories" : 
                    (questionsToShow[0]?.category?.name || catId);
                  return (
                    <Badge key={catId} variant="outline">
                      {categoryName}
                    </Badge>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <QuestionCard
        question={{
          id: currentQuestion.id,
          questionText: currentQuestion.questionText,
          questionImage: currentQuestion.questionImage,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.correctAnswer,
          explanation: currentQuestion.explanation,
          difficulty: currentQuestion.isHighYield ? "high" : "medium",
          category: currentQuestion.category?.name || "Unknown"
        }}
        currentIndex={currentQuestionIndex}
        totalQuestions={questionsToShow.length}
        selectedAnswer={selectedAnswer ?? undefined}
        showAnswer={showAnswer}
        onAnswerSelect={handleAnswerSelect}
        onSubmit={handleSubmit}
        onNext={handleNext}
        onPrevious={handlePrevious}
        showNavigation={true}
      />
    </div>
  );
}