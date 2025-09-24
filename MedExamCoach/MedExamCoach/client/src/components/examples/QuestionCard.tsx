import { useState } from "react";
import QuestionCard from '../QuestionCard';

export default function QuestionCardExample() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [showAnswer, setShowAnswer] = useState(false);

  // Mock question data
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
    explanation: "ST-elevation in leads V2-V4 indicates an anterior STEMI, which is typically caused by occlusion of the left anterior descending (LAD) coronary artery. The combination of chest pain, shortness of breath, diaphoresis, and characteristic ECG changes makes STEMI the most likely diagnosis.",
    difficulty: "medium",
    category: "Cardiology"
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    console.log("Answer selected:", answerIndex);
    
    // Show answer after selection
    setTimeout(() => {
      setShowAnswer(true);
    }, 500);
  };

  const resetQuestion = () => {
    setSelectedAnswer(undefined);
    setShowAnswer(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Question Card Example</h3>
        <button 
          onClick={resetQuestion}
          className="text-sm text-blue-600 hover:underline"
        >
          Reset Question
        </button>
      </div>
      
      <QuestionCard
        question={mockQuestion}
        currentIndex={0}
        totalQuestions={50}
        selectedAnswer={selectedAnswer}
        showAnswer={showAnswer}
        timeSpent={45}
        onAnswerSelect={handleAnswerSelect}
        onNext={() => console.log("Next question")}
        onPrevious={() => console.log("Previous question")}
      />
    </div>
  );
}