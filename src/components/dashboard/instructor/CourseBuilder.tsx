import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, Eye, Upload, Settings, BookOpen, Video, FileText, Star, Clock, DollarSign, Users, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { CourseStructureFlow } from "./CourseStructureFlow";
import { ContentCreationStep } from "./ContentCreationStep";
import { LessonWithContent } from "./ContentTypes";

interface CourseData {
  basics: {
    title: string;
    subtitle: string;
    description: string;
    category: string;
    level: string;
    language: string;
    thumbnail: string;
  };
  structure: {
    sections: Section[];
  };
  content: {
    totalDuration: number;
    totalLessons: number;
  };
  pricing: {
    price: number;
    currency: string;
    promotionalPrice?: number;
    freePreview: boolean;
  };
  settings: {
    published: boolean;
    enrollmentLimit: number;
    certificateEnabled: boolean;
  };
}

interface Section {
  id: string;
  title: string;
  description: string;
  lessons: LessonWithContent[];
  isExpanded: boolean;
}

interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | "assignment";
  duration: number;
  isPreview: boolean;
}

const steps = [
  { id: 1, name: "Course Basics", description: "Title, description & category", icon: BookOpen },
  { id: 2, name: "Course Structure", description: "Organize sections & lessons", icon: Settings },
  { id: 3, name: "Content Creation", description: "Upload videos & materials", icon: Video },
  { id: 4, name: "Pricing & Access", description: "Set pricing & permissions", icon: DollarSign },
  { id: 5, name: "Review & Publish", description: "Final review & go live", icon: Eye },
];

