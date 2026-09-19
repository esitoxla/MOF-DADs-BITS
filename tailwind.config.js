/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        positive: "#059669", // emerald-600
        negative: "#dc2626", // red-600
        attention: "#f59e0b", // amber-500
        surface: {
          page: "#f8fafc", // slate-50
          card: "#ffffff",
        },
        ink: {
          primary: "#1e293b", // slate-800
          secondary: "#64748b", // slate-500
        },
      },
    },
  },
};
