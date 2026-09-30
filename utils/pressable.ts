import { Platform, type ViewStyle } from 'react-native';

export const webPointer: ViewStyle = Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : {};
