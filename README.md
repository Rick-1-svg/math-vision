# 🧮 Maths Vision

**Interactive Mathematical Equation Visualizer & Educational Tool**

Transform mathematical equations into beautiful, interactive visualizations. From basic algebra to complex 3D surfaces, Maths Vision provides a rigorous yet accessible platform for mathematical exploration and learning.

![Maths Vision](https://img.shields.io/badge/Hackathon-2026-blue) ![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite) ![License](https://img.shields.io/badge/license-MIT-green)

---

## 🌟 Key Features

### 🧊 **Immersive 3D Graphing**
Explore the third dimension with our powerful 3D visualization engine.
- **Strict Mathematical Accuracy**: Rigorously verified to reject false complex artifacts ($Im(z) > 10^{-10}$ is strictly filtered).
- **Interactive Control**: Orbit, zoom, and pan around surfaces like $z = x^2 - y^2$.
- **High Fidelity**: Adaptive resolution ensures smooth curves and precise singularity handling.

### 📊 **Comprehensive 2D Graphing**
- **Infinite Canvas**: Interactive pan and zoom with dynamic data regeneration.
- **Auto-Fit**: "Fit to Screen" instantly frames your equation's critical points.
- **Smart Interaction**: visual crosshairs and highlight dots for precise coordinate reading.
- **Debounced Input**: Graphs update automatically as you type (with a 500ms smart delay).

### 📐 **Supported Mathematics**
We support over 12 equation types across 4 major categories:
1.  **Algebra & Functions**: Linear, Quadratic, Polynomials, Rational.
2.  **Conic Sections**: Circle, Ellipse, Hyperbola (Implicit & Parametric).
3.  **Calculus Tools**: Derivatives, Tangent lines, and Integral area visualization.
4.  **3D Surfaces**: Paraboloids, Saddles, Ripples, and custom $z=f(x,y)$ functions.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation
1.  **Clone the repository**
    ```bash
    git clone https://github.com/Rick-1-svg/math-vision.git
    cd math-vision
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Explore**
    Open `http://localhost:xxxx` to start graphing!

---

## 🧠 Educational Value

Maths Vision is designed for learning:
- **Instant Feedback**: See how changing a number changes the shape immediately.
- **Visual Calculus**: Visualize the area under a curve or the slope of a tangent line.
- **Exploration First**: Use our library of **25+ Presets** to jumpstart your learning.
- **Equation Classifier**: automatic recognition of equation types (e.g., "This is a Hyperbola").

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS (Glassmorphism UI)
- **Math Engine**: Math.js (Parsing), Custom Web Workers (Computation)
- **Visualization**: Plotly.js (WebGL accelerated 2D/3D rendering)
- **Architecture**: MVVM with Service Layer isolation for testability.

---

## 🧪 Mathematical Verification

We take accuracy seriously.
- **Strict Domain Enforcement**: We filter out complex number results that often plague standard plotters (e.g., `sqrt(-1)` is correctly shown as a hole, not a value).
- **Automated Testing**: Our verification scripts run against ground-truth mathematical definitions to ensure what you see is mathematically true.

---

## 📝 Syntax Examples

| Type | Equation | Description |
| :--- | :--- | :--- |
| **3D Surface** | `x^2 - y^2` | Saddle Point |
| **3D Complex** | `sin(sqrt(x^2 + y^2))` | Ripple Effect |
| **Implicit** | `x^2/16 + y^2/9 = 1` | Ellipse |
| **Calculus** | `derivative(x^2)` | Shows slope |

---

<div align="center">
Made with ❤️ for Math Lovers
</div>
