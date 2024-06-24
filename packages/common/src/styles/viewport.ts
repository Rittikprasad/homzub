import { Dimensions } from 'react-native';

const defaultHeight = Dimensions.get('window').height;
const defaultWidth = Dimensions.get('window').width;

export const wp = (percentage: number): number => {
  const value = (percentage * defaultWidth) / 100;
  return Math.round(value);
};

export const viewport = {
  width: defaultWidth,
  height: defaultHeight,
  dividerWidth: defaultWidth - 40,
  dividerHeight: 1,
};
