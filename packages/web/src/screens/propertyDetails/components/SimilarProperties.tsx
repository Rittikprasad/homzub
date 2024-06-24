import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import PropertySearchCard from '@homzhub/web/src/screens/searchProperty/components/PropertySearchCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  isMobile: boolean;
  isTablet: boolean;
  propertyTermId: number;
  isLease: boolean;
}

type Props = IProps;

const SimilarProperties = (props: Props): React.ReactElement => {
  const { propertyTermId, isMobile, isTablet, isLease } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDescription);
  const [similarProperties, setSimilarProperties] = useState<Asset[]>([]);

  useEffect(() => {
    getSimilarProperties(propertyTermId);
  }, [propertyTermId]);

  // eslint-disable-next-line no-shadow
  const getSimilarProperties = async (propertyTermId: number): Promise<void> => {
    const transaction_type = isLease ? 0 : 1;
    const response = await AssetRepository.getSimilarProperties(propertyTermId, transaction_type);
    setSimilarProperties(response);
  };

  return (
    <View style={styles.container}>
      {similarProperties.length !== 0 && (
        <View>
          <Typography variant="text" size="regular" fontWeight="semiBold">
            {t('similarProperties')}
          </Typography>
          <View style={styles.similarCard}>
            {similarProperties.map((item: Asset) => {
              return (
                <View style={[styles.card, isTablet && styles.tabCard, isMobile && styles.mobileCard]} key={item.id}>
                  <PropertySearchCard
                    investmentData={item}
                    priceUnit="mo"
                    isFooterRequired={false}
                    cardImageCarouselStyle={styles.carouselStyle}
                    cardImageStyle={styles.imageStyle}
                  />
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginBottom: 24,
  },
  similarProperties: {
    color: theme.colors.darkTint4,
  },
  similarCard: {
    top: 20,
    flexDirection: 'row',
    overflowX: 'scroll',
  },
  card: {
    width: '34%',
    justifyContent: 'space-between',
    marginRight: 24,
  },
  mobileCard: {
    width: '90%',
  },
  tabCard: {
    width: '48%',
  },
  carouselStyle: {
    height: 210,
    width: '100%',
  },
  imageStyle: {
    height: 210,
    width: '100%',
  },
});

export default SimilarProperties;
