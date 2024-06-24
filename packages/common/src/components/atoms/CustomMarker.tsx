import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  selected: boolean;
}

const CustomMarker = (props: IProps): React.ReactElement => {
  const { selected } = props;

  if (!selected) {
    return <View style={styles.marker} />;
  }

  return (
    <View style={styles.selectedMarker}>
      <View style={styles.marker} />
    </View>
  );
};

const styles = StyleSheet.create({
  marker: {
    ...(theme.circleCSS(16) as object),
    backgroundColor: theme.colors.primaryColor,
  },
  selectedMarker: {
    ...(theme.circleCSS(40) as object),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.markerOpacity,
  },
});

const memoizedComponent = React.memo(CustomMarker);
export { memoizedComponent as CustomMarker };
