/** @type {import('tailwindcss').Config} */

function parentSiblingHoverPlugin({ addVariant, e }) {
  addVariant('parent-sibling-hover', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.parent-sibling:hover ~ .parent .${e(
        `parent-sibling-hover${separator}${className}`
      )}`;
    });
  });
}

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: [
        'Söhne',
        'Segoe UI',
        'Roboto',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'Ubuntu',
        'Cantarell',
        'Noto Sans',
        'sans-serif',
        'Helvetica Neue',
        'Arial',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
      ],
      mono: [
        'Söhne Mono',
        'Monaco',
        'Andale Mono',
        'Ubuntu Mono',
        'Consolas',
        'monospace',
      ],
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            pre: { padding: 0, margin: 0 },
            ul: {
              'list-style-type': 'none',
            },
          },
        },
      },
      colors: {
        gray: {
          50: '#b0b0c0',
          100: '#a0a0b0',
          200: '#9090a0',
          300: '#808090',
          400: '#707080',
          500: '#303038',
          600: '#282830',
          650: '#202028',
          700: '#181820',
          800: '#101018',
          850: '#080810',
          900: '#000008',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), parentSiblingHoverPlugin],
  darkMode: 'class',
};
