-- Create course categories table
CREATE TABLE public.course_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.course_categories(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  estimated_duration_hours INTEGER,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create course modules table
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, order_index)
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(module_id, order_index)
);

-- Create lesson content table (stores videos, text, quizzes, assignments, transcripts)
CREATE TABLE public.lesson_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('video', 'text', 'transcript', 'quiz', 'assignment')),
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(lesson_id, order_index)
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE(course_id, student_id)
);

-- Create lesson progress table
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(enrollment_id, lesson_id)
);

-- Create assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_content_id UUID NOT NULL REFERENCES public.lesson_content(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  due_date TIMESTAMPTZ,
  max_points INTEGER NOT NULL DEFAULT 100,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('file', 'text', 'both')),
  allowed_file_types TEXT[],
  max_file_size_mb INTEGER DEFAULT 10,
  grading_criteria TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create assignment submissions table
CREATE TABLE public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  submission_text TEXT,
  file_url TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  grade INTEGER,
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES public.profiles(id),
  UNIQUE(assignment_id, student_id)
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_content_id UUID NOT NULL REFERENCES public.lesson_content(id) ON DELETE CASCADE,
  passing_score INTEGER NOT NULL DEFAULT 70,
  allow_retakes BOOLEAN NOT NULL DEFAULT true,
  time_limit_minutes INTEGER,
  max_attempts INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'true_false', 'short_answer')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(quiz_id, order_index)
);

-- Create quiz attempts table
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  score INTEGER,
  passed BOOLEAN,
  attempt_number INTEGER NOT NULL DEFAULT 1
);

-- Create quiz answers table
CREATE TABLE public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  points_earned INTEGER NOT NULL DEFAULT 0,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create course reviews table
CREATE TABLE public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, student_id)
);

-- Create course announcements table
CREATE TABLE public.course_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  certificate_url TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(enrollment_id)
);

-- Create indexes for better performance
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_category ON public.courses(category_id);
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_course_modules_course ON public.course_modules(course_id);
CREATE INDEX idx_lessons_module ON public.lessons(module_id);
CREATE INDEX idx_lesson_content_lesson ON public.lesson_content(lesson_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_lesson_progress_enrollment ON public.lesson_progress(enrollment_id);
CREATE INDEX idx_assignment_submissions_assignment ON public.assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_student ON public.assignment_submissions(student_id);
CREATE INDEX idx_quiz_attempts_quiz ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_student ON public.quiz_attempts(student_id);

-- Enable RLS on all tables
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_categories (public read)
CREATE POLICY "Anyone can view categories"
  ON public.course_categories FOR SELECT
  USING (true);

-- RLS Policies for courses
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (status = 'published' OR instructor_id = auth.uid());

CREATE POLICY "Instructors can create courses"
  ON public.courses FOR INSERT
  WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Instructors can update their courses"
  ON public.courses FOR UPDATE
  USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can delete their courses"
  ON public.courses FOR DELETE
  USING (auth.uid() = instructor_id);

-- RLS Policies for course_modules
CREATE POLICY "Users can view modules of accessible courses"
  ON public.course_modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND (c.status = 'published' OR c.instructor_id = auth.uid())
    )
  );

CREATE POLICY "Instructors can manage modules in their courses"
  ON public.course_modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.instructor_id = auth.uid()
    )
  );

-- RLS Policies for lessons
CREATE POLICY "Users can view lessons of accessible courses"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.course_modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = module_id AND (c.status = 'published' OR c.instructor_id = auth.uid())
    )
  );

CREATE POLICY "Instructors can manage lessons in their courses"
  ON public.lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.course_modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = module_id AND c.instructor_id = auth.uid()
    )
  );

-- RLS Policies for lesson_content
CREATE POLICY "Users can view content of accessible lessons"
  ON public.lesson_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons l
      JOIN public.course_modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE l.id = lesson_id AND (c.status = 'published' OR c.instructor_id = auth.uid())
    )
  );

CREATE POLICY "Instructors can manage content in their courses"
  ON public.lesson_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons l
      JOIN public.course_modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE l.id = lesson_id AND c.instructor_id = auth.uid()
    )
  );

-- RLS Policies for enrollments
CREATE POLICY "Students can view their enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Instructors can view enrollments in their courses"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can enroll in courses"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their enrollments"
  ON public.enrollments FOR UPDATE
  USING (auth.uid() = student_id);

-- RLS Policies for lesson_progress
CREATE POLICY "Students can view their progress"
  ON public.lesson_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = enrollment_id AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can manage their progress"
  ON public.lesson_progress FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = enrollment_id AND e.student_id = auth.uid()
    )
  );

