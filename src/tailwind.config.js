/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
 theme: {
  extend: {
    keyframes: {
      "fade-in":  { from: { opacity: "0" }, to: { opacity: "1" } },
      "slide-up": { from: { opacity: "0", transform: "translateY(20px) scale(0.97)" }, to: { opacity: "1", transform: "translateY(0) scale(1)" } },
    },
    animation: {
      "fade-in":  "fade-in 0.18s ease",
      "slide-up": "slide-up 0.22s cubic-bezier(0.22,1,0.36,1)",
    },
  },
},
  plugins: [],
};
