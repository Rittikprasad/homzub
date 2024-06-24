import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';

interface ILoaderProps {
  visible: boolean;
  imageSize: number;
}

export const ImageLoader = ({ visible, imageSize }: ILoaderProps): React.ReactElement | null => {
  if (!visible) {
    return null;
  }
  const styles = imageLoaderStyles(imageSize);
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <ActivityIndicator
          size={PlatformUtils.isIOS() ? 'large' : 50}
          color={theme.colors.blueTint12}
          style={styles.loader}
        />
      </View>
    </View>
  );
};

interface IStyle {
  container: ViewStyle;
  overlay: ViewStyle;
  loader: ViewStyle;
  text: ViewStyle;
}

const imageLoaderStyles = (imageSize: number): StyleSheet.NamedStyles<IStyle> =>
  StyleSheet.create<IStyle>({
    container: {
      ...(theme.circleCSS(90) as object),
      flex: 1,
      backgroundColor: theme.colors.whiteOpacity,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      elevation: 1,
      zIndex: 1,
      margin: 'auto',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loader: {
      marginHorizontal: 24,
      marginVertical: 12,
    },
    text: {
      color: theme.colors.darkTint4,
      marginBottom: 12,
    },
  });
