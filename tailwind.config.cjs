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
        'NotoSans Nerd Font',
        'Noto Sans',
        'Segoe UI',
        'Ubuntu',
        'Söhne',
        'Roboto',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'Ubuntu',
        'Cantarell',
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
        // darker/lighter using https://www.colors.tools/lighten-and-darken/
        // NOTE: ALSO NEEDS TO BE CHANGED ON CSS FILE
        accent: {
          light: '#799ad6',
          base: '#3762b2',
          dark: '#1f3764',
        },
        neutral: {
          light: '#313131',
          base: '#282828',
          dark: '#1f1f1f',
        },
        custom: {
          white: '#ffffff',
          black: '#000000',
        },
        role: {
          system: '#594e50',
          assistant: '#7a4f99',
          user: '#36999b',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), parentSiblingHoverPlugin],
  darkMode: 'class',
};
