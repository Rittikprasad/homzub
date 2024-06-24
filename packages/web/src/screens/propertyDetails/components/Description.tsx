import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { AssetFeature } from '@homzhub/common/src/domain/models/AssetFeature';
import { LeaseTerm } from '@homzhub/common/src/domain/models/LeaseTerm';
import { SaleTerm } from '@homzhub/common/src/domain/models/SaleTerm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  description: string;
  features: AssetFeature[];
  leaseTerm: LeaseTerm | null;
  saleTerm: SaleTerm | null;
}

const Description = (props: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDescription);
  const { description, features, leaseTerm, saleTerm } = props;
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

  const descriptionValue = (): string | undefined => {
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
  featureItem: {
    flex: 1,
    marginBottom: 16,
  },
  amenityItem: {
    width: (theme.viewport.width - 32) / 3.4,
    alignItems: 'center',
    marginBottom: 16,
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
});

export default Description;
