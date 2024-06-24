import React, { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import * as RNProgress from 'react-native-progress';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProgressBarProps {
  progress: number;
  title?: string;
  width?: number;
  filledColor?: string;
  containerStyles?: StyleProp<ViewStyle>;
  circle?: boolean;
  wholeFactor?: number;
}

const CIRCLE_SIZE = 60;
const CIRCLE_THICKNESS = 4;

const Progress = (props: IProgressBarProps): React.ReactElement => {
  const {
    progress,
    width,
    filledColor = theme.colors.green,
    title,
    circle = false,
    containerStyles = {},
    wholeFactor = 100,
  } = props;

  if (circle) {
    return (
      <View style={styles.circleContainer}>
        <RNProgress.Circle
          size={CIRCLE_SIZE}
          thickness={CIRCLE_THICKNESS}
          progress={progress / wholeFactor}
          color={filledColor}
          unfilledColor={theme.colors.disabled}
          borderWidth={0}
          strokeCap="round"
          showsText
          formatText={(_): React.ReactElement => (
            <Label type="large" style={styles.circleProgress} numberOfLines={1}>
              {progress.toFixed(1)}
            </Label>
          )}
        />
        <Label type="regular" style={styles.circleTitle}>
          {title}
        </Label>
      </View>
    );
  }

  return (
    <View style={containerStyles}>
      <View style={styles.container}>
        <Label type="large" style={styles.progressTitle}>
          {title || 'Progress'}
        </Label>
        <Label type="large" style={styles.status}>
          {progress}%
        </Label>
      </View>
      <RNProgress.Bar
        progress={progress / wholeFactor}
        width={width ?? null}
        color={filledColor}
        style={styles.barStyle}
        borderRadius={5}
      />
    </View>
  );
};

const memoized = memo(Progress);
export { memoized as Progress };

const styles = StyleSheet.create({
  barStyle: {
    borderColor: theme.colors.disabled,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  status: {
    color: theme.colors.gray2,
    marginTop: 6,
  },
  progressTitle: {
    color: theme.colors.gray3,
    marginTop: 6,
  },
  circleContainer: {
    alignItems: 'center',
  },
  circleTitle: {
    color: theme.colors.darkTint3,
    marginTop: 4,
  },
  circleProgress: {
    color: theme.colors.darkTint2,
  },
});
