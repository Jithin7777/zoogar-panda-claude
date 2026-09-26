/**
 * Theme values below are mirrored from constants/theme.ts so NativeWind and
 * the (still in-use) StyleSheet components share identical design tokens
 * during the incremental migration. Keep both files in sync until
 * constants/theme.ts is retired at the end of the migration.
 */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#2FAE60',
        primaryDark: '#1F8F4C',
        primaryLight: '#E6F6EC',
        background: '#FFFFFF',
        pageBackground: '#F7F7F7',
        surface: '#F5F8F6',
        border: '#E3ECE6',
        textPrimary: '#1C2B22',
        textSecondary: '#6B7B72',
        textOnPrimary: '#FFFFFF',
        danger: '#E4574C',
        warning: '#F5A524',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
      },
      borderRadius: {
        sm: 12,
        md: 16,
        lg: 24,
        full: 999,
      },
      fontSize: {
        sm: 14,
        md: 16,
        lg: 20,
        xl: 26,
        xxl: 32,
      },
    },
  },
  plugins: [],
};