-- RLS Policies for assignments
CREATE POLICY "Users can view assignments in accessible courses"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lesson_content lc
      JOIN public.lessons l ON l.id = lc.lesson_id
      JOIN public.course_modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE lc.id = lesson_content_id AND (c.status = 'published' OR c.instructor_id = auth.uid())
    )
  );

CREATE POLICY "Instructors can manage assignments"
  ON public.assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.lesson_content lc
      JOIN public.lessons l ON l.id = lc.lesson_id
      JOIN public.course_modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE lc.id = lesson_content_id AND c.instructor_id = auth.uid()
    )
  );

-- RLS Policies for assignment_submissions
CREATE POLICY "Students can view their submissions"
  ON public.assignment_submissions FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Instructors can view submissions for their courses"
  ON public.assignment_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.lesson_content lc ON lc.id = a.lesson_content_id
      JOIN public.lessons l ON l.id = lc.lesson_id
      JOIN public.course_modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE a.id = assignment_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can submit assignments"
  ON public.assignment_submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their submissions"
  ON public.assignment_submissions FOR UPDATE
  USING (auth.uid() = student_id AND graded_at IS NULL);

CREATE POLICY "Instructors can grade submissions"
  ON public.assignment_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.lesson_content lc ON lc.id = a.lesson_content_id
      JOIN public.lessons l ON l.id = lc.lesson_id
      JOIN public.course_modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE a.id = assignment_id AND c.instructor_id = auth.uid()
    )
  );

-- RLS Policies for quizzes
CREATE POLICY "Users can view quizzes in accessible courses"
  ON public.quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lesson_content lc
      JOIN public.lessons l ON l.id = lc.lesson_id
      JOIN public.course_modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE lc.id = lesson_content_id AND (c.status = 'published' OR c.instructor_id = auth.uid())
    )
  );

CREATE POLICY "Instructors can manage quizzes"
  ON public.quizzes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.lesson_content lc
      JOIN public.lessons l ON l.id = lc.lesson_id
      JOIN public.course_modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE lc.id = lesson_content_id AND c.instructor_id = auth.uid()
    )
  );

-- RLS Policies for quiz_questions
CREATE POLICY "Users can view questions in accessible quizzes"
  ON public.quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.lesson_content lc ON lc.id = q.lesson_content_id
      JOIN public.lessons l ON l.id = lc.lesson_id
      JOIN public.course_modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE q.id = quiz_id AND (c.status = 'published' OR c.instructor_id = auth.uid())
    )
  );

CREATE POLICY "Instructors can manage quiz questions"
  ON public.quiz_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.lesson_content lc ON lc.id = q.lesson_content_id
      JOIN public.lessons l ON l.id = lc.lesson_id
      JOIN public.course_modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE q.id = quiz_id AND c.instructor_id = auth.uid()
    )
  );

-- RLS Policies for quiz_attempts
CREATE POLICY "Students can view their attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Instructors can view attempts for their courses"
  ON public.quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.lesson_content lc ON lc.id = q.lesson_content_id
      JOIN public.lessons l ON l.id = lc.lesson_id
      JOIN public.course_modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE q.id = quiz_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can create attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their attempts"
  ON public.quiz_attempts FOR UPDATE
  USING (auth.uid() = student_id);

-- RLS Policies for quiz_answers
CREATE POLICY "Students can view their answers"
  ON public.quiz_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      WHERE qa.id = attempt_id AND qa.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can submit answers"
  ON public.quiz_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      WHERE qa.id = attempt_id AND qa.student_id = auth.uid()
    )
  );

-- RLS Policies for course_reviews
CREATE POLICY "Anyone can view reviews"
  ON public.course_reviews FOR SELECT
  USING (true);

CREATE POLICY "Enrolled students can create reviews"
  ON public.course_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = student_id AND
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = course_id AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can update their reviews"
  ON public.course_reviews FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Students can delete their reviews"
  ON public.course_reviews FOR DELETE
  USING (auth.uid() = student_id);

-- RLS Policies for course_announcements
CREATE POLICY "Enrolled users can view announcements"
  ON public.course_announcements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND (
        c.instructor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.enrollments e
          WHERE e.course_id = c.id AND e.student_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Instructors can manage announcements"
  ON public.course_announcements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.instructor_id = auth.uid()
    )
  );

-- RLS Policies for certificates
CREATE POLICY "Students can view their certificates"
  ON public.certificates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = enrollment_id AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can view certificates for their courses"
  ON public.certificates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.courses c ON c.id = e.course_id
      WHERE e.id = enrollment_id AND c.instructor_id = auth.uid()
    )
  );

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
  BEFORE UPDATE ON public.course_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_content_updated_at
  BEFORE UPDATE ON public.lesson_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_reviews_updated_at
  BEFORE UPDATE ON public.course_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();