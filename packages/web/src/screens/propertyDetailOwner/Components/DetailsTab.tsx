import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { AssetFeature } from '@homzhub/common/src/domain/models/AssetFeature';
import { AssetHighlight } from '@homzhub/common/src/domain/models/AssetHighlight';
import { AmenityGroup, CategoryAmenityGroup } from '@homzhub/common/src/domain/models/Amenity';
import { LeaseTerm } from '@homzhub/common/src/domain/models/LeaseTerm';
import { SaleTerm } from '@homzhub/common/src/domain/models/SaleTerm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  description: string;
  features: AssetFeature[];
  leaseTerm: LeaseTerm | null;
  saleTerm: SaleTerm | null;
  amenityGroup: AmenityGroup | null;
  assetHighlights: AssetHighlight[];
}

const DetailsTab = (props: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDescription);
  const { description, features, leaseTerm, saleTerm, amenityGroup, assetHighlights } = props;
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const renderFactsAndFeatures = (): React.ReactElement => {
    return (
      <FlatList<AssetFeature>
        key={isTablet ? 'Asset-Feature-Tab' : isMobile ? 'Asset-Feature-Mobile' : 'Asset-Feature-Desktop'}
        numColumns={isTablet ? 3 : isMobile ? 2 : 4}
        contentContainerStyle={styles.listContainer}
        data={features ?? []}
        keyExtractor={(item: AssetFeature): string => item.name}
        ListEmptyComponent={(): React.ReactElement => (
          <Label type="large" textType="regular" style={styles.description}>
            {t('noInformation')}
          </Label>
        )}
        renderItem={({ item }: { item: AssetFeature }): React.ReactElement => (
          <View style={styles.featureItem}>
            <Label type="large" textType="regular" style={styles.featureTitle}>
              {item.name}
            </Label>
            <Label type="large" textType="semiBold">
              {StringUtils.toTitleCase(item.value.replace('_', ' '))}
            </Label>
          </View>
        )}
      />
    );
  };

  const renderAmenities = (): React.ReactElement => {
    const length = amenityGroup?.amenities.length ?? 0;
    const data = amenityGroup?.amenities ?? [];

    return (
      <View style={styles.sectionContainer}>
        {length < 1 ? (
          <Label type="large" textType="regular" style={styles.description}>
            {t('noAmenities')}
          </Label>
        ) : (
          <>
            <FlatList
              key={isTablet ? 'Asset-Amenities-Tab' : isMobile ? 'Asset-Amenities-Mobile' : 'Asset-Amenities-Desktop'}
              numColumns={isTablet ? 4 : isMobile ? 2 : 6}
              contentContainerStyle={styles.listContainer}
              data={data}
              keyExtractor={(item: CategoryAmenityGroup): string => `${item.id}`}
              renderItem={({ item }: { item: CategoryAmenityGroup }): React.ReactElement => (
                <View
                  style={[styles.amenityItem, isTablet && styles.amenityItemTab, isMobile && styles.amenityItemMobile]}
                >
                  <Image source={{ uri: item.attachment.link }} style={styles.amenitiesIcon} />
                  <Label type="regular" textType="regular" style={styles.amenityText}>
                    {item.name}
                  </Label>
                </View>
              )}
            />
          </>
        )}
        <Divider containerStyles={styles.divider} />
      </View>
    );
  };

  const renderAssetHighlights = (): React.ReactElement => {
    if (assetHighlights && assetHighlights.length < 1) {
      return (
        <Label type="large" textType="regular" style={styles.description}>
          {t('noHighlights')}
        </Label>
      );
    }
    const selectedValues = assetHighlights.filter((item: AssetHighlight) => item.covered).length;
    if (selectedValues === 0) {
      return (
        <Label type="large" textType="regular" style={styles.description}>
          {t('noHighlights')}
        </Label>
      );
    }
    const filterData = assetHighlights.filter((item: AssetHighlight) => item.covered);

    return (
      <FlatList<AssetHighlight>
        data={filterData}
        key={isTablet ? 'Asset-Highlight-Tab' : isMobile ? 'Asset-Highlight-Mobile' : 'Asset-Highlight-Desktop'}
        numColumns={isTablet ? 4 : isMobile ? 2 : 6}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item: AssetHighlight): string => `${item.name}`}
        renderItem={({ item }: { item: AssetHighlight }): React.ReactElement | null => {
          return (
            <View style={styles.highlightItemContainer}>
              <Icon name={icons.check} color={theme.colors.completed} size={22} />
              <Label type="large" textType="regular" style={styles.highlightText}>
                {item.name}
              </Label>
            </View>
          );
        }}
      />
    );
  };

  const descriptionValue = (): string => {
    if (leaseTerm && leaseTerm.description !== '') {
      return leaseTerm.description;
    }
    if (saleTerm && saleTerm.description !== '') {
      return saleTerm.description;
    }
    if (description === '') {
      return t('noDescription');
    }
    return description;
  };

  return (
    <View style={styles.container}>
      <Typography variant="text" size="regular" fontWeight="semiBold">
        {t('description')}
      </Typography>
      <Typography variant="label" size="large" style={styles.description}>
        {descriptionValue()}
      </Typography>
      <br />
      <View style={styles.divider}>
        <Typography variant="text" size="regular" fontWeight="semiBold" style={styles.titleText}>
          {t('factsFeatures')}
        </Typography>
        {renderFactsAndFeatures()}
      </View>
      <View>
        <View style={styles.divider}>
          <Typography variant="text" size="regular" fontWeight="semiBold" style={styles.titleText}>
            {t('amenities')}
          </Typography>
          {renderAmenities()}
        </View>
        <Typography variant="text" size="regular" fontWeight="semiBold">
          {t('highlights')}
        </Typography>
        {renderAssetHighlights()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 24,
    marginBottom: 24,
  },
  descriptionText: {
    lineHeight: 27,
    colors: theme.colors.darkTint4,
  },
  listContainer: {
    marginTop: 16,
  },
  highlightItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginRight: 16,
  },
  description: {
    color: theme.colors.darkTint4,
    marginTop: 12,
  },
  helperText: {
    marginTop: 12,
    color: theme.colors.active,
  },
  highlightText: {
    color: theme.colors.darkTint4,
    marginStart: 16,
  },
  featureTitle: {
    color: theme.colors.darkTint4,
    marginBottom: 4,
  },
  amenityText: {
    color: theme.colors.darkTint4,
    marginTop: 4,
    textAlign: 'center',
  },
  textColor: {
    color: theme.colors.darkTint4,
  },
  sectionContainer: {
    marginTop: 24,
  },
  divider: {
    marginVertical: 12,
    borderColor: theme.colors.darkTint10,
    borderTopWidth: 2,
  },
  titleText: {
    marginTop: 12,
  },
  featureItem: {
    flex: 1,
    marginBottom: 16,
  },
  amenityItem: {
    width: (theme.viewport.width - 32) / 7,
    alignItems: 'center',
    marginBottom: 16,
  },
  amenityItemTab: {
    width: (theme.viewport.width - 32) / 5,
  },
  amenityItemMobile: {
    width: (theme.viewport.width - 32) / 2.6,
  },
  amenitiesIcon: {
    width: 25,
    height: 25,
  },
});

export default DetailsTab;
