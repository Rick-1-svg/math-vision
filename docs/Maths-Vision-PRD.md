# PRODUCT REQUIREMENTS DOCUMENT

# Maths Vision
## Mathematical Equation Visualization Platform

**Version:** 1.0 (MVP)  
**Document Date:** January 31, 2026  
**Status:** Draft  
**Confidentiality:** Internal Use Only

---

## Document Control

| **Field** | **Details** |
|-----------|-------------|
| **Product Owner** | [To be assigned] |
| **Technical Lead** | [To be assigned] |
| **Target Audience** | High school students, College students, Self-learners |
| **Development Timeline** | 1 weeks |
| **Last Updated** | January 31, 2026 |

---

## Executive Summary

### Product Vision
Maths Vision is a web-based educational platform that transforms mathematical equations into interactive visual representations, enabling students and learners to understand the nature and behavior of mathematical functions through dynamic graphing and real-time parameter manipulation.

### Problem Statement
Students struggle to connect abstract mathematical notation with visual representations, leading to:
- Difficulty understanding equation behavior and characteristics
- Time-consuming manual graphing exercises
- Limited ability to explore "what-if" scenarios with parameter changes
- Gap between symbolic mathematics and geometric intuition

### Solution Overview
A responsive web application that accepts mathematical equations via text input and generates:
- Interactive 2D graphs with zoom/pan capabilities
- Dynamic parameter controls for real-time equation manipulation
- Educational annotations explaining equation properties and nature
- Mobile-optimized interface for learning anywhere

### Success Metrics (KPIs)
- **User Engagement:** 70% of users visualize at least 3 equations per session
- **Feature Adoption:** 60% of users interact with parameter sliders
- **Mobile Usage:** 40%+ of traffic from mobile devices
- **User Satisfaction:** 4.0+ star rating on feedback surveys
- **Performance:** Graph rendering in < 2 seconds
- **Retention:** 30% weekly active user retention

---

## Product Scope

### In Scope (MVP)
1. Text-based equation input system
2. Support for 7 equation categories (see Section 5.1)
3. 2D interactive graph visualization
4. Dynamic parameter manipulation (3-5 parameters per equation)
5. Educational explanations and property displays
6. Mobile-responsive design (320px - 1920px)
7. Dark mode support
8. User authentication (optional login for saving work)
9. Basic equation history (last 10 equations)

### Out of Scope (Future Versions)
1. Image upload with OCR for handwritten equations
2. 3D graph visualization
3. Multiple equations on same graph (comparison mode)
4. Advanced calculus operations (derivatives, integrals)
5. Social features (sharing, collaboration)
6. Equation library with community contributions
7. Video tutorials and guided lessons
8. Export to PDF/PNG
9. API access for third-party integrations
10. Premium subscription features

---

## User Personas

### Persona 1: High School Student (Emma, 16)
**Background:**
- Taking Algebra II and Pre-Calculus
- Visual learner who struggles with abstract concepts
- Uses mobile phone for 60% of studying
- Limited math confidence

**Goals:**
- Understand how equation coefficients affect graph shape
- Visualize homework problems quickly
- Build intuition for test preparation

**Pain Points:**
- Graphing calculator is confusing
- Can't easily experiment with equation variations
- Needs to see concepts, not just formulas

**How Maths Vision Helps:**
- Instant visualization of textbook equations
- Slider controls to see coefficient effects in real-time
- Clear explanations of what each parameter does

---

### Persona 2: College Student (Marcus, 20)
**Background:**
- Engineering major taking Calculus III
- Comfortable with technology
- Studies late at night, often on tablet
- Needs quick reference tool

**Goals:**
- Verify graphing homework answers
- Explore complex equation behaviors
- Understand transcendental curves for exams

**Pain Points:**
- Desktop graphing software too heavy for quick checks
- Online calculators lack interactivity
- Needs mobile-friendly solution

**How Maths Vision Helps:**
- Lightweight web app, no installation
- Works on any device
- Parameter manipulation for deeper understanding

---

### Persona 3: Self-Learner (Sarah, 35)
**Background:**
- Career changer learning data science
- Relearning mathematics fundamentals
- Studies during commute and breaks
- Motivated but needs scaffolding

**Goals:**
- Build foundational math understanding
- See practical applications of equations
- Learn at own pace with visual feedback

**Pain Points:**
- Intimidated by advanced math tools
- Needs beginner-friendly explanations
- Limited time for complex software

**How Maths Vision Helps:**
- Simple, intuitive interface
- Educational annotations in plain language
- Focus on understanding over computation

---

## Functional Requirements

### 5.1 Equation Input System

#### 5.1.1 Text Input Interface
**Priority:** P0 (Critical)

**Requirements:**
- Single-line text input field accepting mathematical notation
- Real-time syntax validation with error highlighting
- Support for standard mathematical symbols: `^` (exponent), `*` (multiply), `/` (divide), `+`, `-`, `sqrt()`, `log()`, `ln()`, `sin()`, `cos()`, `tan()`, `e`, `pi`
- Auto-completion suggestions for common functions
- Clear error messages for invalid syntax

**Supported Equation Types:**

1. **Quadratic Equations**
   - Format: `ax^2 + bx + c`
   - Example: `x^2 + 2x - 3`, `2x^2 - 4x + 1`
   - Parameters: a, b, c

2. **Algebraic Curves - Circle**
   - Format: `x^2 + y^2 = r^2`
   - Example: `x^2 + y^2 = 25`
   - Parameters: r (radius)

3. **Algebraic Curves - Ellipse**
   - Format: `(x^2/a^2) + (y^2/b^2) = 1`
   - Example: `x^2/25 + y^2/9 = 1`
   - Parameters: a, b (semi-axes)

4. **Algebraic Curves - Hyperbola**
   - Format: `(x^2/a^2) - (y^2/b^2) = 1`
   - Example: `x^2/16 - y^2/9 = 1`
   - Parameters: a, b

5. **Cubic Equations**
   - Format: `ax^3 + bx^2 + cx + d`
   - Example: `x^3 - 2x^2 + x - 1`
   - Parameters: a, b, c, d

6. **Exponential Curves**
   - Format: `a * e^(bx) + c`
   - Example: `2 * e^x`, `e^(0.5x) + 1`
   - Parameters: a, b, c

7. **Logarithmic Curves**
   - Format: `a * log(bx) + c` or `a * ln(bx) + c`
   - Example: `log(x)`, `2 * ln(x) + 1`
   - Parameters: a, b, c

