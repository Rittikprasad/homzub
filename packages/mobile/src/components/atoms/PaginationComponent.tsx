import React from 'react';
import { Pagination } from 'react-native-snap-carousel';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';

interface IPaginationProps {
  dotsLength: number;
  activeSlide: number;
  containerStyle?: StyleProp<ViewStyle>;
  activeDotStyle?: StyleProp<ViewStyle>;
  inactiveDotStyle?: StyleProp<ViewStyle>;
}

export const PaginationComponent = (props: IPaginationProps): React.ReactElement => {
  const { dotsLength, activeSlide, containerStyle, inactiveDotStyle, activeDotStyle } = props;
  return (
    <Pagination
      dotsLength={dotsLength}
      activeDotIndex={activeSlide}
      dotStyle={[styles.dotStyle, activeDotStyle]}
      inactiveDotStyle={[styles.inactiveDotStyle, inactiveDotStyle]}
      inactiveDotOpacity={1}
      inactiveDotScale={1}
      containerStyle={containerStyle}
    />
  );
};

const styles = StyleSheet.create({
  dotStyle: {
    width: 10,
    height: 10,
    marginHorizontal: 2,
    borderStyle: 'solid',
    borderWidth: 3,
    borderRadius: 5,
    borderColor: theme.colors.blue,
    backgroundColor: theme.colors.white,
  },
  inactiveDotStyle: {
    backgroundColor: theme.colors.blue,
  },
});
