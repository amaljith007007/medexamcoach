# Medical Exam Question Bank - Design Guidelines

## Design Approach
**Selected Approach**: Design System (Material Design) - Utility-focused application prioritizing efficiency, learnability, and content accessibility for medical professionals studying for exams.

**Justification**: Medical education platforms require clear information hierarchy, minimal cognitive load, and consistent patterns that don't distract from learning content.

## Core Design Elements

### Color Palette
**Primary Colors**:
- Light mode: 200 85% 35% (deep medical blue)
- Dark mode: 200 85% 65% (lighter medical blue)

**Background Colors**:
- Light mode: 210 20% 98% (clean white-blue)
- Dark mode: 215 25% 8% (deep blue-gray)

**Accent Colors**:
- Success: 145 65% 45% (medical green for correct answers)
- Warning: 25 90% 55% (amber for warnings)
- Error: 0 75% 50% (red for incorrect answers)

### Typography
- **Primary Font**: Inter (Google Fonts) - excellent readability for medical content
- **Headings**: 600-700 weight, sizes from text-lg to text-3xl
- **Body Text**: 400-500 weight, text-sm to text-base
- **Code/Numbers**: JetBrains Mono for question numbers and timers

### Layout System
**Spacing Units**: Consistent use of Tailwind units 2, 4, 6, and 8
- `p-4` for card padding
- `gap-6` for section spacing  
- `m-8` for page margins
- `space-y-2` for form elements

### Component Library

**Navigation**: 
- Clean top navbar with logo, progress indicators, and user menu
- Sidebar navigation for question categories (desktop)
- Bottom tab navigation (mobile)

**Cards**: 
- Question cards with subtle shadows and rounded corners
- Progress cards showing statistics with colored progress bars
- Subscription tier cards with clear pricing

**Forms**: 
- Clean input fields with proper focus states
- Multiple choice with radio buttons and clear selection states
- Form validation with inline error messages

**Data Display**:
- Progress rings for completion percentages
- Score badges with color-coded performance levels
- Question difficulty indicators
- Timer displays with countdown animations

**Interactive Elements**:
- Primary buttons: Solid blue background
- Secondary buttons: Outline style with blue border
- Answer selection: Clear hover and selected states
- Navigation: Breadcrumbs and pagination controls

### Key Design Principles
1. **Content First**: Question text and explanations are the primary focus
2. **Clear Hierarchy**: Important actions (Next Question, Submit) are visually prominent
3. **Progress Clarity**: Always show user progress and performance
4. **Minimal Distraction**: Clean backgrounds that don't compete with content
5. **Responsive Design**: Optimized for both mobile study sessions and desktop practice

### Animations
**Minimal and Purposeful**:
- Subtle fade-ins for new questions
- Progress bar animations for completion
- Simple loading states for data fetching
- No distracting or decorative animations

## Images
No hero images required. This is a utility-focused medical education platform where content takes precedence over marketing visuals. Any imagery should be:
- Medical icons for categories (anatomy, pharmacology, etc.)
- Simple illustrations for complex medical concepts in explanations
- Clean avatars for user profiles
- Badge/achievement icons for progress milestones

The design should feel professional, trustworthy, and conducive to focused studying - similar to established medical education platforms but with modern, clean aesthetics.