8. **Trigonometric Curves - Sine**
   - Format: `a * sin(bx + c) + d`
   - Example: `sin(x)`, `2 * sin(3x + 1)`
   - Parameters: a (amplitude), b (frequency), c (phase), d (vertical shift)

9. **Trigonometric Curves - Cosine**
   - Format: `a * cos(bx + c) + d`
   - Example: `cos(x)`, `3 * cos(2x)`
   - Parameters: a, b, c, d

**Input Validation Rules:**
- Maximum equation length: 200 characters
- Only alphanumeric characters and mathematical operators allowed
- Must contain at least one variable (x or y)
- Reject potentially harmful input (SQL injection, XSS attempts)

**User Experience:**
- Placeholder text with example equation
- "Clear" button to reset input
- Keyboard shortcut support (Enter to visualize)

---

#### 5.1.2 Preset Equation Library
**Priority:** P1 (High)

**Requirements:**
- 15-20 preset equations covering all supported types
- Quick-select buttons for one-click loading
- Organized by category (Quadratic, Exponential, etc.)
- Visual preview thumbnails (optional for MVP)

**Preset Examples:**
- Quadratic: `x^2`, `x^2 - 4`, `2x^2 + 3x - 5`
- Circle: `x^2 + y^2 = 25`
- Exponential: `e^x`, `2^x`
- Sine: `sin(x)`, `2*sin(3x)`
- Logarithmic: `log(x)`, `ln(x)`

---

### 5.2 Graph Visualization System

#### 5.2.1 2D Graph Rendering
**Priority:** P0 (Critical)

**Requirements:**
- Render equation graphs on 2D Cartesian coordinate system
- Graph dimensions: Minimum 400x400px, responsive to container
- Smooth curve interpolation (minimum 500 data points)
- Automatic axis scaling based on equation type
- Grid lines with labeled axes

