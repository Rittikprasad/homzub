import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
// @ts-ignore
import { ProgressBar as Progress } from 'react-native-web';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProgressBarProps {
  progress: number;
  title?: string;
  width?: number;
  filledColor?: string;
  containerStyles?: StyleProp<ViewStyle>;
  isPropertyVacant?: boolean;
}

const ProgressBar = (props: IProgressBarProps): React.ReactElement => {
  const { progress, width, title, containerStyles = {}, isPropertyVacant, filledColor = theme.colors.green } = props;
  return (
    <View style={containerStyles}>
      <View style={styles.container}>
        <Label type="large" style={styles.progressTitle}>
          {title || 'Progress'}
        </Label>
        <Label type="regular" textType="semiBold" style={styles.status}>
          {progress}%
        </Label>
      </View>
      <Progress
        progress={progress / 100}
        width={width}
        color={isPropertyVacant ? theme.colors.green : filledColor}
        trackColor={theme.colors.background}
        style={styles.barStyle}
        borderRadius={5}
        unfilledColor={theme.colors.green}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  barStyle: {
    borderColor: theme.colors.disabled,
    borderRadius: 2,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  status: {
    color: theme.colors.darkTint4,
    marginTop: 6,
  },
  progressTitle: {
    color: theme.colors.gray3,
    marginTop: 6,
  },
});

export { ProgressBar as Progress };
