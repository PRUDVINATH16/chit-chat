# 🎨 UI & Design Rules

To keep Chit-Chat looking clean and consistent, we follow these simple rules:

### 1. Icons
- We use **Lucide-React**. Always prefer simple, thin-stroke icons.

### 2. Feedback
- Use **React-Hot-Toast** for all success and error messages.
- Use the **Loading Skeletons** (`components/*Skeleton.jsx`) while data is fetching.

### 3. Styling
- **Tailwind CSS**: No custom CSS files unless absolutely necessary (keep `index.css` minimal).
- **DaisyUI**: We use DaisyUI themes. Check `tailwind.config.js` for the active palette.

### 4. Interactivity
- Every button should have a hover state.
- Use the `useKeyboardSounds` hook to add life to message inputs.

---
*If it's not minimal, it doesn't belong!*