**Visual Elements:**
- X-axis and Y-axis with tick marks
- Origin point (0,0) clearly marked
- Graph curve in distinctive color (default: #2D5BFF)
- Background grid (toggleable)
- Axis labels with units

**Default Viewing Windows:**
- Quadratic/Cubic: x ∈ [-10, 10], y ∈ [-10, 10]
- Circle/Ellipse: Centered, symmetric view
- Exponential: x ∈ [-5, 5], y auto-scaled
- Logarithmic: x ∈ [0.1, 10], y auto-scaled
- Trigonometric: x ∈ [-2π, 2π], y ∈ [-amplitude-2, amplitude+2]

---

#### 5.2.2 Interactive Controls
**Priority:** P0 (Critical)

**Requirements:**
- **Zoom:** Mouse wheel / pinch-to-zoom on mobile
  - Zoom range: 0.5x to 10x
  - Zoom increments: 10% per scroll
  - Center-focused zoom

- **Pan:** Click-and-drag / touch-and-drag
  - Smooth panning with momentum
  - Constrained to reasonable bounds
  - Return to origin button

- **Reset View:** Single button to restore default zoom/pan
- **Fullscreen Mode:** Expand graph to full viewport (mobile)

**Performance Requirements:**
- Maintain 60 FPS during pan/zoom operations
- Debounce pan events to 16ms (60 FPS)
- Render updates within 100ms of user interaction

---

#### 5.2.3 Graph Annotations
**Priority:** P1 (High)

**Requirements:**
- Automatically plot key features based on equation type:
  - **Quadratic:** Vertex, axis of symmetry, x-intercepts (roots)
  - **Circle/Ellipse:** Center point, radii lines
  - **Cubic:** Inflection points, local extrema
  - **Exponential/Log:** Asymptotes (dashed lines)
  - **Trigonometric:** Amplitude markers, period markers

- Visual markers:
  - Points: Circles (5px diameter) in contrasting color
  - Lines: Dashed for asymptotes, solid for axes
  - Labels: Text annotations with coordinates

**Toggle Controls:**
- Show/hide annotations checkbox
- Show/hide grid checkbox
- Show/hide axis labels checkbox

---

### 5.3 Parameter Manipulation System

#### 5.3.1 Dynamic Parameter Detection
**Priority:** P0 (Critical)

**Requirements:**
- Automatically identify adjustable parameters in equation
- Parse equation AST (Abstract Syntax Tree) to extract coefficients
- Support parameters labeled: a, b, c, d, r, h, k
- Display parameter names with current values

**Parameter Mapping Examples:**
- `ax^2 + bx + c` → Parameters: a, b, c
- `a * sin(bx + c) + d` → Parameters: a, b, c, d
- `x^2 + y^2 = r^2` → Parameter: r

---

#### 5.3.2 Slider Controls
**Priority:** P0 (Critical)

**Requirements:**
- One slider per detected parameter (max 5 sliders)
- Slider specifications:
  - Range: Auto-determined based on equation type (typically -10 to 10)
  - Step size: 0.1 for continuous parameters
  - Initial value: Extracted from equation or default to 1
  
- Real-time graph updates as slider moves
- Debounce slider input to 100ms for performance

**UI Components:**
- Slider label with parameter name (e.g., "Amplitude (a)")
- Current value display (numeric, 2 decimal places)
- Reset button to restore original value
- Input field for precise value entry

**Visual Feedback:**
- Graph smoothly animates to new state (200ms transition)
- Parameter value updates in real-time
- Highlight active slider during manipulation

---

#### 5.3.3 Parameter Constraints
**Priority:** P1 (High)

**Requirements:**
- Prevent invalid parameter values:
  - Circle radius: r > 0
  - Ellipse semi-axes: a > 0, b > 0
  - Logarithm base: x > 0
  
- Display warning messages for invalid combinations
- Automatically clamp values to valid ranges
- Show constraint information in tooltips

---

### 5.4 Educational Content System

#### 5.4.1 Equation Analysis
**Priority:** P0 (Critical)

**Requirements:**
- Automatically classify equation type on input
- Display equation classification (e.g., "Quadratic Parabola")
- Show standardized form of equation

**Analysis Components:**

1. **Equation Type Card**
   - Title: Equation name (e.g., "Quadratic Function")
   - Description: One-sentence explanation
   - Standard form notation

2. **Properties Panel**
   - 4-6 key mathematical properties per equation type
   - Computed values (not just formulas)
   - Organized in labeled sections

**Example Properties by Type:**

**Quadratic (ax² + bx + c):**
- Vertex coordinates: (h, k)
- Axis of symmetry: x = h
- Direction: Opens upward/downward
- Discriminant: b² - 4ac
- Number of real roots: 0, 1, or 2
- Y-intercept: c

**Circle (x² + y² = r²):**
- Center: (h, k)
- Radius: r
- Diameter: 2r
- Circumference: 2πr
- Area: πr²

**Exponential (ae^bx):**
- Base: e (≈ 2.718)
- Growth/Decay: Based on sign of b
- Y-intercept: a
- Horizontal asymptote: y = 0
- Domain: All real numbers
- Range: y > 0 (for standard form)

**Sine/Cosine (a·sin(bx + c) + d):**
- Amplitude: |a|
- Period: 2π/b
- Phase shift: -c/b
- Vertical shift: d
- Range: [d - |a|, d + |a|]

---

#### 5.4.2 Nature of Equation
**Priority:** P1 (High)

**Requirements:**
- Plain-language explanation of equation behavior
- 2-3 sentences describing visual characteristics
- Highlight real-world applications (when relevant)

**Example Explanations:**

- **Quadratic:** "A parabola is a U-shaped curve that represents acceleration, projectile motion, and optimization problems. The vertex represents the maximum or minimum point, and the axis of symmetry divides the curve into mirror images."

- **Exponential:** "Exponential functions model rapid growth or decay, such as population growth, radioactive decay, or compound interest. The curve never touches the x-axis (horizontal asymptote) and grows increasingly steep."

- **Sine Wave:** "Sine waves represent periodic oscillation, found in sound waves, ocean tides, and alternating current. The wave repeats every 2π units with smooth, continuous peaks and valleys."

---

#### 5.4.3 Educational Annotations
**Priority:** P2 (Medium)

**Requirements:**
- Inline tooltips on graph features
- Hover over vertex → "This is the minimum/maximum point"
- Hover over asymptote → "The graph approaches but never touches this line"
- Contextual help icons with expandable info

---

### 5.5 User Interface Requirements

#### 5.5.1 Layout Structure
**Priority:** P0 (Critical)

**Desktop Layout (≥1024px):**
```
+----------------------------------+
|          Header / Logo           |
+----------------------------------+
|  Input Panel  |   Graph Panel    |
|  (30% width)  |   (70% width)    |
|               |                  |
|  - Equation   |  - Interactive   |
|  - Presets    |    Graph         |
|  - Parameters |  - Controls      |
|               |                  |
+----------------------------------+
|      Analysis & Properties       |
|         (Full Width)             |
+----------------------------------+
```

**Mobile Layout (<768px):**
```
+------------------+
|   Header/Logo    |
+------------------+
|  Equation Input  |
+------------------+
|  Graph (Square)  |
+------------------+
|   Parameters     |
+------------------+
|   Properties     |
+------------------+
```

---

#### 5.5.2 Responsive Breakpoints
**Priority:** P0 (Critical)

**Requirements:**
- Mobile: 320px - 767px
  - Single column layout
  - Square graph aspect ratio
  - Collapsible panels
  - Touch-optimized controls (44px min touch target)

- Tablet: 768px - 1023px
  - Two-column layout
  - Graph takes 60% width
  - Larger touch targets

- Desktop: 1024px+
  - Three-panel layout
  - Maximum content width: 1600px
  - Mouse-optimized interactions

**Testing Devices:**
- iPhone SE (375px)
- iPhone 14 Pro (393px)
- iPad (768px)
- Desktop (1920px)

---

#### 5.5.3 Dark Mode
**Priority:** P0 (Critical)

**Requirements:**
- System preference detection (prefers-color-scheme)
- Manual toggle switch in header
- Persist user preference in localStorage
- Smooth transition between modes (300ms)

**Color Palette:**

**Light Mode:**
- Background: #FFFFFF
- Surface: #F5F7FA
- Text Primary: #1A1A1A
- Text Secondary: #666666
- Primary: #2D5BFF
- Accent: #00D9FF

**Dark Mode:**
- Background: #0A0E27
- Surface: #141B3D
- Text Primary: #E8ECF5
- Text Secondary: #8B92B0
- Primary: #2D5BFF (unchanged)
- Accent: #00D9FF (unchanged)

**Graph-Specific:**
- Light Mode Graph BG: #FFFFFF
- Dark Mode Graph BG: #1E2447
- Grid lines adjust opacity in each mode

---

#### 5.5.4 Accessibility
**Priority:** P1 (High)

**Requirements:**
- WCAG 2.1 AA compliance
- Keyboard navigation for all interactive elements
- Tab order: Input → Presets → Visualize → Parameters → Graph controls
- Focus indicators (2px outline, high contrast)
- ARIA labels for all controls
- Screen reader announcements for graph updates
- Alt text for all visual elements
- Minimum contrast ratio 4.5:1 for text
- Resizable text up to 200% without loss of functionality

**Keyboard Shortcuts:**
- Enter: Visualize equation
- Escape: Clear input
- Space: Toggle between light/dark mode
- Arrow keys: Navigate sliders
- +/-: Zoom in/out on graph

---

### 5.6 User Authentication (Optional)

#### 5.6.1 Authentication System
**Priority:** P2 (Medium)

**Requirements:**
- Optional login (app works without account)
- Supabase Authentication integration
- Support email/password and Google OAuth
- Remember user preference (7-day session)

**User Flows:**
- Guest users can use all features except saving
- Logged-in users can save equation history
- One-click login with Google
- Email verification for new accounts

---

#### 5.6.2 Equation History
**Priority:** P2 (Medium)

**Requirements:**
- Save last 5 equations per user
- Display in sidebar dropdown
- One-click to reload previous equation
- Delete individual history items
- Clear all history option

**Data Stored:**
- Equation string
- Timestamp
- Parameter values (if modified)

---

## Non-Functional Requirements

### 6.1 Performance

**Requirements:**
- **Page Load Time:** < 3 seconds on 3G connection
- **Time to Interactive (TTI):** < 5 seconds
- **Graph Rendering:** < 2 seconds for any equation
- **Parameter Update:** < 100ms response time
- **Lighthouse Score:** ≥ 90 for Performance, Accessibility

**Optimization Strategies:**
- Code splitting for Math.js and Plotly.js
- Lazy load components below fold
- Debounce slider inputs (100ms)
- Memoize expensive calculations
- Use Web Workers for heavy math computations

---

### 6.2 Security

**Priority:** P0 (Critical)

**Security Requirements:**

1. **Environment Variables**
   - NEVER store API keys in source code
   - Use `.env` file for all secrets
   - Add `.env` to `.gitignore`
   - Use different keys for dev/staging/production

2. **Input Validation**
   - Sanitize all user input before processing
   - Prevent code injection (eval, Function constructor)
   - Maximum input length: 200 characters
   - Whitelist allowed characters: `a-zA-Z0-9 +-*/^().,`

3. **Supabase Row Level Security (RLS)**
   - Enable RLS on all tables
   - Users can only read/write their own data
   - No public write access
   - Audit logs for data changes

4. **HTTPS Only**
   - Force HTTPS in production
   - Secure cookie flags
   - HSTS headers
   - CSP (Content Security Policy) headers

5. **Authentication Security**
   - Password minimum 8 characters
   - Rate limiting on login (5 attempts per 15 min)
   - Email verification required
   - Secure session management

**Code Review Checklist:**
- [ ] No hardcoded credentials
- [ ] All inputs validated
- [ ] RLS policies enabled
- [ ] HTTPS enforced
- [ ] Dependencies updated (no known vulnerabilities)

---

### 6.3 Scalability

**Requirements:**
- Support 1,000 concurrent users
- Handle 10,000 equation renders per day
- Database: Support 10,000 user accounts
- Response time < 2s under load

**Infrastructure:**
- Serverless deployment (Vercel/Netlify)
- CDN for static assets
- Supabase for auto-scaling database
- Client-side rendering for graphs (reduce server load)

---

### 6.4 Browser Compatibility

**Supported Browsers:**
- Chrome 100+ (primary)
- Safari 15+ (iOS support)
- Firefox 100+
- Edge 100+

**Not Supported:**
- Internet Explorer (any version)
- Browsers older than 2 years

**Progressive Enhancement:**
- Core functionality works without JavaScript (basic form submission)
- Graceful degradation for older browsers
- Feature detection for advanced APIs

---

### 6.5 Maintainability

**Code Quality Requirements:**
- **Clean Code Principles:**
  - Functions < 50 lines
  - Components < 300 lines
  - Clear, descriptive variable names
  - Comments for complex logic

- **Documentation:**
  - README with setup instructions
  - Inline JSDoc comments for functions
  - Component prop documentation
  - API endpoint documentation

- **Code Organization:**
  - MVVM architecture pattern
  - Separate concerns (View, ViewModel, Model)
  - Reusable utility functions
  - Consistent file naming conventions

**File Structure:**
```
src/
├── components/          # View layer (React components)
│   ├── Input/
│   ├── Graph/
│   ├── Parameters/
│   └── Analysis/
├── viewmodels/          # ViewModel layer (business logic)
│   ├── EquationViewModel.js
│   ├── GraphViewModel.js
│   └── ParameterViewModel.js
├── models/              # Model layer (data structures)
│   ├── Equation.js
│   ├── GraphData.js
│   └── UserPreferences.js
├── services/            # External services
│   ├── supabaseClient.js
│   ├── mathEngine.js
│   └── graphRenderer.js
├── utils/               # Helper functions
│   ├── validators.js
│   ├── parsers.js
│   └── formatters.js
├── hooks/               # Custom React hooks
│   ├── useEquation.js
│   ├── useGraph.js
│   └── useAuth.js
└── styles/              # CSS/Tailwind configs
```

---

## Technical Architecture

### 7.1 Technology Stack

**Frontend:**
- **Framework:** React 18.2+
- **Build Tool:** Vite 5.0+
- **Styling:** Tailwind CSS 3.4+, PostCSS, Custom CSS
- **State Management:** React Context API + hooks
- **Routing:** React Router v6 (if multi-page)

**Backend/Database:**
- **BaaS:** Supabase
  - PostgreSQL database
  - Authentication
  - Row Level Security

**Mathematical Processing:**
- **Math.js 12.2+**
  - Equation parsing
  - Expression evaluation
  - Symbolic computation

**Data Visualization:**
- **Plotly.js 2.27+**
  - 2D graph rendering
  - Interactive controls
  - Export capabilities

**Development Tools:**
- **Package Manager:** npm or pnpm
- **Version Control:** Git + GitHub
- **Code Editor:** VS Code (recommended)
- **Linting:** ESLint
- **Formatting:** Prettier

---

### 7.2 Architecture Pattern: MVVM

**Model-View-ViewModel Pattern:**

```
┌─────────────────────────────────────────┐
│              VIEW (React)               │
│  ┌──────────┐  ┌──────────┐            │
│  │  Input   │  │  Graph   │            │
│  │Component │  │Component │            │
│  └──────────┘  └──────────┘            │
└────────┬────────────────┬───────────────┘
         │                │
         ▼                ▼
┌─────────────────────────────────────────┐
│         VIEWMODEL (Business Logic)      │
│  ┌─────────────────┐  ┌──────────────┐ │
│  │EquationViewModel│  │GraphViewModel│ │
│  │ - parseEquation │  │- generateData│ │
│  │ - validate      │  │- updateGraph │ │
│  └─────────────────┘  └──────────────┘ │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│       MODEL (Data + Services)           │
│  ┌──────────┐  ┌─────────┐             │
│  │ Equation │  │ Math.js │             │
│  │  Model   │  │ Service │             │
│  └──────────┘  └─────────┘             │
│  ┌──────────┐  ┌─────────┐             │
│  │Supabase  │  │Plotly.js│             │
│  │ Service  │  │ Service │             │
│  └──────────┘  └─────────┘             │
└─────────────────────────────────────────┘
```

**Benefits:**
- Separation of concerns
- Testable business logic
- Reusable components
- Easier maintenance

---

### 7.3 Data Models

#### 7.3.1 Equation Model
```javascript
class Equation {
  id: string;           // UUID
  rawInput: string;     // User input: "x^2 + 2x - 3"
  parsedExpression: object; // Math.js parsed AST
  type: EquationType;   // QUADRATIC, EXPONENTIAL, etc.
  parameters: Parameter[]; // Detected parameters
  standardForm: string; // "ax² + bx + c"
  createdAt: Date;
  userId: string | null; // null for guests
}

enum EquationType {
  QUADRATIC = 'quadratic',
  CIRCLE = 'circle',
  ELLIPSE = 'ellipse',
  HYPERBOLA = 'hyperbola',
  CUBIC = 'cubic',
  EXPONENTIAL = 'exponential',
  LOGARITHMIC = 'logarithmic',
  SINE = 'sine',
  COSINE = 'cosine',
  LINEAR = 'linear',
  UNKNOWN = 'unknown'
}
```

#### 7.3.2 Parameter Model
```javascript
class Parameter {
  name: string;        // 'a', 'b', 'c', etc.
  value: number;       // Current value
  defaultValue: number; // Original value
  min: number;         // Minimum allowed
  max: number;         // Maximum allowed
  step: number;        // Slider increment
  label: string;       // Display name: "Amplitude (a)"
}
```

#### 7.3.3 Graph Data Model
```javascript
class GraphData {
  xValues: number[];   // Array of x coordinates
  yValues: number[];   // Array of y coordinates
  annotations: Annotation[]; // Special points
  viewWindow: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  };
  features: GraphFeature[]; // Roots, vertices, etc.
}

class Annotation {
  type: string;        // 'vertex', 'root', 'asymptote'
  x: number;
  y: number;
  label: string;
}
```

---

### 7.4 Database Schema (Supabase)

#### Tables:

**users** (managed by Supabase Auth)
- id (UUID, PK)
- email (string)
- created_at (timestamp)
- last_login (timestamp)

**equations** (user equation history)
```sql
CREATE TABLE equations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  equation_text TEXT NOT NULL,
  equation_type VARCHAR(50),
  parameters JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT equations_text_length CHECK (char_length(equation_text) <= 200)
);

-- Row Level Security
ALTER TABLE equations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own equations"
  ON equations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own equations"
  ON equations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own equations"
  ON equations FOR DELETE
  USING (auth.uid() = user_id);
```

**user_preferences** (settings)
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  dark_mode BOOLEAN DEFAULT false,
  default_graph_style VARCHAR(50) DEFAULT 'standard',
  show_grid BOOLEAN DEFAULT true,
  show_annotations BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);
