import { brand } from './brand';

export const theme = {
  colors: brand,
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    pill: 999,
  },
  type: {
    display: {
      fontFamily: 'SourceSerif4_600SemiBold',
      fontSize: 40,
      lineHeight: 46,
    },
    title: {
      fontFamily: 'SourceSerif4_600SemiBold',
      fontSize: 30,
      lineHeight: 36,
    },
    heading: {
      fontFamily: 'SourceSans3_700Bold',
      fontSize: 20,
      lineHeight: 26,
    },
    body: {
      fontFamily: 'SourceSans3_400Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    bodyStrong: {
      fontFamily: 'SourceSans3_600SemiBold',
      fontSize: 16,
      lineHeight: 22,
    },
    label: {
      fontFamily: 'SourceSans3_600SemiBold',
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.8,
      textTransform: 'uppercase' as const,
    },
    caption: {
      fontFamily: 'SourceSans3_400Regular',
      fontSize: 14,
      lineHeight: 20,
    },
    button: {
      fontFamily: 'SourceSans3_600SemiBold',
      fontSize: 16,
      lineHeight: 20,
    },
  },
  shadow: {
    card: {
      shadowColor: brand.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.07,
      shadowRadius: 18,
      elevation: 3,
    },
  },
  frame: {
    maxWidth: 440,
  },
} as const;

export { brand };
