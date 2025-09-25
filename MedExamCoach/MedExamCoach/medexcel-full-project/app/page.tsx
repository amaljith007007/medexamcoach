'use client'

import { useState, useEffect } from 'react'
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
} from 'lucide-react'

// Mock API data
const mockData = {
  user: {
    name: 'Dr. Sarah Johnson',
    role: 'GP Trainee'
  },
  readiness: {
    score: 76,
    totalQuestions: 510,
    percentile: 70,
    weakestTopic: {
      name: 'Cardiovascular Medicine',
      percentile: 23,
      accuracy: 39,
      questionsNeeded: 10
    }
  },
  peerComparison: {
    overallPercentile: 72,
    totalPeers: 1247,
    categories: [
      { name: 'Respiratory Medicine', userScore: 85, percentile: 85, peerAverage: 72, status: 'Strong' },
      { name: 'Dermatology', userScore: 78, percentile: 68, peerAverage: 71, status: 'Good' },
      { name: 'Mental Health', userScore: 65, percentile: 35, peerAverage: 74, status: 'Average' },
      { name: 'Cardiovascular Medicine', userScore: 52, percentile: 15, peerAverage: 76, status: 'Weak' }
    ]
  }
}

export default function Dashboard() {
  const [data, setData] = useState(mockData)

  const getStatusColor = (status: string) => {
    const colors = { 
      'Strong': 'status-strong', 
      'Good': 'status-good', 
      'Average': 'status-average', 
      'Weak': 'status-weak' 
    }
    return colors[status as keyof typeof colors] || 'status-average'
  }

  const getScoreColor = (status: string) => {
    const colors = { 
      'Strong': 'text-green-600', 
      'Good': 'text-blue-600', 
      'Average': 'text-yellow-600', 
      'Weak': 'text-red-600' 
    }
    return colors[status as keyof typeof colors] || 'text-gray-600'
  }

  const strongestArea = data.peerComparison.categories.reduce((prev, current) => 
    prev.percentile > current.percentile ? prev : current
  )
  const weakestArea = data.peerComparison.categories.reduce((prev, current) => 
    prev.percentile < current.percentile ? prev : current
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">MedExcel Pro</h1>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              <span className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">Dashboard</span>
              <span className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 cursor-pointer">Practice</span>
              <span className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 cursor-pointer">Mock Exams</span>
              <span className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 cursor-pointer">Flashcards</span>
            </div>
            
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
                  <div className="text-sm font-medium text-gray-700">{data.user.name}</div>
                  <div className="text-xs text-gray-500">{data.user.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {data.user.name}.</h2>
          <p className="text-gray-600">Track your progress and continue your medical training journey with confidence.</p>
        </div>

        {/* Top Row - Quick Actions and Exam Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="action-card">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg text-white shadow-sm mx-auto mb-3 w-10 h-10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Practice Questions</h4>
                <p className="text-xs text-gray-500">Category-based practice</p>
              </div>
              <div className="action-card">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg text-white shadow-sm mx-auto mb-3 w-10 h-10 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Mock Exam</h4>
                <p className="text-xs text-gray-500">Full 180-question test</p>
              </div>
              <div className="action-card">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-lg text-white shadow-sm mx-auto mb-3 w-10 h-10 flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Rapid Review</h4>
                <p className="text-xs text-gray-500">10-question sprint</p>
              </div>
              <div className="action-card">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg text-white shadow-sm mx-auto mb-3 w-10 h-10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Flashcards</h4>
                <p className="text-xs text-gray-500">Spaced repetition study</p>
              </div>
            </div>
          </div>

          {/* Exam Readiness */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Readiness</h3>
            
            <div className="flex justify-center mb-4">
              <div className="relative">
                <svg width="160" height="90" viewBox="0 0 160 90">
                  <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#f3f4f6" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(data.readiness.score / 100) * 188.5} 188.5`} />
                </svg>
                <div className="absolute bottom-2 left-5">
                  <span className="text-xs font-medium text-gray-500">0</span>
                </div>
                <div className="absolute bottom-2 right-5">
                  <span className="text-xs font-medium text-gray-500">100</span>
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-gray-900 mb-1">{data.readiness.score}%</div>
              <div className="text-xs text-gray-600">Exam Readiness Score</div>
            </div>

            <div className="text-center mb-4 space-y-1">
              <div className="text-xs text-gray-700">Based on {data.readiness.totalQuestions.toLocaleString()} questions answered</div>
              <div className="text-xs text-blue-600 font-medium">Top {data.readiness.percentile}% of students</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-amber-800 mb-1">Focus Area: {data.readiness.weakestTopic.name}</div>
                  <div className="text-xs text-amber-700 mb-2">{data.readiness.weakestTopic.percentile}th percentile - {data.readiness.weakestTopic.accuracy}% accuracy</div>
                  <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-orange-600 transition-colors w-full">
                    Improve with {data.readiness.weakestTopic.questionsNeeded} questions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Peer Performance Comparison */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Peer Performance Comparison</h3>
            <div className="text-sm text-gray-500">{data.peerComparison.totalPeers.toLocaleString()} GP trainees</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="performance-card blue">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">{data.peerComparison.overallPercentile}</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Overall Percentile</h4>
              <p className="text-sm text-gray-600">You're performing better than {data.peerComparison.overallPercentile}% of GP trainees</p>
            </div>

            <div className="performance-card green">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Strongest Area</h4>
              <p className="text-sm text-green-700 font-medium">{strongestArea.name}</p>
              <p className="text-sm text-gray-600">{strongestArea.percentile}th percentile</p>
            </div>

            <div className="performance-card red">
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
                  {data.peerComparison.categories.map((category, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">{category.name}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-semibold ${getScoreColor(category.status)}`}>{category.userScore}%</span>
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-gray-700">{category.percentile}th</td>
                      <td className="py-4 px-4 text-center text-gray-600">{category.peerAverage}%</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`status-badge ${getStatusColor(category.status)}`}>
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

        {/* Study Insights */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Personalized Study Insights</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-red-500" />
                <span className="text-sm text-gray-700">Focus on your weakest area ({weakestArea.name}) to improve fastest.</span>
              </div>
              <span className="text-red-600 font-medium text-sm">+15% boost potential</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">You're excelling in {strongestArea.name} - maintain this advantage.</span>
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
      </main>
    </div>
  )
}