```

---

### 7.5 API Integration

#### 7.5.1 Supabase Client Setup
```javascript
// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// CRITICAL: Use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 7.5.2 Environment Variables (.env)
```bash
# NEVER commit this file to Git!
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 7.5.3 .gitignore Configuration
```
# Environment variables (CRITICAL)
.env
.env.local
.env.production

# Dependencies
node_modules/

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/
```

---

### 7.6 Math Processing Pipeline

**Flow:**
```
User Input → Sanitize → Parse → Classify → Analyze → Render
```

**Step-by-Step:**

1. **Sanitize Input**
   - Remove unsafe characters
   - Validate length (< 200 chars)
   - Check for injection attempts

2. **Parse Expression**
   ```javascript
   import { parse, compile } from 'mathjs'
   
   const node = parse('x^2 + 2x - 3')
   const compiled = compile(node)
   ```

3. **Classify Equation**
   - Pattern matching on AST
   - Detect equation type
   - Extract parameters

4. **Analyze Properties**
   - Calculate roots, vertices, etc.
   - Determine domain/range
   - Identify asymptotes

5. **Generate Graph Data**
   - Create x-value array
   - Evaluate function at each point
   - Handle undefined values (e.g., log of negative)

6. **Render with Plotly**
   - Pass data to Plotly.js
   - Configure layout and styling
   - Enable interactivity

---

## User Flows

### 8.1 Primary User Flow: Visualize Equation

**Actor:** Student (Guest or Logged In)

**Preconditions:** User has opened the web app

**Main Flow:**

1. User lands on home page
2. User sees equation input field with placeholder example
3. User types equation: `x^2 + 3x - 4`
4. App shows real-time validation (green checkmark if valid)
5. User clicks "Visualize" button or presses Enter
6. App displays loading spinner (< 2 seconds)
7. Graph renders showing parabola
8. Analysis panel shows:
   - "Quadratic Function"
   - Vertex: (-1.5, -6.25)
   - Roots: x = -4, x = 1
   - Opens upward
9. Parameter sliders appear for a, b, c
10. User adjusts "a" slider from 1 to 2
11. Graph smoothly updates in real-time
12. User explores different parameter values
13. User clicks preset "sin(x)" button
14. Graph updates to show sine wave
15. User zooms in on interesting region
16. (Optional) User saves equation to history

**Alternate Flow 1:** Invalid Input
- Step 3a: User types invalid equation: `x^^ 2`
- App shows error message: "Invalid syntax near ^^"
- User corrects input
- Continue from step 4

**Alternate Flow 2:** Unsupported Equation
- Step 3b: User types: `x^4 + x^3` (quartic, not yet supported)
- App shows warning: "This equation type isn't supported yet. Try a quadratic, exponential, or trigonometric function."
- User selects preset equation
- Continue from step 13

**Postconditions:**
- Graph is displayed
- User understands equation behavior
- (Optional) Equation saved to history

---

### 8.2 User Flow: Parameter Manipulation

**Actor:** Student

**Preconditions:** Equation is visualized with parameters

**Main Flow:**

1. User sees equation `a*sin(b*x)` on graph
2. Parameter panel shows:
   - Amplitude (a): 1.0
   - Frequency (b): 1.0
3. User drags "a" slider to 2.5
4. Graph updates smoothly (200ms animation)
5. Amplitude annotation updates to show new range [-2.5, 2.5]
6. User types "3" into the "b" input field
7. Graph updates to show 3 complete cycles
8. User clicks "Reset" button on "a" parameter
9. Slider returns to 1.0, graph updates
10. User explores different combinations

**Postconditions:**
- User understands parameter effects
- Graph reflects current parameter values

---

### 8.3 User Flow: Mobile Usage

**Actor:** High School Student on iPhone

**Preconditions:** Student is on mobile device

**Main Flow:**

1. Student opens app on iPhone Safari
2. Page loads in mobile layout (single column)
3. Student taps equation input field
4. Keyboard appears with number/symbol keys
5. Student types: `e^x`
6. Student taps "Visualize" button (44px touch target)
7. Graph renders in square aspect ratio
8. Student uses two-finger pinch to zoom in
9. Student drags graph to pan
10. Parameter slider for exponential appears
11. Student adjusts slider with thumb
12. Graph updates smoothly without lag
13. Student taps "Show Analysis" (collapsed by default on mobile)
14. Analysis panel expands with smooth animation
15. Student reads properties
16. Student collapses panel to see more of graph

**Postconditions:**
- Smooth mobile experience
- All features accessible
- No performance issues

---

## Testing Strategy

### 9.1 Testing Types

**Unit Testing:**
- Math.js parser functions
- Equation classifier logic
- Parameter extraction
- Validation functions

**Integration Testing:**
- Input → Parse → Render flow
- Supabase authentication
- Database operations

**E2E Testing:**
- Complete user flows
- Multi-device testing
- Performance benchmarks

**Manual Testing:**
- Visual QA on all breakpoints
- Cross-browser compatibility
- Accessibility audit

---

### 9.2 Test Cases

#### Test Case 1: Valid Quadratic Input
```
Given: User inputs "x^2 + 2x - 3"
When: User clicks Visualize
Then: 
  - Graph renders parabola
  - Vertex shown at (-1, -4)
  - Parameters a=1, b=2, c=-3 detected
  - "Quadratic Function" label displayed
