import React from 'react';
import { ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { ImageRound } from '@homzhub/common/src/components/atoms/Image';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';

interface IProps {
  icon?: string;
  imageUri?: string;
  count: number;
  title: string;
  isHovered?: boolean;
  isActive?: boolean;
  activeColor?: string;
  iconBackgroundColor?: string;
  iconColor?: string;
  isIcon?: boolean;
}

const OverviewCard: React.FC<IProps> = ({
  icon = '',
  imageUri = '',
  count,
  title,
  isHovered = false,
  isActive = false,
  activeColor = theme.colors.transparent,
  iconBackgroundColor = theme.colors.background,
  iconColor = theme.colors.blue,
  isIcon = true,
}: IProps) => {
  const styles = cardStyle(activeColor);
  return (
    <View style={[styles.card, (isHovered || isActive) && styles.cardActive, !isIcon && styles.cardWithNoIcon]}>
      {imageUri && (
        <ImageRound
          style={styles.roundIcon as ImageStyle}
          size={54}
          source={{
            uri: imageUri,
          }}
        />
      )}
      {icon && isIcon && (
        <View style={[styles.iconWrapper, { backgroundColor: iconBackgroundColor }, styles.roundIcon as ImageStyle]}>
          <Icon name={icon} size={30} color={iconColor} />
        </View>
      )}
      <View style={!isIcon && styles.noIcon}>
        <Typography
          variant="text"
          size="large"
          fontWeight="semiBold"
          style={[styles.text, (isHovered || isActive) && styles.activeText]}
        >
          {count}
        </Typography>
        <Typography
          variant="text"
          size="small"
          fontWeight="regular"
          style={[styles.text, (isHovered || isActive) && styles.activeText]}
        >
          {title}
        </Typography>
      </View>
    </View>
  );
};

interface ICardStyle {
  card: ViewStyle;
  text: ViewStyle;
  activeText: ViewStyle;
  cardActive: ViewStyle;
  roundIcon: ImageStyle;
  iconWrapper: ViewStyle;
  noIcon: ViewStyle;
  cardWithNoIcon: ViewStyle;
}

const cardStyle = (activeColor: string): StyleSheet.NamedStyles<ICardStyle> =>
  StyleSheet.create<ICardStyle>({
    card: {
      alignItems: 'center',
      flexDirection: 'row',
      margin: 8,
      paddingTop: 10,
      paddingBottom: 8,
      paddingHorizontal: 24,
      justifyContent: 'center',
      minHeight: 72,
      borderRadius: 4,
      shadowOpacity: 0.08,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 8,
      shadowColor: theme.colors.shadow,
      backgroundColor: theme.colors.white,
    },
    text: {
      color: theme.colors.darkTint3,
    },
    activeText: {
      color: theme.colors.white,
    },
    cardActive: {
      backgroundColor: activeColor,
      color: theme.colors.white,
    },
    roundIcon: {
      marginRight: 8,
    },
    iconWrapper: {
      overflow: 'hidden',
      borderRadius: 54,
      height: 54,
      width: 54,
      alignItems: 'center',
      justifyContent: 'center',
    },
    noIcon: {
      flexDirection: 'column-reverse',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardWithNoIcon: {
      paddingHorizontal: 20,
      marginLeft: 0,
      marginRight: 0,
    },
  });

export default OverviewCard;
