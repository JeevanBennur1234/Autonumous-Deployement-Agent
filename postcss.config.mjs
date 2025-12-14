/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ The new package we just installed
    autoprefixer: {},
  },
};

export default config;