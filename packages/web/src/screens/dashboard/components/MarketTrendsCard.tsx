import React, { FC } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { MarketTrendsResults, MarketTrendType } from '@homzhub/common/src/domain/models/MarketTrends';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  data: MarketTrendsResults;
}

const MarketTrendsCard: FC<IProps> = ({ data }: IProps) => {
  const { title, postedAtDate, link, imageUrl, trendType, description } = data;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const onLinkPress = (): void => {
    window.open(link);
  };
  return (
    <TouchableOpacity activeOpacity={1} onPress={onLinkPress} style={[styles.card, isMobile && styles.cardMobile]}>
      {imageUrl && !!imageUrl ? (
        <ImageBackground source={{ uri: imageUrl }} style={styles.image}>
          {trendType === MarketTrendType.VIDEO && (
            <View style={styles.videoOverlay}>
              <Icon name={icons.play} size={28} color={theme.colors.white} />
            </View>
          )}
        </ImageBackground>
      ) : (
        <ImagePlaceholder height="100%" width="100%" containerStyle={styles.image} />
      )}
      <View style={styles.info}>
        <Label type="regular" textType="regular">
          Blog
        </Label>
        <Label type="regular" textType="regular">
          {postedAtDate}
        </Label>
      </View>
      <View style={styles.description}>
        <Text type="small" textType="semiBold" numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
          {title}
        </Text>
        <Label type="regular" textType="regular" numberOfLines={2} ellipsizeMode="tail" style={styles.subTitle}>
          {description}
        </Label>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: '92%',
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    marginRight: 16,
    marginBottom: 25,
  },
  cardMobile: {
    marginRight: undefined,
  },
  image: {
    flex: 1,
    minWidth: 'calc(100% - 24px)',
    maxWidth: 298,
    minHeight: 160,
    maxHeight: 160,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    margin: 12,
  },
  videoOverlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.overlay,
  },
  info: {
    height: 'max-content',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  description: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 8,
  },
  subTitle: {
    overflow: 'hidden',
    textAlign: 'justify',
    marginBottom: 8,
  },
});

export default MarketTrendsCard;
