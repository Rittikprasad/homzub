import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';

interface IProps {
  propertyData: Asset;
}

const MarkerCard: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { propertyData } = props;
  const { address, carpetArea, projectName, country, leaseTerm, saleTerm, attachments, carpetAreaUnit } = propertyData;
  const trimmedProjectName = projectName.split(',')[0];
  const currency = country.currencies[0];
  const areaUnit = carpetAreaUnit ? carpetAreaUnit.title : t('property:sqft');
  const price = saleTerm ? Number(saleTerm.expectedPrice) : leaseTerm ? Number(leaseTerm.expectedPrice) : 0;
  const propertyStatus = leaseTerm ? t('property:forRental') : t('property:forSale');
  const propertyImage = attachments[0]?.link;
  const isImage = !!propertyImage;
  return (
    <View style={styles.container}>
      <View style={styles.upperSection}>
        {propertyImage ? (
          <Image
            style={styles.image}
            source={{
              uri: propertyImage,
            }}
          />
        ) : (
          <ImagePlaceholder />
        )}
        <View style={[styles.propertyStatusLabelContainer, styles.details]}>
          <Typography variant="label" size="regular" style={styles.propertyStatusLabel}>
            {propertyStatus}
          </Typography>
        </View>
        <View style={styles.imageFooter}>
          <Typography variant="text" size="regular" style={[styles.details, styles.amountLabel]}>
            <PricePerUnit
              price={price}
              currency={currency}
              unit={t('property:mo')}
              textStyle={[!isImage && styles.noImage]}
            />
          </Typography>
          <View style={[styles.details, styles.areaDetails]}>
            <Icon name={icons.area} size={20} color={!isImage ? theme.colors.darkTint1 : theme.colors.white} />
            <Typography variant="label" size="large" style={[styles.propertyStatusLabel, !isImage && styles.noImage]}>
              {carpetArea} {areaUnit}
            </Typography>
          </View>
        </View>
      </View>

      <View style={[styles.lowerSection]}>
        <Typography variant="text" size="regular" style={styles.propertyName}>
          {trimmedProjectName}
        </Typography>
        <Typography variant="label" size="regular" style={styles.propertyLocation}>
          {address}
        </Typography>
      </View>
      <View style={styles.caret} />
    </View>
  );
};

export default MarkerCard;

const styles = StyleSheet.create({
  container: {
    width: 300,
  },
  upperSection: {
    borderRadius: 4,
    height: 200,
  },
  lowerSection: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  propertyStatusLabelContainer: {
    borderRadius: 2,
    backgroundColor: theme.colors.imageVideoPaginationBackground,
    top: 20,
    left: 20,
  },
  image: {
    width: 300,
    height: 200,
    position: 'relative',
  },
  details: {
    position: 'absolute',
  },
  icon: {
    top: 20,
    right: 20,
  },
  amountLabel: {
    left: 16,
    bottom: 8,
    color: theme.colors.white,
  },
  areaDetails: {
    right: 20,
    bottom: 8,
    flexDirection: 'row',
  },
  propertyStatusLabel: {
    color: theme.colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  propertyName: {
    color: theme.colors.blue,
  },
  propertyLocation: {
    color: theme.colors.darkTint3,
  },
  noImage: {
    color: theme.colors.darkTint1,
  },
  imageFooter: {
    justifyContent: 'space-between',
  },
  caret: {
    width: 20,
    height: 20,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    backgroundColor: theme.colors.white,
    top: '97.5%',
    left: '45%',
  },
});
