import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  Zap, 
  BarChart3,
  AlertTriangle,
  User,
  Bell,
  Trophy,
  Target,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

// Backend API (reusing from your existing code)
const API = {
  async getUserReadiness(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockAnswers = [
      ...Array(150).fill(null).map(() => ({ category: 'Clinical Medicine', correct: Math.random() > 0.25 })),
      ...Array(80).fill(null).map(() => ({ category: 'Cardiovascular Medicine', correct: Math.random() > 0.58 })),
      ...Array(120).fill(null).map(() => ({ category: 'Respiratory Medicine', correct: Math.random() > 0.18 })),
      ...Array(95).fill(null).map(() => ({ category: 'Dermatology', correct: Math.random() > 0.35 })),
      ...Array(65).fill(null).map(() => ({ category: 'Mental Health', correct: Math.random() > 0.45 })),
    ];
    
    const totalQuestions = mockAnswers.length;
    const correctAnswers = mockAnswers.filter(a => a.correct).length;
    const overallAccuracy = correctAnswers / totalQuestions;
    
    const categories: Record<string, { total: number; correct: number }> = {};
    mockAnswers.forEach(answer => {
      if (!categories[answer.category]) {
        categories[answer.category] = { total: 0, correct: 0 };
      }
      categories[answer.category].total++;
      if (answer.correct) categories[answer.category].correct++;
    });
    
    let weakestTopic = null;
    let lowestPercentile = 100;
    
    Object.entries(categories).forEach(([name, stats]) => {
      const accuracy = stats.correct / stats.total;
      const percentile = Math.round(accuracy * 100);
      
      if (percentile < lowestPercentile) {
        lowestPercentile = percentile;
        weakestTopic = {
          name,
          accuracy: percentile,
          percentile: Math.max(1, Math.round(percentile * 0.6)),
          questionsNeeded: Math.max(5, Math.round((0.8 - accuracy) * 25))
        };
      }
    });
    
    const volumeBonus = Math.min(15, totalQuestions / 50);
    const readinessScore = Math.min(95, Math.round((overallAccuracy * 100) + volumeBonus));
    const userPercentile = Math.max(1, Math.min(99, Math.round(100 - (readinessScore * 0.4))));
    
    return {
      score: readinessScore,
      totalQuestions,
      percentile: userPercentile,
      weakestTopic,
      lastUpdated: new Date().toISOString()
    };
  },
  
  async getPeerComparison(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const categories = [
      { name: 'Respiratory Medicine', userScore: 85, percentile: 85, peerAverage: 72, status: 'Strong' },
      { name: 'Dermatology', userScore: 78, percentile: 68, peerAverage: 71, status: 'Good' },
      { name: 'Mental Health', userScore: 65, percentile: 35, peerAverage: 74, status: 'Average' },
      { name: 'Cardiovascular Medicine', userScore: 52, percentile: 15, peerAverage: 76, status: 'Weak' }
    ];
    
    const strongest = categories.reduce((prev, current) => prev.percentile > current.percentile ? prev : current);
    const weakest = categories.reduce((prev, current) => prev.percentile < current.percentile ? prev : current);
    
    return {
      overallPercentile: 72,
      strongestArea: strongest,
      weakestArea: weakest,
      categories: categories.sort((a, b) => b.percentile - a.percentile),
      totalPeers: 1247,
      lastUpdated: new Date().toISOString()
    };
  }
};