```

#### Test Case 2: Parameter Slider Update
```
Given: Equation "a*sin(x)" is visualized with a=1
When: User moves "a" slider to 3
Then:
  - Graph updates within 100ms
  - Amplitude changes from 1 to 3
  - Y-axis rescales to [-3, 3]
  - Smooth animation occurs
```

#### Test Case 3: Invalid Input Handling
```
Given: User inputs "x^^2"
When: User clicks Visualize
Then:
  - Error message displays
  - Graph area shows empty state
  - Input field highlights in red
  - Helpful suggestion shown
```

#### Test Case 4: Mobile Responsiveness
```
Given: User opens app on 375px viewport (iPhone)
When: Page loads
Then:
  - Single column layout renders
  - Touch targets ≥ 44px
  - Graph is square aspect ratio
  - All features accessible
```

#### Test Case 5: Dark Mode Toggle
```
Given: App is in light mode
When: User clicks dark mode toggle
Then:
  - Colors switch within 300ms
  - Preference saved to localStorage
  - Graph background adjusts
  - Text remains readable (4.5:1 contrast)
```

---

### 9.3 Performance Testing

**Metrics to Monitor:**
- Lighthouse Performance Score: Target ≥ 90
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 5s
- Graph render time: < 2s
- Slider response time: < 100ms

**Load Testing:**
- Simulate 100 concurrent users
- Monitor server response times
- Check database query performance
- Verify CDN caching

---

## Development Phases

### 10.1 Phase 1: Foundation (Week 1-2)

**Goals:**
- Set up development environment
- Implement basic UI layout
- Integrate Math.js and Plotly.js

**Deliverables:**
- [ ] Vite + React project initialized
- [ ] Tailwind CSS configured
- [ ] Basic component structure created
- [ ] Input field with validation
- [ ] Empty graph placeholder

**Success Criteria:**
- App runs locally without errors
- Input field accepts text
- Basic layout responsive on mobile/desktop

---

### 10.2 Phase 2: Core Features (Week 2-4)

**Goals:**
- Implement equation parsing
- Build graph rendering
- Add parameter detection

**Deliverables:**
- [ ] Math.js parser integrated
- [ ] Equation classifier working
- [ ] Plotly.js graphs rendering
- [ ] Support for 7 equation types
- [ ] Parameter sliders functional
- [ ] Real-time graph updates

**Success Criteria:**
- All 7 equation types render correctly
- Parameters update graphs smoothly
- Zoom/pan controls work
- No performance issues

---

### 10.3 Phase 3: Educational Content (Week 4-5)

**Goals:**
- Add equation analysis
- Display properties
- Write educational descriptions

**Deliverables:**
- [ ] Equation type classifier
- [ ] Property calculator for each type
- [ ] Analysis panel UI
- [ ] Educational descriptions written
- [ ] Graph annotations (vertices, roots, etc.)

**Success Criteria:**
- Properties calculate correctly
- Descriptions are clear and accurate
- Annotations render on graph

---

### 10.4 Phase 4: Backend Integration (Week 5-6)

**Goals:**
- Set up Supabase
- Implement authentication
- Add equation history

**Deliverables:**
- [ ] Supabase project created
- [ ] Database schema implemented
- [ ] Row Level Security enabled
- [ ] Authentication flow working
- [ ] Equation save/load functionality
- [ ] User preferences storage

**Success Criteria:**
- Users can sign up/login
- Equations persist in database
- RLS policies enforced
- No security vulnerabilities

---

### 10.5 Phase 5: Polish & Testing (Week 6-7)

**Goals:**
- Dark mode implementation
- Accessibility improvements
- Bug fixes
- Performance optimization

**Deliverables:**
- [ ] Dark mode fully functional
- [ ] Keyboard navigation working
- [ ] ARIA labels added
- [ ] Loading states polished
- [ ] Error handling comprehensive
- [ ] Code commented and documented

**Success Criteria:**
- WCAG 2.1 AA compliant
- Lighthouse scores ≥ 90
- All test cases pass
- No critical bugs

---

### 10.6 Phase 6: Deployment (Week 7-8)

**Goals:**
- Deploy to production
- Monitor performance
- Gather user feedback

**Deliverables:**
- [ ] Vercel deployment configured
- [ ] Custom domain connected
- [ ] Analytics set up
- [ ] Error tracking enabled
- [ ] User feedback form created
- [ ] Documentation published

**Success Criteria:**
- App accessible at production URL
- HTTPS enabled
- No deployment errors
- Monitoring active

---

## Coding Standards

### 11.1 Clean Code Principles

**Naming Conventions:**
```javascript
// Components: PascalCase
const EquationInput = () => { }

