import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit2, Trash2, Upload, Download, Search, FileText } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
}

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
  category?: Category;
}

interface QuestionFormData {
  categoryId: string;
  questionText: string;
  questionImage?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  isHighYield: boolean;
}

export default function AdminQuestions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [bulkData, setBulkData] = useState("");
  const [formData, setFormData] = useState<QuestionFormData>({
    categoryId: "",
    questionText: "",
    questionImage: "",
    options: ["", "", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    isHighYield: false
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/admin/categories'],
  });

  // Fetch questions
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['/api/admin/questions'],
  });

  // Create question mutation
  const createMutation = useMutation({
    mutationFn: async (data: QuestionFormData) => {
      return apiRequest('POST', '/api/admin/questions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/questions'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Question created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create question.",
        variant: "destructive",
      });
    }
  });

  // Update question mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: QuestionFormData }) => {
      return apiRequest('PUT', `/api/admin/questions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/questions'] });
      setEditingQuestion(null);
      resetForm();
      toast({
        title: "Success",
        description: "Question updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update question.",
        variant: "destructive",
      });
    }
  });

  // Delete question mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/admin/questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/questions'] });
      toast({
        title: "Success",
        description: "Question deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to delete question.",
        variant: "destructive",
      });
    }
  });

  // Bulk import mutation
  const bulkImportMutation = useMutation({
    mutationFn: async (questions: QuestionFormData[]) => {
      return apiRequest('POST', '/api/admin/questions/bulk', { questions });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/questions'] });
      setIsBulkDialogOpen(false);
      setBulkData("");
      toast({
        title: "Success",
        description: "Questions imported successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to import questions.",
        variant: "destructive",
      });
    }
  });

  const filteredQuestions = questions.filter((question: Question) => {
    const matchesSearch = question.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || question.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      categoryId: "",
      questionText: "",
      questionImage: "",
      options: ["", "", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      isHighYield: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId || !formData.questionText.trim()) {
      toast({
        title: "Error",
        description: "Category and question text are required.",
        variant: "destructive",
      });
      return;
    }

    const filledOptions = formData.options.filter(opt => opt.trim() !== "");
    if (filledOptions.length < 2) {
      toast({
        title: "Error",
        description: "At least 2 options are required.",
        variant: "destructive",
      });
      return;
    }

    const submissionData = {
      ...formData,
      options: filledOptions
    };

    if (editingQuestion) {
      updateMutation.mutate({ id: editingQuestion.id, data: submissionData });
    } else {
      createMutation.mutate(submissionData);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      categoryId: question.categoryId,
      questionText: question.questionText,
      questionImage: question.questionImage || "",
      options: [...question.options, "", "", "", "", ""].slice(0, 5),
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      isHighYield: question.isHighYield
    });
  };

  const handleCloseDialog = () => {
    setEditingQuestion(null);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleBulkImport = () => {
    try {
      const lines = bulkData.trim().split('\n');
      const parsedQuestions: QuestionFormData[] = [];

      for (const line of lines) {
        if (!line.trim()) continue;
        
        const parts = line.split('|').map(part => part.trim());
        if (parts.length < 8) {
          throw new Error('Invalid format. Each line should have: Category|Question|Option1|Option2|Option3|Option4|Option5|CorrectAnswer|Explanation|IsHighYield');
        }

        const categoryName = parts[0];
        const category = categories.find((cat: Category) => cat.name.toLowerCase() === categoryName.toLowerCase());
        if (!category) {
          throw new Error(`Category "${categoryName}" not found`);
        }

        const options = [parts[2], parts[3], parts[4], parts[5], parts[6]].filter(opt => opt);
        const correctAnswer = parseInt(parts[7]) - 1; // Convert to 0-based index
        
        if (correctAnswer < 0 || correctAnswer >= options.length) {
          throw new Error(`Invalid correct answer for question: ${parts[1]}`);
        }

        parsedQuestions.push({
          categoryId: category.id,
          questionText: parts[1],
          questionImage: parts[10] || undefined, // Optional image URL
          options,
          correctAnswer,
          explanation: parts[8] || "",
          isHighYield: parts[9]?.toLowerCase() === 'true' || false
        });
      }

      bulkImportMutation.mutate(parsedQuestions);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Question Management</h1>
          <p className="text-muted-foreground">
            Manage exam questions and organize them by categories
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="button-bulk-import">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Bulk Import Questions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Format each question on a new line using the pipe (|) separator:</p>
                  <code className="block p-2 bg-muted rounded text-xs">
                    Category|Question|Option1|Option2|Option3|Option4|Option5|CorrectAnswer|Explanation|IsHighYield|ImageURL
                  </code>
                  <p className="mt-2 text-xs">
                    • CorrectAnswer should be 1-5 (1 = first option)<br/>
                    • IsHighYield should be true or false<br/>
                    • You can omit Option5 and ImageURL if not needed
                  </p>
                </div>
                <Textarea
                  placeholder="Paste your questions here..."
                  value={bulkData}
                  onChange={(e) => setBulkData(e.target.value)}
                  rows={12}
                  data-testid="textarea-bulk-data"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsBulkDialogOpen(false)}
                    data-testid="button-cancel-bulk"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleBulkImport}
                    disabled={bulkImportMutation.isPending || !bulkData.trim()}
                    data-testid="button-submit-bulk"
                  >
                    {bulkImportMutation.isPending ? "Importing..." : "Import Questions"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-question">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Question</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: Category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isHighYield"
                      checked={formData.isHighYield}
                      onCheckedChange={(checked) => setFormData({ ...formData, isHighYield: checked as boolean })}
                      data-testid="checkbox-high-yield"
                    />
                    <Label htmlFor="isHighYield">High Yield Question</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="questionText">Question Text *</Label>
                  <Textarea
                    id="questionText"
                    value={formData.questionText}
                    onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                    placeholder="Enter the question..."
                    rows={3}
                    data-testid="textarea-question-text"
                  />
                </div>

                <div>
                  <Label htmlFor="questionImage">Question Image (Optional)</Label>
                  <Input
                    id="questionImage"
                    value={formData.questionImage || ""}
                    onChange={(e) => setFormData({ ...formData, questionImage: e.target.value })}
                    placeholder="Enter image URL or upload path..."
                    data-testid="input-question-image"
                  />
                  {formData.questionImage && (
                    <div className="mt-2">
                      <img 
                        src={formData.questionImage} 
                        alt="Question preview" 
                        className="max-w-sm max-h-40 object-contain border rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label>Answer Options *</Label>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={formData.correctAnswer === index}
                          onChange={() => setFormData({ ...formData, correctAnswer: index })}
                          data-testid={`radio-correct-${index}`}
                        />
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}${index < 2 ? ' (required)' : ''}`}
                          data-testid={`input-option-${index}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="explanation">Explanation</Label>
                  <Textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Explain the correct answer..."
                    rows={3}
                    data-testid="textarea-explanation"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseDialog}
                    data-testid="button-cancel-create"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending}
                    data-testid="button-submit-create"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Question"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-questions"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48" data-testid="select-filter-category">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({filteredQuestions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm || selectedCategory !== "all" ? "No questions found matching your filters." : "No questions created yet."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestions.map((question: Question) => {
                  const category = categories.find((cat: Category) => cat.id === question.categoryId);
                  return (
                    <TableRow key={question.id} data-testid={`row-question-${question.id}`}>
                      <TableCell className="max-w-md">
                        <div className="truncate">{question.questionText}</div>
                        <div className="text-sm text-muted-foreground">
                          {question.options.length} options
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {category?.name || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {question.isHighYield && (
                          <Badge variant="secondary">High Yield</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(question.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog 
                            open={editingQuestion?.id === question.id} 
                            onOpenChange={(open) => !open && setEditingQuestion(null)}
                          >
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(question)}
                                data-testid={`button-edit-${question.id}`}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Edit Question</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-category">Category *</Label>
                                    <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                                      <SelectTrigger data-testid="select-edit-category">
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {categories.map((category: Category) => (
                                          <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="edit-isHighYield"
                                      checked={formData.isHighYield}
                                      onCheckedChange={(checked) => setFormData({ ...formData, isHighYield: checked as boolean })}
                                      data-testid="checkbox-edit-high-yield"
                                    />
                                    <Label htmlFor="edit-isHighYield">High Yield Question</Label>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="edit-questionText">Question Text *</Label>
                                  <Textarea
                                    id="edit-questionText"
                                    value={formData.questionText}
                                    onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                                    placeholder="Enter the question..."
                                    rows={3}
                                    data-testid="textarea-edit-question-text"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="edit-questionImage">Question Image (Optional)</Label>
                                  <Input
                                    id="edit-questionImage"
                                    value={formData.questionImage || ""}
                                    onChange={(e) => setFormData({ ...formData, questionImage: e.target.value })}
                                    placeholder="Enter image URL or upload path..."
                                    data-testid="input-edit-question-image"
                                  />
                                  {formData.questionImage && (
                                    <div className="mt-2">
                                      <img 
                                        src={formData.questionImage} 
                                        alt="Question preview" 
                                        className="max-w-sm max-h-40 object-contain border rounded"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <Label>Answer Options *</Label>
                                  <div className="space-y-2">
                                    {formData.options.map((option, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <input
                                          type="radio"
                                          name="editCorrectAnswer"
                                          checked={formData.correctAnswer === index}
                                          onChange={() => setFormData({ ...formData, correctAnswer: index })}
                                          data-testid={`radio-edit-correct-${index}`}
                                        />
                                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                                        <Input
                                          value={option}
                                          onChange={(e) => updateOption(index, e.target.value)}
                                          placeholder={`Option ${index + 1}${index < 2 ? ' (required)' : ''}`}
                                          data-testid={`input-edit-option-${index}`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="edit-explanation">Explanation</Label>
                                  <Textarea
                                    id="edit-explanation"
                                    value={formData.explanation}
                                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                    placeholder="Explain the correct answer..."
                                    rows={3}
                                    data-testid="textarea-edit-explanation"
                                  />
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handleCloseDialog}
                                    data-testid="button-cancel-edit"
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    type="submit" 
                                    disabled={updateMutation.isPending}
                                    data-testid="button-submit-edit"
                                  >
                                    {updateMutation.isPending ? "Updating..." : "Update Question"}
                                  </Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                data-testid={`button-delete-${question.id}`}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Question</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this question? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-testid="button-cancel-delete">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(question.id)}
                                  disabled={deleteMutation.isPending}
                                  data-testid="button-confirm-delete"
                                >
                                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}