# DESIGNER_SERIES | Pro Sketch & UI Wireframer

**DESIGNER_SERIES** is a high-performance, web-based drawing and design tool built with Vanilla JavaScript and HTML5 Canvas. Moving beyond simple pixel-painting, it utilizes an object-oriented approach to allow for shape selection, manipulation, and professional UI wireframing.

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange)
![Tech Stack](https://img.shields.io/badge/Logic-Vanilla%20JS-yellow)

---

## 🚀 Features

### 🎨 Advanced Drawing Tools
* **Multi-Shape Support:** Draw Rectangles, Perfect Squares, Circles, Isosceles Triangles, and Right Triangles.
* **Smart Selection & Move:** Switch to "Select & Move" mode to grab existing shapes and reposition them on the artboard.
* **Freehand & Eraser:** Traditional brush and eraser tools for quick sketching and area clearing.

### ⚙️ Design Controls
* **Precision Styling:** Adjust stroke width, color, and global opacity in real-time.
* **Fill Toggle:** Switch between outlined "wireframe" shapes and solid "UI element" shapes.
* **History Management:** Integrated Undo/Delete functionality (Hotkey: `Z` or `Backspace`).

### 💾 Workflow
* **Canvas Export:** Download your designs as high-quality PNG files.
* **Quick Clear:** Instantly wipe the artboard (Hotkey: `C`).

---

## 🛠️ Technical Implementation

Unlike traditional "painting" apps that forget pixels once drawn, **DESIGNER_SERIES** uses an **Object-Array Rendering Engine**:

1.  **State Tracking:** Every shape is stored as a JavaScript object containing its coordinates, dimensions, and style properties.
2.  **The Render Loop:** The canvas is cleared and redrawn from the object array whenever a change occurs, allowing for seamless moving and layering of objects.
3.  **Hit Detection:** Custom logic calculates mouse position relative to object boundaries to enable selection.



---

## 📂 Installation & Usage

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/DESIGNER_SERIES.git](https://github.com/YOUR_USERNAME/DESIGNER_SERIES.git)
    ```
2.  **Open the Project:**
    Open `index.html` in any modern web browser.
3.  **Live Server (Recommended):**
    If using VS Code, use the **Live Server** extension for real-time updates.

---

## ⌨️ Hotkeys

| Key | Action |
| :--- | :--- |
| `C` | Clear Artboard |
| `Z` / `Backspace` | Undo / Delete Last Object |
| `Delete` | Remove Selected Object |

---

## 🗺️ Roadmap
- [ ] Text Tool for UI Labels
- [ ] Layers Panel
- [ ] SVG Export Support
- [ ] Dark Mode UI Toggle

---
Developed as part of the **DESIGNER_SERIES** project.