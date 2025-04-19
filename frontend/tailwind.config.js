module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        neumorph: '8px 8px 16px rgba(186, 190, 204, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.6)',
        'neumorph-inset': 'inset 8px 8px 16px rgba(186, 190, 204, 0.2), inset -8px -8px 16px rgba(255, 255, 255, 0.6)'
      }
    }
  }
};