// Functions: camelCase, descriptive verbs
const parseEquation = (input) => { }
const validateInput = (text) => { }

// Constants: UPPER_SNAKE_CASE
const MAX_EQUATION_LENGTH = 200
const DEFAULT_ZOOM_LEVEL = 1.0

// Variables: camelCase, descriptive nouns
const equationText = "x^2 + 2x - 3"
const graphData = { xValues: [], yValues: [] }
```

**Function Guidelines:**
```javascript
// ✅ GOOD: Single responsibility, < 50 lines
const calculateVertex = (a, b, c) => {
  const h = -b / (2 * a)
  const k = a * h * h + b * h + c
  return { x: h, y: k }
}

// ❌ BAD: Too many responsibilities
const processEquation = (input) => {
  // Validates, parses, analyzes, renders - too much!
}
```

**Comments:**
```javascript
// ✅ GOOD: Explain WHY, not WHAT
// Debounce to prevent excessive re-renders during slider drag
const debouncedUpdate = debounce(updateGraph, 100)

// ❌ BAD: Stating the obvious
// Set the equation to the input value
setEquation(input)
```

---

### 11.2 React Best Practices

**Component Structure:**
```javascript
// ✅ GOOD: Functional component with hooks
import { useState, useEffect } from 'react'

const EquationInput = ({ onSubmit }) => {
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)
  
  // Validate on change
  useEffect(() => {
    if (input && !isValidEquation(input)) {
      setError('Invalid equation syntax')
    } else {
      setError(null)
    }
  }, [input])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!error) {
      onSubmit(input)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* JSX here */}
    </form>
  )
}

