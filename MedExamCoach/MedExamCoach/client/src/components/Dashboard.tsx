import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Target, 
  Clock, 
  TrendingUp, 
  Award, 
  Play, 
  Calendar,
  CheckCircle,
  BarChart3
} from "lucide-react";

interface DashboardProps {
  user: {
    firstName?: string;
    lastName?: string;
    subscriptionTier: string;
  };
  onNavigate?: (view: string) => void;
}

export default function Dashboard({ user, onNavigate }: DashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock data - todo: remove mock functionality
  const mockStats = {
    totalQuestions: user.subscriptionTier === "premium" ? 2847 : 10,
    questionsAnswered: user.subscriptionTier === "premium" ? 452 : 8,
    correctAnswers: user.subscriptionTier === "premium" ? 367 : 6,
    streak: user.subscriptionTier === "premium" ? 7 : 3,
    studyTime: user.subscriptionTier === "premium" ? 1245 : 25, // minutes
    mockExamsCompleted: user.subscriptionTier === "premium" ? 12 : 0
  };

  const mockCategoryProgress = [
    { name: "Cardiology", correct: 85, total: 120, accuracy: 71 },
    { name: "Neurology", correct: 45, total: 67, accuracy: 67 },
    { name: "Endocrinology", correct: 32, total: 42, accuracy: 76 },
    { name: "Pharmacology", correct: 78, total: 95, accuracy: 82 },
    { name: "Anatomy", correct: 56, total: 78, accuracy: 72 }
  ];

  const mockRecentActivity = [
    { type: "practice", category: "Cardiology", score: "8/10", date: "2 hours ago" },
    { type: "mock_exam", category: "General Medicine", score: "75%", date: "Yesterday" },
    { type: "practice", category: "Pharmacology", score: "9/10", date: "2 days ago" },
    { type: "practice", category: "Neurology", score: "6/10", date: "3 days ago" }
  ];

  const accuracyPercent = mockStats.questionsAnswered > 0 
    ? Math.round((mockStats.correctAnswers / mockStats.questionsAnswered) * 100) 
    : 0;

  const progressPercent = user.subscriptionTier === "premium" 
    ? Math.round((mockStats.questionsAnswered / mockStats.totalQuestions) * 100)
    : Math.round((mockStats.questionsAnswered / 10) * 100);

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue your medical exam preparation?
          </p>
        </div>
        <Badge variant={user.subscriptionTier === "premium" ? "default" : "secondary"}>
          {user.subscriptionTier === "premium" ? "Premium Account" : "Free Account"}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Questions Answered</p>
                <p className="text-3xl font-bold" data-testid="text-questions-answered">
                  {mockStats.questionsAnswered}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  of {mockStats.totalQuestions} available
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-3xl font-bold" data-testid="text-accuracy">
                  {accuracyPercent}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {mockStats.correctAnswers} correct
                </p>
              </div>
              <Target className="h-8 w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Study Streak</p>
                <p className="text-3xl font-bold" data-testid="text-streak">
                  {mockStats.streak}
                </p>
                <p className="text-xs text-muted-foreground mt-1">days</p>
              </div>
              <Award className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Study Time</p>
                <p className="text-3xl font-bold" data-testid="text-study-time">
                  {Math.floor(mockStats.studyTime / 60)}h
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {mockStats.studyTime % 60}m this week
                </p>
              </div>
              <Clock className="h-8 w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Category Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCategoryProgress.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {category.correct}/{category.total} ({category.accuracy}%)
                    </span>
                  </div>
                  <Progress value={category.accuracy} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="h-auto p-4 justify-start" 
                  onClick={() => onNavigate?.("practice")}
                  data-testid="button-practice-mode"
                >
                  <Play className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Practice Mode</div>
                    <div className="text-xs opacity-90">Study by category</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 justify-start"
                  onClick={() => onNavigate?.("exam-setup")}
                  disabled={user.subscriptionTier === "free"}
                  data-testid="button-mock-exam"
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Mock Exam</div>
                    <div className="text-xs opacity-70">
                      {user.subscriptionTier === "free" ? "Premium only" : "Timed practice"}
                    </div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 justify-start"
                  data-testid="button-review-mistakes"
                >
                  <CheckCircle className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Review Mistakes</div>
                    <div className="text-xs opacity-70">Learn from errors</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 justify-start"
                  data-testid="button-analytics"
                >
                  <BarChart3 className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Analytics</div>
                    <div className="text-xs opacity-70">Detailed insights</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.type === "mock_exam" ? "Mock Exam" : "Practice"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{activity.score}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {user.subscriptionTier === "free" && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary">Upgrade to Premium</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Unlock all {mockStats.totalQuestions} questions, mock exams, and detailed analytics.
                </p>
                <Button className="w-full" data-testid="button-upgrade">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}