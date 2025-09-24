import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingDown, 
  CheckCircle, 
  XCircle,
  BarChart3,
  RefreshCw,
  Download,
  Share
} from "lucide-react";

interface MockExamResultsProps {
  examData: {
    id: string;
    name: string;
    score: number;
    totalQuestions: number;
    timeLimit: number; // minutes
    timeSpent: number; // minutes
    categories: Array<{
      name: string;
      correct: number;
      total: number;
      questions: Array<{
        id: string;
        question: string;
        selectedAnswer: number;
        correctAnswer: number;
        isCorrect: boolean;
        category: string;
      }>;
    }>;
  };
  onRetakeExam: () => void;
  onReviewMistakes: () => void;
  onBackToDashboard: () => void;
}

export default function MockExamResults({ 
  examData, 
  onRetakeExam, 
  onReviewMistakes, 
  onBackToDashboard 
}: MockExamResultsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const scorePercent = Math.round((examData.score / examData.totalQuestions) * 100);
  const timeEfficiency = Math.round((examData.timeSpent / examData.timeLimit) * 100);
  
  const getScoreColor = (percent: number) => {
    if (percent >= 80) return "text-green-600";
    if (percent >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (percent: number) => {
    if (percent >= 80) return { text: "Excellent", variant: "default" as const };
    if (percent >= 70) return { text: "Good", variant: "secondary" as const };
    return { text: "Needs Improvement", variant: "destructive" as const };
  };

  const weakestCategories = examData.categories
    .map(cat => ({
      ...cat,
      accuracy: Math.round((cat.correct / cat.total) * 100)
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const incorrectQuestions = examData.categories
    .flatMap(cat => cat.questions)
    .filter(q => !q.isCorrect);

  const scoreBadge = getScoreBadge(scorePercent);

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Trophy className={`h-16 w-16 ${getScoreColor(scorePercent)}`} />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Exam Complete!</h1>
        <div className="space-y-2">
          <h2 className="text-xl text-muted-foreground">{examData.name}</h2>
          <div className={`text-6xl font-bold ${getScoreColor(scorePercent)}`}>
            {scorePercent}%
          </div>
          <Badge variant={scoreBadge.variant}>{scoreBadge.text}</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{examData.score}</div>
            <div className="text-sm text-muted-foreground">
              out of {examData.totalQuestions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-chart-3" />
            <div className="text-2xl font-bold">{examData.timeSpent}m</div>
            <div className="text-sm text-muted-foreground">
              of {examData.timeLimit}m limit
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{examData.score}</div>
            <div className="text-sm text-muted-foreground">correct</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <XCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold">{examData.totalQuestions - examData.score}</div>
            <div className="text-sm text-muted-foreground">incorrect</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="categories" data-testid="tab-categories">By Category</TabsTrigger>
          <TabsTrigger value="mistakes" data-testid="tab-mistakes">Review Mistakes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Score</span>
                    <span className="font-medium">{scorePercent}%</span>
                  </div>
                  <Progress value={scorePercent} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time Efficiency</span>
                    <span className="font-medium">{timeEfficiency}%</span>
                  </div>
                  <Progress value={timeEfficiency} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    You used {examData.timeSpent} of {examData.timeLimit} minutes
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Weak Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weakestCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{category.name}</span>
                      <span className="font-medium">{category.accuracy}%</span>
                    </div>
                    <Progress value={category.accuracy} className="h-2" />
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={onReviewMistakes}
                  data-testid="button-review-weak-areas"
                >
                  Focus on Weak Areas
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {examData.categories.map((category, index) => {
                  const accuracy = Math.round((category.correct / category.total) * 100);
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{category.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {category.correct}/{category.total}
                          </span>
                          <Badge variant={accuracy >= 70 ? "default" : "destructive"}>
                            {accuracy}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={accuracy} className="h-3" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mistakes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Incorrect Answers ({incorrectQuestions.length})</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onReviewMistakes}
                  data-testid="button-review-all-mistakes"
                >
                  Review All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incorrectQuestions.slice(0, 5).map((question, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline">{question.category}</Badge>
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <p className="text-sm font-medium line-clamp-2">
                      {question.question}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Your answer: Option {String.fromCharCode(65 + question.selectedAnswer)} • 
                      Correct: Option {String.fromCharCode(65 + question.correctAnswer)}
                    </div>
                  </div>
                ))}
                
                {incorrectQuestions.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    And {incorrectQuestions.length - 5} more questions...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={onRetakeExam} data-testid="button-retake-exam">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retake Exam
        </Button>
        
        <Button variant="outline" onClick={onReviewMistakes} data-testid="button-review-mistakes">
          <BarChart3 className="h-4 w-4 mr-2" />
          Review Mistakes
        </Button>
        
        <Button variant="outline" data-testid="button-download-results">
          <Download className="h-4 w-4 mr-2" />
          Download Results
        </Button>
        
        <Button variant="outline" data-testid="button-share-results">
          <Share className="h-4 w-4 mr-2" />
          Share Results
        </Button>
        
        <Button variant="ghost" onClick={onBackToDashboard} data-testid="button-back-dashboard">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}