export default EquationInput
```

**State Management:**
```javascript
// ✅ GOOD: Lift state up, pass props down
const App = () => {
  const [equation, setEquation] = useState(null)
  
  return (
    <>
      <EquationInput onSubmit={setEquation} />
      <GraphPanel equation={equation} />
    </>
  )
}

// ❌ BAD: Prop drilling too deep
// Use Context for deeply nested shared state
```

---

### 11.3 Security Best Practices

**Environment Variables:**
```javascript
// ✅ GOOD: Use env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

// ❌ BAD: Hardcoded credentials
const supabaseUrl = "https://myproject.supabase.co" // NEVER!
```

**Input Validation:**
```javascript
// ✅ GOOD: Whitelist validation
const isValidEquation = (input) => {
  // Only allow safe characters
  const safePattern = /^[a-zA-Z0-9+\-*/^().,\s]+$/
  return safePattern.test(input) && input.length <= 200
}

// ❌ BAD: No validation
const result = eval(userInput) // NEVER use eval!
```

**Supabase RLS:**
```sql
-- ✅ GOOD: Restrict access to own data
CREATE POLICY "Users manage own equations"
  ON equations FOR ALL
  USING (auth.uid() = user_id);

-- ❌ BAD: Public access
CREATE POLICY "Anyone can do anything"
  ON equations FOR ALL
  USING (true); -- Dangerous!
```

---

### 11.4 Error Handling

**Try-Catch Blocks:**
```javascript
// ✅ GOOD: Graceful error handling
const parseEquation = (input) => {
  try {
    const node = math.parse(input)
    return { success: true, data: node }
  } catch (error) {
    console.error('Parse error:', error)
    return { 
      success: false, 
      error: 'Unable to parse equation. Check syntax.' 
    }
  }
}

// ❌ BAD: Unhandled errors
const parseEquation = (input) => {
  return math.parse(input) // Crashes if invalid
}
```

**User-Facing Errors:**
```javascript
// ✅ GOOD: Helpful error messages
"Invalid equation. Try using standard format like 'x^2 + 2x - 3'"

