import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Heart, 
  Brain, 
  Pill, 
  Bone, 
  Eye, 
  Ear, 
  Wind,
  Activity,
  Filter,
  Star,
  Shuffle,
  Play,
  Loader2
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  questionCount?: number;
  completedCount?: number;
  highYieldCount?: number;
  icon?: React.ReactNode;
}

interface CategorySelectorProps {
  onCategorySelect: (categoryIds: string[]) => void;
  userTier: "free" | "premium";
}

export default function CategorySelector({ onCategorySelect, userTier }: CategorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showHighYieldOnly, setShowHighYieldOnly] = useState(false);

  // Fetch categories from API
  const { data: categoriesData = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  // Fetch questions to calculate counts
  const { data: questionsData = [] } = useQuery({
    queryKey: ['/api/questions'],
    queryFn: async () => {
      const response = await fetch('/api/questions?categories=all');
      if (!response.ok) throw new Error('Failed to fetch questions');
      return response.json();
    }
  });

  // Map category names to icons
  const getIconForCategory = (name: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Cardiology': <Heart className="h-6 w-6" />,
      'Neurology': <Brain className="h-6 w-6" />,
      'Pharmacology': <Pill className="h-6 w-6" />,
      'Anatomy': <Bone className="h-6 w-6" />,
      'Ophthalmology': <Eye className="h-6 w-6" />,
      'ENT': <Ear className="h-6 w-6" />,
      'Otolaryngology': <Ear className="h-6 w-6" />,
      'Pulmonology': <Wind className="h-6 w-6" />,
      'Emergency Medicine': <Activity className="h-6 w-6" />,
      'Emergency': <Activity className="h-6 w-6" />
    };
    return iconMap[name] || <Activity className="h-6 w-6" />;
  };

  // Process categories with question counts
  const categoriesWithCounts: Category[] = categoriesData.map((cat: any) => {
    const categoryQuestions = questionsData.filter((q: any) => q.categoryId === cat.id);
    const highYieldQuestions = categoryQuestions.filter((q: any) => q.isHighYield);
    
    return {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      questionCount: categoryQuestions.length,
      completedCount: 0, // Would be calculated from user progress
      highYieldCount: highYieldQuestions.length,
      icon: getIconForCategory(cat.name)
    };
  });

  // Filter categories based on user tier
  const availableCategories = userTier === "premium" 
    ? categoriesWithCounts
    : categoriesWithCounts.slice(0, 3); // Free users get first 3 categories

  // Filter categories based on search
  const filteredCategories = availableCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getCompletionPercent = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const handleSelectAll = () => {
    setSelectedCategories(availableCategories.map(cat => cat.id));
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  const handleStartPractice = () => {
    if (selectedCategories.length > 0) {
      onCategorySelect(selectedCategories);
    }
  };

  const handleRandomPractice = () => {
    onCategorySelect(availableCategories.map(cat => cat.id));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Choose a Category</h1>
        <p className="text-muted-foreground">
          Select a medical specialty to practice questions
        </p>
      </div>

      {/* Search and Options */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-category-search"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="high-yield"
              checked={showHighYieldOnly}
              onCheckedChange={(checked) => setShowHighYieldOnly(checked === true)}
              data-testid="checkbox-high-yield"
            />
            <label
              htmlFor="high-yield"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
            >
              <Star className="h-4 w-4 text-yellow-500" />
              High Yield Only
            </label>
          </div>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {selectedCategories.length} categories selected
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            data-testid="button-select-all"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            data-testid="button-clear-all"
          >
            Clear All
          </Button>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <Button
            onClick={handleRandomPractice}
            className="gap-2"
            data-testid="button-random-practice"
          >
            <Shuffle className="h-4 w-4" />
            Practice All Random
          </Button>
          <Button
            onClick={handleStartPractice}
            disabled={selectedCategories.length === 0}
            className="gap-2"
            data-testid="button-start-selected"
          >
            <Play className="h-4 w-4" />
            Start Practice ({selectedCategories.length})
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const completionPercent = getCompletionPercent(category.completedCount || 0, category.questionCount || 0);
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <Card 
              key={category.id}
              className={`hover-elevate transition-all duration-200 ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              data-testid={`card-category-${category.id}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleCategoryToggle(category.id, checked as boolean)}
                      data-testid={`checkbox-${category.id}`}
                    />
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {category.highYieldCount} High Yield
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Total Questions</span>
                    <div className="font-medium">{category.questionCount}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">High Yield</span>
                    <div className="font-medium text-yellow-600">{category.highYieldCount}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {category.completedCount}/{category.questionCount}
                    </span>
                  </div>
                  <Progress value={completionPercent} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {completionPercent}% complete
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Premium Locked Categories */}
      {userTier === "free" && categoriesWithCounts.length > availableCategories.length && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium text-muted-foreground">Premium Categories</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesWithCounts.slice(3).map((category: Category) => (
              <Card key={category.id} className="opacity-60 relative">
                <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center z-10">
                  <div className="text-center">
                    <p className="font-medium text-foreground mb-2">Premium Only</p>
                    <Button size="sm" data-testid="button-unlock-premium">
                      Upgrade to Access
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {category.questionCount} questions available
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}