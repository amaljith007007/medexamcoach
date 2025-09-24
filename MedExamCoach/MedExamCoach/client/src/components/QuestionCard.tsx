import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface QuestionCardProps {
  question: {
    id: string;
    questionText: string;
    questionImage?: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: string;
    category: string;
  };
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: number;
  showAnswer?: boolean;
  timeSpent?: number;
  onAnswerSelect: (answerIndex: number) => void;
  onSubmit?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  showAnswer = false,
  timeSpent,
  onAnswerSelect,
  onSubmit,
  onNext,
  onPrevious,
  showNavigation = true
}: QuestionCardProps) {
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<number | null>(selectedAnswer ?? null);
  const [isSubmitted, setIsSubmitted] = useState(showAnswer);

  // Reset state when question changes
  useEffect(() => {
    setLocalSelectedAnswer(selectedAnswer ?? null);
    setIsSubmitted(showAnswer);
  }, [question.id, selectedAnswer, showAnswer]);

  const handleAnswerSelect = (index: number) => {
    if (!isSubmitted) {
      setLocalSelectedAnswer(index);
      onAnswerSelect(index);
    }
  };

  const handleSubmit = () => {
    if (localSelectedAnswer !== null && !isSubmitted) {
      setIsSubmitted(true);
      onSubmit?.();
    }
  };

  const isCorrect = isSubmitted && localSelectedAnswer === question.correctAnswer;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress and Metadata */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <Badge variant="outline">{question.category}</Badge>
            <Badge variant="outline" className="gap-1">
              <div className={`w-2 h-2 rounded-full ${getDifficultyColor(question.difficulty)}`} />
              {question.difficulty}
            </Badge>
          </div>
          {timeSpent && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {question.questionText}
          </CardTitle>
          {question.questionImage && (
            <div className="mt-4">
              <img 
                src={question.questionImage} 
                alt="Question illustration" 
                className="max-w-full h-auto rounded-lg border shadow-sm"
                style={{ maxHeight: '300px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = localSelectedAnswer === index;
              const isCorrectOption = index === question.correctAnswer;
              
              let buttonVariant: "outline" | "default" | "destructive" = "outline";
              let iconElement = null;
              
              if (isSubmitted) {
                if (isCorrectOption) {
                  buttonVariant = "default";
                  iconElement = <CheckCircle className="h-4 w-4 text-primary-foreground" />;
                } else if (isSelected && !isCorrectOption) {
                  buttonVariant = "destructive";
                  iconElement = <XCircle className="h-4 w-4 text-destructive-foreground" />;
                }
              } else if (isSelected) {
                buttonVariant = "default";
              }

              return (
                <Button
                  key={index}
                  variant={buttonVariant}
                  className="w-full justify-start text-left h-auto p-4 whitespace-normal"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isSubmitted}
                  data-testid={`button-option-${index}`}
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className="font-semibold mt-0.5">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="flex-1">{option}</span>
                    {iconElement}
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Submit Button */}
          {!isSubmitted && localSelectedAnswer !== null && (
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleSubmit}
                className="w-full sm:w-auto"
                data-testid="button-submit-answer"
              >
                Submit Answer
              </Button>
            </div>
          )}

          {/* Answer Result */}
          {isSubmitted && (
            <Alert className={isCorrect ? 
              "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20" : 
              "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20"
            }>
              <div className="flex items-start gap-2">
                {isCorrect ? 
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" /> :
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                }
                <div>
                  <div className="font-medium mb-2 text-foreground">
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </div>
                  <AlertDescription className="text-sm leading-relaxed text-foreground">
                    <strong>Correct Answer:</strong> {String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          {/* Navigation */}
          {showNavigation && (
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={currentIndex === 0}
                data-testid="button-previous"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Button
                onClick={onNext}
                disabled={!isSubmitted}
                data-testid="button-next"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}