// Header Component matching the image
function MedExcelHeader({ user }: { user: { name: string; role: string } }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">MedExcel Pro</h1>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <span className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">Dashboard</span>
            <span className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 cursor-pointer">Practice</span>
            <span className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 cursor-pointer">Mock Exams</span>
            <span className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 cursor-pointer">Flashcards</span>
          </div>
          
          {/* Right side - Notifications and User */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md relative">
              <Bell className="h-5 w-5" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-700">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Quick Actions Component
function QuickActions() {
  const actions = [
    { title: 'Practice Questions', description: 'Category-based practice', icon: BookOpen, gradient: 'from-blue-500 to-blue-600' },
    { title: 'Mock Exam', description: 'Full 180-question test', icon: Clock, gradient: 'from-green-500 to-green-600' },
    { title: 'Rapid Review', description: '10-question sprint', icon: Zap, gradient: 'from-orange-500 to-orange-600' },
    { title: 'Flashcards', description: 'Spaced repetition study', icon: BarChart3, gradient: 'from-purple-500 to-purple-600' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button key={index} className="group relative bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`bg-gradient-to-r ${action.gradient} p-3 rounded-lg text-white shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{action.title}</h4>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Exam Readiness Component
function ExamReadiness({ userId }: { userId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const readinessData = await API.getUserReadiness(userId);
        setData(readinessData);
      } catch (error) {
        console.error('Failed to load readiness data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mx-auto mb-4" style={{ width: '140px' }}></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { score, totalQuestions, percentile, weakestTopic } = data;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Readiness</h3>
      
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg width="160" height="90" viewBox="0 0 160 90">
            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#f3f4f6" strokeWidth="8" strokeLinecap="round" />
            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(score / 100) * 188.5} 188.5`} style={{ transition: 'stroke-dasharray 1.2s ease-in-out' }} />
          </svg>
          <div className="absolute" style={{ bottom: '8px', left: '20px', transform: 'translateX(-50%)' }}>
            <span className="text-xs font-medium text-gray-500">0</span>
          </div>
          <div className="absolute" style={{ bottom: '8px', right: '20px', transform: 'translateX(50%)' }}>
            <span className="text-xs font-medium text-gray-500">100</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-gray-900 mb-1">{score}%</div>
        <div className="text-xs text-gray-600">Exam Readiness Score</div>
      </div>

      <div className="text-center mb-4 space-y-1">
        <div className="text-xs text-gray-700">Based on {totalQuestions.toLocaleString()} questions answered</div>
        <div className="text-xs text-blue-600 font-medium">Top {percentile}% of students</div>
      </div>

      {weakestTopic && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-amber-800 mb-1">Focus Area: {weakestTopic.name}</div>
              <div className="text-xs text-amber-700 mb-2">{weakestTopic.percentile}th percentile - {weakestTopic.accuracy}% accuracy</div>
              <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-orange-600 transition-colors w-full">
                Improve with {weakestTopic.questionsNeeded} questions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Peer Performance Component
function PeerPerformance({ userId }: { userId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const peerData = await API.getPeerComparison(userId);
        setData(peerData);
      } catch (error) {
        console.error('Failed to load peer data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>)}
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { overallPercentile, strongestArea, weakestArea, categories, totalPeers } = data;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = { 
      'Strong': 'text-green-700 bg-green-100', 
      'Good': 'text-blue-700 bg-blue-100', 
      'Average': 'text-yellow-700 bg-yellow-100', 
      'Weak': 'text-red-700 bg-red-100' 
    };
    return colors[status] || 'text-gray-700 bg-gray-100';
  };

  const getScoreColor = (status: string) => {
    const colors: Record<string, string> = { 
      'Strong': 'text-green-600', 
      'Good': 'text-blue-600', 
      'Average': 'text-yellow-600', 
      'Weak': 'text-red-600' 
    };
    return colors[status] || 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Peer Performance Comparison</h3>
        <div className="text-sm text-gray-500">{totalPeers.toLocaleString()} GP trainees</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-white">{overallPercentile}</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Overall Percentile</h4>
          <p className="text-sm text-gray-600">You're performing better than {overallPercentile}% of GP trainees</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Strongest Area</h4>
          <p className="text-sm text-green-700 font-medium">{strongestArea.name}</p>
          <p className="text-sm text-gray-600">{strongestArea.percentile}th percentile</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Focus Area</h4>
          <p className="text-sm text-red-700 font-medium">{weakestArea.name}</p>
          <p className="text-sm text-gray-600">{weakestArea.percentile}th percentile</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Performance Analysis</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Medical Category</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Your Score</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Percentile</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Peer Average</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Performance</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category: any, index: number) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">{category.name}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`font-semibold ${getScoreColor(category.status)}`}>{category.userScore}%</span>
                  </td>
                  <td className="py-4 px-4 text-center font-medium text-gray-700">{category.percentile}th</td>
                  <td className="py-4 px-4 text-center text-gray-600">{category.peerAverage}%</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(category.status)}`}>
                      {category.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Study Insights Component
function StudyInsights({ peerData }: { peerData: any }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Personalized Study Insights</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-center space-x-3">
            <Target className="h-5 w-5 text-red-500" />
            <span className="text-sm text-gray-700">Focus on your weakest area ({peerData?.weakestArea?.name || 'Cardiovascular Medicine'}) to improve fastest.</span>
          </div>
          <span className="text-red-600 font-medium text-sm">+15% boost potential</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-700">You're excelling in {peerData?.strongestArea?.name || 'Respiratory Medicine'} - maintain this advantage.</span>
          </div>
          <span className="text-green-600 font-medium text-sm">Keep leading!</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-3">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-700">Spend 70% of time on weak areas, 30% reviewing strong areas for balanced improvement.</span>
          </div>
          <span className="text-blue-600 font-medium text-sm">Optimal learning</span>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function MedExcelDashboard() {
  const mockUser = { 
    id: 'user-123', 
    name: 'Dr. Sarah Johnson', 
    role: 'GP Trainee' 
  };
  const [peerData, setPeerData] = useState<any>(null);

  useEffect(() => {
    const loadPeerData = async () => {
      try {
        const data = await API.getPeerComparison(mockUser.id);
        setPeerData(data);
      } catch (error) {
        console.error('Failed to load peer data for insights:', error);
      }
    };
    loadPeerData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <MedExcelHeader user={mockUser} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {mockUser.name}.</h2>
          <p className="text-gray-600">Track your progress and continue your medical training journey with confidence.</p>
        </div>

        {/* Top Row - Quick Actions and Exam Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <QuickActions />
          <ExamReadiness userId={mockUser.id} />
        </div>

        {/* Middle Row - Peer Performance */}
        <div className="mb-6">
          <PeerPerformance userId={mockUser.id} />
        </div>

        {/* Bottom Row - Study Insights */}
        <StudyInsights peerData={peerData} />
      </main>
    </div>
  );
}