import React, { FC } from 'react';
import { View, ViewStyle, StyleSheet, Image } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  cardImage: string;
  cardTitle: string;
  cardDescription: string;
  cardStyle?: ViewStyle[];
  children?: React.ReactNode;
}
const CardWithIcon: FC<IProps> = (props: IProps) => {
  const { cardTitle, cardDescription, cardImage, cardStyle, children } = props;
  const isTablet = useDown(deviceBreakpoint.TABLET);

  return (
    <View style={[styles.card, cardStyle, isTablet && styles.cardTablet]}>
      <Image source={{ uri: cardImage }} style={styles.imageStyle} />
      <Typography size="regular" style={styles.cardTitle} fontWeight="semiBold">
        {cardTitle}
      </Typography>
      <Typography size="small" style={styles.cardDescription} fontWeight="regular">
        {cardDescription}
      </Typography>
      <View>{children}</View>
    </View>
  );
};

export default CardWithIcon;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    marginLeft: 40,
    marginBottom: 40,
    padding: 24,
    shadowColor: theme.colors.landingCardShadow,
    shadowOffset: { width: 0, height: 42 },
    shadowOpacity: 0.2,
    shadowRadius: 120,
  },
  cardTablet: {
    marginBottom: 0,
  },
  imageStyle: {
    width: 40,
    height: 40,
  },
  cardTitle: {
    marginTop: 24,
    color: theme.colors.darkTint1,
    minHeight: 60,
  },
  cardDescription: {
    marginTop: 8,
    color: theme.colors.darkTint3,
    minHeight: 80,
  },
});
