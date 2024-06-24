import React, { memo, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text, fontLineHeights } from '@homzhub/common/src/components/atoms/Text';

export interface IPageHeaderProps {
  contentTitle?: string;
  contentSubTitle?: string;
  contentLink?: string;
  disableDivider?: boolean;
  onLinkPress?: () => void;
}

const PageHeader = ({
  contentTitle,
  contentSubTitle,
  contentLink,
  disableDivider = false,
  onLinkPress,
}: IPageHeaderProps): ReactElement | null => {
  if (!contentTitle) {
    return null;
  }

  return (
    <View
      style={[
        styles.titleContainer,
        !disableDivider && {
          borderBottomColor: theme.colors.disabled,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <Text type="large" textType="semiBold" style={styles.contentTitle}>
        {contentTitle}
      </Text>
      {!!contentSubTitle && (
        <View style={styles.subTitleContainer}>
          <Label type="large" style={styles.contentSubTitle}>
            {contentSubTitle}
          </Label>
          {contentLink && (
            <Label type="large" textType="semiBold" style={styles.linkText} onPress={onLinkPress}>
              {` ${contentLink}`}
            </Label>
          )}
        </View>
      )}
    </View>
  );
};

const memoizedComponent = memo(PageHeader);
export { memoizedComponent as PageHeader };

const PADDING_TOP = 16;
export const TITLE_HEIGHT = PADDING_TOP + fontLineHeights.text.large;

const styles = StyleSheet.create({
  subTitleContainer: {
    paddingTop: 6,
    flexDirection: 'row',
  },
  titleContainer: {
    paddingTop: PADDING_TOP,
    paddingBottom: 12,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
  contentTitle: {
    color: theme.colors.darkTint1,
  },
  contentSubTitle: {
    color: theme.colors.darkTint4,
  },
  linkText: {
    color: theme.colors.primaryColor,
  },
});
