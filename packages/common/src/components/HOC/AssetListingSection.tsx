import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  title?: string;
  children: React.ReactElement;
  containerStyles?: StyleProp<ViewStyle>;
  contentContainerStyles?: StyleProp<ViewStyle>;
}

const AssetListingSection = ({
  title,
  children,
  containerStyles,
  contentContainerStyles,
}: IProps): React.ReactElement => {
  return (
    <View style={[styles.container, containerStyles]}>
      {!!title && (
        <View style={styles.titleContainer}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {title}
          </Text>
        </View>
      )}
      <View style={[styles.contentContainer, contentContainerStyles]}>{children}</View>
    </View>
  );
};

const memoizedComponent = React.memo(AssetListingSection);
export { memoizedComponent as AssetListingSection };

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  titleContainer: {
    padding: 16,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: theme.colors.moreSeparator,
  },
  contentContainer: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    color: theme.colors.darkTint3,
  },
});
