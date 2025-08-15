/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,}",
    './node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      listStyleType: {
        'lower-roman': 'lower-roman',
        'upper-roman': 'upper-roman',
      }
    },
    backgroundImage: {
      'custom-image': "url('assets/JobQuest Hero IMage-01 1.svg')",
      'custom-image-2': "url('assets/Quest Page Hero Illustration-04 1.svg')"
    },
    // fontFamily: {
    //   'body': ['Poppins', ...defaultTheme.fontFamily.body]
    // }
  },
  plugins: [],
}