// ❌ BAD: Technical jargon
"SyntaxError: Unexpected token '^' at position 12"
```

---

### 11.5 Loading States

**Always Show Feedback:**
```javascript
const GraphPanel = ({ equation }) => {
  const [loading, setLoading] = useState(false)
  const [graphData, setGraphData] = useState(null)
  
  useEffect(() => {
    if (!equation) return
    
    setLoading(true)
    
    // Simulate async operation
    setTimeout(() => {
      const data = generateGraphData(equation)
      setGraphData(data)
      setLoading(false)
    }, 1000)
  }, [equation])
  
  if (loading) {
    return <Spinner text="Rendering graph..." />
  }
  
  if (!graphData) {
    return <EmptyState message="Enter an equation to visualize" />
  }
  
  return <Plot data={graphData} />
}
```

---

## UI/UX Design Guidelines

### 12.1 Visual Design Principles

**Typography:**
- Headings: Lexend Deca (modern, geometric)
- Body: Arial (universally readable)
- Code/Equations: JetBrains Mono (monospace clarity)

**Color Usage:**
- Primary (Blue): Call-to-action buttons, links
- Accent (Cyan): Highlights, important values
- Success (Green): Positive feedback
- Error (Red): Warnings, errors
- Neutral: Text, backgrounds

**Spacing:**
- Use consistent 8px grid system
- Generous whitespace around key elements
- Padding: 16px-32px for panels
- Margins: 24px-48px between sections

**Rounded Corners:**
- Buttons: 12px border-radius
- Panels: 20px border-radius
- Input fields: 12px border-radius
- Small elements: 8px border-radius

---

### 12.2 Interaction Design

**Buttons:**
- Primary: Filled with gradient, shadow on hover
- Secondary: Outlined, filled on hover
- Disabled: Reduced opacity (0.5), no pointer events
- Min height: 44px (mobile touch target)

**Inputs:**
- Focus state: Blue border, subtle glow
- Error state: Red border, error message below
- Success state: Green border (after validation)

**Animations:**
- Hover: 200ms ease transition
- State changes: 300ms ease-in-out
- Graph updates: 200ms smooth interpolation
- Page transitions: 400ms fade

**Feedback:**
- Hover: Cursor change, subtle scale (1.02x)
- Active: Slight depression effect
- Loading: Spinner or skeleton screens
- Success: Checkmark animation

---

### 12.3 Mobile Optimization

**Touch Targets:**
- Minimum size: 44x44px (iOS guideline)
- Spacing between: 8px minimum
- Slider thumb: 48x48px touch area

**Gesture Support:**
- Pinch to zoom on graph
- Swipe to pan
- Double-tap to reset view
- Long-press for tooltips (optional)

**Mobile-Specific:**
- Collapsible panels to save space
- Bottom sheet for analysis (easy thumb reach)
- Fixed header (scrolls with content)
- Floating action button (FAB) for quick actions

---

## Launch Checklist

### 13.1 Pre-Launch Requirements

**Functionality:**
- [ ] All 7 equation types render correctly
- [ ] Parameter sliders update graphs smoothly
- [ ] Zoom/pan controls work on all devices
- [ ] Dark mode toggles correctly
- [ ] Authentication flow complete (optional features)
- [ ] Equation history saves/loads properly
- [ ] All buttons and links functional
- [ ] Error states display helpful messages
- [ ] Loading states show during async operations

**Performance:**
- [ ] Lighthouse Performance score ≥ 90
- [ ] Page load time < 3 seconds on 3G
- [ ] Graph renders in < 2 seconds
- [ ] No console errors in production
- [ ] Images optimized (WebP format)
- [ ] Code splitting implemented
- [ ] Bundle size < 500KB (gzipped)

**Security:**
- [ ] All API keys in .env file
- [ ] .env added to .gitignore
- [ ] Supabase RLS policies enabled
- [ ] HTTPS enforced in production
- [ ] Input validation on all forms
- [ ] No eval() or Function() constructor used
- [ ] Dependencies scanned for vulnerabilities
- [ ] CSP headers configured

**Accessibility:**
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels on interactive elements
- [ ] Alt text on images
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Screen reader tested

**Cross-Browser:**
- [ ] Tested on Chrome 100+
- [ ] Tested on Safari 15+ (iOS)
- [ ] Tested on Firefox 100+
- [ ] Tested on Edge 100+

**Mobile Testing:**
- [ ] iPhone SE (375px)
- [ ] iPhone 14 Pro (393px)
- [ ] iPad (768px)
- [ ] Android phone (various)

**Documentation:**
- [ ] README.md with setup instructions
- [ ] Code comments added
- [ ] API documentation created
- [ ] User guide written (optional)

---

### 13.2 Deployment Steps

1. **Environment Setup**
   - [ ] Create production Supabase project
   - [ ] Generate production API keys
   - [ ] Set up Vercel/Netlify account

2. **Build Configuration**
   - [ ] Configure build scripts
   - [ ] Set environment variables in hosting platform
   - [ ] Test production build locally

3. **Deploy**
   - [ ] Push to GitHub repository
   - [ ] Connect repo to Vercel/Netlify
   - [ ] Trigger initial deployment
   - [ ] Verify deployment success

4. **Post-Deployment**
   - [ ] Test production URL
   - [ ] Check HTTPS certificate
   - [ ] Verify database connections
   - [ ] Test authentication flow
   - [ ] Monitor error logs

5. **Domain Setup (Optional)**
   - [ ] Purchase custom domain
   - [ ] Configure DNS settings
   - [ ] Update hosting platform
   - [ ] Verify SSL certificate

---

### 13.3 Monitoring & Analytics

**Set Up:**
- [ ] Google Analytics 4 installed
- [ ] Error tracking (Sentry/LogRocket)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] User feedback form embedded

**Track:**
- Page views and unique visitors
- Equation visualization count
- Most popular equation types
- Average session duration
- Bounce rate
- Error rates
- Browser/device distribution

---

## Success Criteria

### 14.1 MVP Success Metrics

**User Metrics (Month 1):**
- 100+ unique users
- 50+ daily active users
- 3+ equations visualized per user per session
- 60%+ parameter slider usage
- 30%+ mobile usage

**Performance Metrics:**
- 95%+ uptime
- < 2s average graph render time
- < 5s page load time
- Lighthouse score ≥ 90

**Quality Metrics:**
- < 5% error rate
- 4.0+ user rating
- < 10 critical bugs reported

---

### 14.2 Post-MVP Goals

**Version 2.0 (3-6 months):**
- Image upload + OCR for handwritten equations
- 3D graph support
- Equation comparison mode
- Export graphs as PNG/PDF
- Video tutorials

**Version 3.0 (6-12 months):**
- Mobile apps (iOS/Android)
- Collaborative features
- Teacher dashboard
- Premium subscription tier
- API for third-party integrations

---

## Risks & Mitigation

### 15.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Math.js parsing limitations | High | Medium | Thoroughly test edge cases; provide clear input guidelines |
| Plotly.js performance on mobile | Medium | Low | Optimize data points; implement adaptive sampling |
| Supabase rate limiting | Medium | Low | Implement client-side caching; upgrade plan if needed |
| Browser compatibility issues | Medium | Medium | Extensive cross-browser testing; progressive enhancement |
| Security vulnerabilities | High | Low | Regular dependency updates; security audits |

---

### 15.2 User Experience Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Users don't understand equation syntax | High | High | Add examples, tooltips, and syntax guide |
| Mobile experience is clunky | Medium | Medium | Extensive mobile testing; touch-optimized controls |
| Parameter sliders are confusing | Medium | Medium | Clear labels, value displays, reset buttons |
| Graph rendering is slow | High | Low | Optimize calculation; show loading states |
| Users abandon before trying features | High | Medium | Onboarding flow; preset equations for quick start |

---

### 15.3 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user adoption | High | Medium | Marketing strategy; user testing; feedback loops |
| Hosting costs exceed budget | Medium | Low | Serverless architecture; monitor usage |
| Competitor launches similar product | Medium | Low | Focus on unique value; rapid iteration |
| Maintenance becomes unsustainable | High | Low | Clean code; documentation; community involvement |

---

## Appendix

### A. Glossary

**Terms:**
- **Asymptote:** A line that a curve approaches but never touches
- **Coefficient:** The numerical factor in a term (e.g., 2 in 2x)
- **Discriminant:** b² - 4ac; determines number of roots in quadratic
- **Parameter:** A variable that can be adjusted to change equation behavior
- **Vertex:** The highest or lowest point on a parabola
- **AST:** Abstract Syntax Tree - structured representation of parsed code

**Abbreviations:**
- **MVP:** Minimum Viable Product
- **PRD:** Product Requirements Document
- **RLS:** Row Level Security
- **MVVM:** Model-View-ViewModel
- **KPI:** Key Performance Indicator
- **UX:** User Experience
- **UI:** User Interface
- **API:** Application Programming Interface

---

### B. References

**Documentation:**
- Math.js: https://mathjs.org/docs/
- Plotly.js: https://plotly.com/javascript/
- React: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/docs
- Supabase: https://supabase.com/docs

**Educational Resources:**
- Khan Academy Mathematics
- Wolfram MathWorld
- Desmos Learn

**Design Inspiration:**
- Desmos Graphing Calculator
- GeoGebra
- Symbolab

---

### C. Contact Information

**Product Team:**
- Product Owner: [TBD]
- Technical Lead: [TBD]
- UI/UX Designer: [TBD]

**Stakeholders:**
- Educators: [TBD]
- Student Testers: [TBD]

**Feedback:**
- Email: feedback@mathsvision.com
- GitHub Issues: [repository URL]

---

### D. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 31, 2026 | [Your Name] | Initial PRD created |

---

## Approval Signatures

**Reviewed and Approved By:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | __________ | __________ | ______ |
| Technical Lead | __________ | __________ | ______ |
| Stakeholder | __________ | __________ | ______ |

---

**End of Document**

*This PRD is a living document and will be updated as the project evolves. All changes should be tracked in the version history.*
