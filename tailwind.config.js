/** This file does not mattter with tailwind and Vite, but including it activates tailwind intellesense
 * , which makes autocomplete possible and coding easier! Also, it makes it more obvious what 
 * CSS framework I'm using */

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  