export function CourseBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseData>({
    basics: {
      title: "",
      subtitle: "",
      description: "",
      category: "",
      level: "",
      language: "",
      thumbnail: "",
    },
    structure: {
      sections: []
    },
    content: {
      totalDuration: 0,
      totalLessons: 0,
    },
    pricing: {
      price: 0,
      currency: "USD",
      freePreview: false,
    },
    settings: {
      published: false,
      enrollmentLimit: 0,
      certificateEnabled: false,
    }
  });

  const updateCourseData = (section: keyof CourseData, data: any) => {
    setCourseData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepProgress = () => {
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: "",
      description: "",
      lessons: [],
      isExpanded: true,
    };
    setCourseData(prev => ({
      ...prev,
      structure: {
        sections: [...prev.structure.sections, newSection]
      }
    }));
    
    // Scroll to new section after a brief delay to ensure it's rendered
    setTimeout(() => {
      const newSectionElement = document.getElementById(newSection.id);
      if (newSectionElement) {
        newSectionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const addLesson = (sectionId: string) => {
    const newLesson: LessonWithContent = {
      id: `lesson-${Date.now()}`,
      title: "",
      description: "",
      contentItems: [],
      isPublished: false,
      estimatedDuration: 0,
    };
    setCourseData(prev => ({
      ...prev,
      structure: {
        sections: prev.structure.sections.map(section =>
          section.id === sectionId
            ? { ...section, lessons: [...section.lessons, newLesson] }
            : section
        )
      }
    }));
  };

  const updateSection = (sectionId: string, field: string, value: string) => {
    setCourseData(prev => ({
      ...prev,
      structure: {
        sections: prev.structure.sections.map(section =>
          section.id === sectionId
            ? { ...section, [field]: value }
            : section
        )
      }
    }));
  };

  const updateLesson = (sectionId: string, lessonId: string, field: string, value: string) => {
    setCourseData(prev => ({
      ...prev,
      structure: {
        sections: prev.structure.sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                lessons: section.lessons.map(lesson =>
                  lesson.id === lessonId
                    ? { ...lesson, [field]: value }
                    : lesson
                )
              }
            : section
        )
      }
    }));
  };

  const deleteSection = (sectionId: string) => {
    setCourseData(prev => ({
      ...prev,
      structure: {
        sections: prev.structure.sections.filter(section => section.id !== sectionId)
      }
    }));
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    setCourseData(prev => ({
      ...prev,
      structure: {
        sections: prev.structure.sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
              }
            : section
        )
      }
    }));
  };

  const renderBasicsStep = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>Course Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete React Development Course 2024"
                  value={courseData.basics.title}
                  onChange={(e) => updateCourseData("basics", { title: e.target.value })}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Course Subtitle</Label>
                <Input
                  id="subtitle"
                  placeholder="A brief, compelling subtitle that explains what students will learn"
                  value={courseData.basics.subtitle}
                  onChange={(e) => updateCourseData("basics", { subtitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn, prerequisites, and outcomes..."
                  value={courseData.basics.description}
                  onChange={(e) => updateCourseData("basics", { description: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={courseData.basics.category} onValueChange={(value) => updateCourseData("basics", { category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level *</Label>
                  <Select value={courseData.basics.level} onValueChange={(value) => updateCourseData("basics", { level: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language *</Label>
                  <Select value={courseData.basics.language} onValueChange={(value) => updateCourseData("basics", { language: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Thumbnail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-sm font-medium">Upload course thumbnail</p>
                  <p className="text-xs text-muted-foreground">Recommended: 1280x720px</p>
                </div>
                <Button variant="outline" size="sm">Choose File</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Success</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Use a clear, descriptive title that includes your main topic</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Write a compelling description that explains the value students will get</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Choose the most specific category that fits your course</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderStructureStep = () => (
    <div className="space-y-10">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="space-y-8">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="sticky top-24 md:top-20 z-30 border-b border-border/50 bg-card/95 backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg font-medium">Course Structure</span>
                </CardTitle>
                <Button onClick={addSection} size="sm" variant="outline" className="border-primary/20 hover:bg-primary hover:text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {courseData.structure.sections.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-border/40 rounded-2xl bg-muted/20">
                  <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center mx-auto mb-6">
                    <Settings className="w-8 h-8 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-3">Start Building Your Course</h3>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                    Organize your content into logical sections that guide students through their learning journey
                  </p>
                  <Button onClick={addSection} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Section
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {courseData.structure.sections.map((section, index) => (
                    <Card key={section.id} id={section.id} className="border-l-4 border-l-primary/40 bg-background shadow-sm">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">
                            Section {index + 1}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteSection(section.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-3 mt-4">
                          <Input
                            placeholder="Enter section title..."
                            value={section.title}
                            onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                            className="text-lg font-medium border-0 px-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/60"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <Textarea
                          placeholder="Describe what students will learn in this section..."
                          value={section.description}
                          onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                          rows={2}
                          className="resize-none border-border/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                        />
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-muted-foreground">Lessons</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addLesson(section.id)}
                              className="text-primary hover:bg-primary/10 h-8 px-3 text-sm"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Lesson
                            </Button>
                          </div>
                          
                          {section.lessons.length === 0 ? (
                            <div className="text-center py-8 border border-dashed border-border/40 rounded-xl bg-muted/10">
                              <p className="text-sm text-muted-foreground mb-3">No lessons yet</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addLesson(section.id)}
                                className="border-dashed border-primary/40 text-primary hover:bg-primary/10"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add First Lesson
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {section.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="group flex items-center space-x-3 p-4 bg-muted/20 hover:bg-muted/30 rounded-xl border border-transparent hover:border-border/40 transition-all">
                                  <div className="flex items-center space-x-3 flex-1">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                      <span className="text-xs font-medium text-primary">{lessonIndex + 1}</span>
                                    </div>
                                    <Input
                                      placeholder="Enter lesson title..."
                                      value={lesson.title}
                                      onChange={(e) => updateLesson(section.id, lesson.id, 'title', e.target.value)}
                                      className="border-0 bg-transparent focus-visible:ring-0 font-medium placeholder:text-muted-foreground/60"
                                    />
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => deleteLesson(section.id, lesson.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-card/50">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-accent" />
                </div>
                <span className="text-lg font-medium">Visual Course Flow</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[28rem] border border-border/40 rounded-xl overflow-hidden bg-muted/10">
                <CourseStructureFlow sections={courseData.structure.sections} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-card/50">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-secondary-foreground" />
                </div>
                <span className="text-lg font-medium">Structure Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Logical Organization</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Group related content into sections with 5-7 lessons each for optimal learning flow
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Progressive Difficulty</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Start with fundamentals and gradually introduce more complex concepts
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Practical Application</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Include hands-on exercises and real-world examples in each section
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderContentStep = () => {
    // Convert lesson structure to content structure for the new system
    const sectionsWithContent = courseData.structure.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || "",
        contentItems: lesson.contentItems || [],
        isPublished: lesson.isPublished || false,
        estimatedDuration: lesson.estimatedDuration || 0,
      }))
    }));

    return (
      <ContentCreationStep 
        sections={sectionsWithContent}
        onUpdateSections={(updatedSections) => {
          setCourseData(prev => ({
            ...prev,
            structure: { sections: updatedSections }
          }));
        }}
      />
    );
  };

  const renderPricingStep = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span>Pricing Strategy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Course Price *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="99"
                    value={courseData.pricing.price}
                    onChange={(e) => updateCourseData("pricing", { price: Number(e.target.value) })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={courseData.pricing.currency} onValueChange={(value) => updateCourseData("pricing", { currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="freePreview">Free Preview</Label>
                  <p className="text-sm text-muted-foreground">Allow students to preview some lessons</p>
                </div>
                <Switch
                  id="freePreview"
                  checked={courseData.pricing.freePreview}
                  onCheckedChange={(checked) => updateCourseData("pricing", { freePreview: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Access Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="enrollmentLimit">Enrollment Limit</Label>
              <Input
                id="enrollmentLimit"
                type="number"
                placeholder="0 for unlimited"
                value={courseData.settings.enrollmentLimit}
                onChange={(e) => updateCourseData("settings", { enrollmentLimit: Number(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">Leave 0 for unlimited enrollment</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="certificate">Certificate of Completion</Label>
                <p className="text-sm text-muted-foreground">Students receive a certificate when they complete the course</p>
              </div>
              <Switch
                id="certificate"
                checked={courseData.settings.certificateEnabled}
                onCheckedChange={(checked) => updateCourseData("settings", { certificateEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Course Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{courseData.basics.title || "Untitled Course"}</h3>
              <p className="text-muted-foreground">{courseData.basics.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium">{courseData.basics.category || "Not selected"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Level:</span>
                <p className="font-medium">{courseData.basics.level || "Not selected"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Sections:</span>
                <p className="font-medium">{courseData.structure.sections.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Price:</span>
                <p className="font-medium">${courseData.pricing.price}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button size="lg" className="w-full bg-gradient-to-r from-primary to-accent text-white">
                <Globe className="w-5 h-5 mr-2" />
                Publish Course
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <Eye className="w-5 h-5 mr-2" />
                Save as Draft
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>By publishing, you agree to our course quality guidelines and content policy.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderBasicsStep();
      case 2: return renderStructureStep();
      case 3: return renderContentStep();
      case 4: return renderPricingStep();
      case 5: return renderReviewStep();
      default: return renderBasicsStep();
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Elegant Header */}
      <div className="border border-border/50 rounded-3xl bg-card/50 backdrop-blur-sm">
        <div className="p-12">
          <div className="flex items-start justify-between mb-10">
            <div className="space-y-3">
              <h1 className="text-5xl font-light tracking-tight text-foreground">Course Builder</h1>
              <p className="text-xl text-muted-foreground font-light">Craft exceptional learning experiences</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-border/50">
                Step {currentStep} of {steps.length}
              </Badge>
            </div>
          </div>

          {/* Elegant Progress Steps */}
          <div className="relative">
            <div className="absolute top-6 left-6 right-6 h-px bg-border/30" />
            <Progress value={getStepProgress()} className="h-1 mb-12 bg-border/20" />
            
            <div className="flex justify-between relative">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center space-y-4 relative">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                      isCompleted ? "bg-primary border-primary text-white shadow-lg shadow-primary/25" :
                      isActive ? "bg-background border-primary text-primary shadow-lg shadow-primary/10" :
                      "bg-background border-border/50 text-muted-foreground hover:border-border"
                    }`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                    </div>
                    <div className="text-center max-w-32">
                      <p className={`text-sm font-medium leading-tight ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-96">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            Save Draft
          </Button>
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent"
          >
            <span>{currentStep === steps.length ? "Publish Course" : "Next"}</span>
            {currentStep < steps.length && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}