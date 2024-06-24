import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

const globalStyles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const circleCSS = (radius: number): StyleProp<ViewStyle> => ({
  height: radius,
  width: radius,
  borderRadius: radius / 2,
});

const randomHex = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const DeviceDimensions = {
  SMALL: { height: 568, width: 320 },
  MEDIUM: { height: 1080, width: 375 },
};

export const constants = {
  globalStyles,
  circleCSS,
  randomHex,
  DeviceDimensions,
};
