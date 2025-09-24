import MockExamResults from '../MockExamResults';

export default function MockExamResultsExample() {
  // Mock exam data - todo: remove mock functionality
  const mockExamData = {
    id: "exam-1",
    name: "General Medicine Practice Exam",
    score: 32,
    totalQuestions: 50,
    timeLimit: 90,
    timeSpent: 75,
    categories: [
      {
        name: "Cardiology",
        correct: 8,
        total: 12,
        questions: [
          {
            id: "q1",
            question: "A 65-year-old patient presents with chest pain...",
            selectedAnswer: 1,
            correctAnswer: 1,
            isCorrect: true,
            category: "Cardiology"
          },
          {
            id: "q2", 
            question: "ECG shows ST elevation in leads V2-V4...",
            selectedAnswer: 0,
            correctAnswer: 2,
            isCorrect: false,
            category: "Cardiology"
          }
        ]
      },
      {
        name: "Neurology",
        correct: 5,
        total: 10,
        questions: [
          {
            id: "q3",
            question: "Patient with sudden onset headache...",
            selectedAnswer: 1,
            correctAnswer: 3,
            isCorrect: false,
            category: "Neurology"
          }
        ]
      },
      {
        name: "Pharmacology",
        correct: 9,
        total: 12,
        questions: []
      },
      {
        name: "Endocrinology",
        correct: 6,
        total: 8,
        questions: []
      },
      {
        name: "Gastroenterology",
        correct: 4,
        total: 8,
        questions: []
      }
    ]
  };

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium">Mock Exam Results</h3>
      <MockExamResults
        examData={mockExamData}
        onRetakeExam={() => console.log("Retake exam clicked")}
        onReviewMistakes={() => console.log("Review mistakes clicked")}
        onBackToDashboard={() => console.log("Back to dashboard clicked")}
      />
    </div>
  );
}