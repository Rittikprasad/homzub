import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { CollapsibleSection } from '@homzhub/mobile/src/components/molecules/CollapsibleSection';
import { Asset, IListData } from '@homzhub/common/src/domain/models/Asset';
import { AssetFeature } from '@homzhub/common/src/domain/models/AssetFeature';
import { CategoryAmenityGroup } from '@homzhub/common/src/domain/models/Amenity';
import { AssetHighlight } from '@homzhub/common/src/domain/models/AssetHighlight';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  detail?: Asset | null;
  isCollapsible?: boolean;
  isFromPortfolio: boolean;
}

interface IDetailState {
  descriptionShowMore: boolean;
  descriptionHide: boolean;
  amenitiesShowAll: boolean;
}

type Props = IProps & WithTranslation;

class PropertyDetail extends Component<Props, IDetailState> {
  public state = {
    descriptionShowMore: false,
    descriptionHide: true,
    amenitiesShowAll: false,
  };

  public render(): React.ReactElement {
    const { t, isCollapsible = true, detail, isFromPortfolio = false } = this.props;
    return (
      <>
        {isFromPortfolio && (
          <CollapsibleSection
            title={isFromPortfolio ? t('assetPortfolio:propertyAddress') : t('property:address')}
            isDividerRequired
            isCollapsibleRequired={isCollapsible}
            titleStyle={isFromPortfolio ? styles.title : undefined}
          >
            <Label type="large" textType="regular" style={styles.description}>
              {detail?.address}
            </Label>
            {isFromPortfolio && this.renderPropertyAddress()}
          </CollapsibleSection>
        )}
        {isFromPortfolio && (
          <>
            <CollapsibleSection
              title={t('assetPortfolio:propertyDetails')}
              isDividerRequired
              isCollapsibleRequired={isCollapsible}
              titleStyle={isFromPortfolio ? styles.title : undefined}
            >
              {this.renderPropertyDetails()}
            </CollapsibleSection>
            <CollapsibleSection
              title={t('assetPortfolio:propertyDescription')}
              isDividerRequired
              isCollapsibleRequired={isCollapsible}
              titleStyle={isFromPortfolio ? styles.title : undefined}
            >
              {this.renderPropertyDescription()}
            </CollapsibleSection>
          </>
        )}

        {!isFromPortfolio && (
          <CollapsibleSection
            title={t('description')}
            isDividerRequired
            isCollapsibleRequired={isCollapsible}
            titleStyle={isFromPortfolio ? styles.title : undefined}
          >
            {this.renderAssetDescription()}
          </CollapsibleSection>
        )}
        {!isFromPortfolio && (
          <CollapsibleSection
            title={t('factsFeatures')}
            isDividerRequired
            isCollapsibleRequired={isCollapsible}
            titleStyle={isFromPortfolio ? styles.title : undefined}
          >
            {this.renderFactsAndFeatures()}
          </CollapsibleSection>
        )}
        {this.renderAmenities()}
        <CollapsibleSection
          title={t('highlights')}
          isDividerRequired
          isCollapsibleRequired={isCollapsible}
          titleStyle={isFromPortfolio ? styles.title : undefined}
        >
          {this.renderAssetHighlights()}
        </CollapsibleSection>

        {isFromPortfolio && Boolean(detail?.leaseDetails && detail.leaseDetails.length > 0) && (
          <CollapsibleSection
            title={t('property:leaseDetails')}
            isCollapsibleRequired={isCollapsible}
            titleStyle={isFromPortfolio ? styles.title : undefined}
          >
            {this.renderLeaseDetails()}
          </CollapsibleSection>
        )}

        {isFromPortfolio && Boolean(detail?.saleDetails && detail.saleDetails.length > 0) && (
          <CollapsibleSection
            title={t('property:saleDetails')}
            isCollapsibleRequired={isCollapsible}
            titleStyle={isFromPortfolio ? styles.title : undefined}
          >
            {this.renderSaleDetails()}
          </CollapsibleSection>
        )}
      </>
    );
  }

  private renderPropertyAddress = (): React.ReactElement | null => {
    const { t, detail } = this.props;
    if (!detail) return null;

    return (
      <FlatList
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        data={detail.addressDetails}
        keyExtractor={(item: IListData, index: number): string => `${item.label}[${index}]`}
        ListEmptyComponent={(): React.ReactElement => (
          <Label type="large" textType="regular" style={styles.description}>
            {t('noInformation')}
          </Label>
        )}
        renderItem={({ item }: { item: IListData }): React.ReactElement => (
          <View style={styles.featureItem}>
            <Label type="large" textType="regular" style={styles.featureTitle}>
              {item.label}
            </Label>
            <Label type="large" textType="semiBold">
              {item.value}
            </Label>
          </View>
        )}
      />
    );
  };

  private renderAssetDescription = (): React.ReactElement => {
    const { t, detail } = this.props;
    const { descriptionShowMore, descriptionHide } = this.state;

    const onLayout = (event: any): void => {
      const { lines } = event.nativeEvent;
      if (lines.length > 3 || (lines.length === 3 && lines[2].text.includes('\n'))) {
        this.setState({ descriptionHide: false });
      }
    };

    const onPress = (): void => {
      this.setState({ descriptionShowMore: !descriptionShowMore });
    };

    const descriptionValue = (): string | undefined => {
      if (!detail) {
        return t('noDescription');
      }
      const { leaseTerm, saleTerm, description } = detail;
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
      <>
        <Label
          type="large"
          textType="regular"
          style={styles.description}
          // @ts-ignore
          onTextLayout={onLayout}
          numberOfLines={descriptionShowMore ? undefined : 3}
        >
          {descriptionValue()}
        </Label>
        {!descriptionHide && (
          <Label type="large" textType="semiBold" style={styles.helperText} onPress={onPress}>
            {descriptionShowMore ? t('property:showLess') : t('property:showMore')}
          </Label>
        )}
      </>
    );
  };

  private renderLeaseDetails = (): React.ReactElement | null => {
    const { t, detail } = this.props;
    if (!detail) return null;

    return (
      <>
        <Label type="large" textType="regular" style={styles.topMargin}>
          {t('assetPortfolio:propertyDescription')}
        </Label>
        <Label type="large" textType="semiBold">
          {detail.address}
        </Label>

        <FlatList
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          data={detail.leaseDetails}
          keyExtractor={(item: AssetFeature, index: number): string => `${item.name}[${index}]`}
          renderItem={({ item }: { item: AssetFeature }): React.ReactElement => (
            <View style={styles.featureItem}>
              <Label type="large" textType="regular" style={styles.featureTitle}>
                {item.name}
              </Label>
              <Label type="large" textType="semiBold">
                {['lease_started_from', 'available_from'].includes(item.localeKey)
                  ? DateUtils.getDisplayDate(item.value, DateFormats.DD_MM_YYYY)
                  : item.value}
              </Label>
            </View>
          )}
        />
      </>
    );
  };

  private renderSaleDetails = (): React.ReactElement | null => {
    const { t, detail } = this.props;
    if (!detail) return null;

    return (
      <>
        <Label type="large" textType="regular" style={styles.topMargin}>
          {t('assetPortfolio:propertyDescription')}
        </Label>
        <Label type="large" textType="semiBold">
          {detail.address}
        </Label>

        <FlatList
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          data={detail.saleDetails}
          keyExtractor={(item: AssetFeature, index: number): string => `${item.name}[${index}]`}
          renderItem={({ item }: { item: AssetFeature }): React.ReactElement => (
            <View style={styles.featureItem}>
              <Label type="large" textType="regular" style={styles.featureTitle}>
                {item.name}
              </Label>
              <Label type="large" textType="semiBold">
                {['available_from'].includes(item.localeKey)
                  ? DateUtils.getDisplayDate(item.value, DateFormats.DD_MM_YYYY)
                  : item.value}
              </Label>
            </View>
          )}
        />
      </>
    );
  };

  private renderPropertyDetails = (): React.ReactElement | null => {
    const { t, detail } = this.props;
    if (!detail) return null;

    const nonMiscSpaces = detail.spaces
      .filter((space) => !space.isMiscellaneous)
      .map((item) => ({
        // Todo (Praharsh) : Remove after BE does this.
        label: item.count > 1 && ['Bedroom', 'Bathroom'].includes(item.name) ? `${item.name}(s)` : item.name,
        value: `${item.count}`,
      }));

    const miscSpaces = detail.spaces.filter((space) => space.isMiscellaneous);
    const miscData = [
      {
        label: t('common:others'),
        value: miscSpaces.map((item) => item.name).join(','),
      },
    ];
    const typeData = [
      {
        label: t('property:propertyType'),
        value: detail.assetGroup.name,
      },
      {
        label: t('property:propertySubtype'),
        value: detail.assetType.name,
      },
    ];

    const data = [...typeData, ...nonMiscSpaces, ...(miscSpaces.length > 0 ? [...miscData] : [])];

    return (
      <FlatList
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        data={data}
        keyExtractor={(item: IListData, index: number): string => `${item.label}[${index}]`}
        ListEmptyComponent={(): React.ReactElement => (
          <Label type="large" textType="regular" style={styles.description}>
            {t('noInformation')}
          </Label>
        )}
        renderItem={({ item }: { item: IListData }): React.ReactElement => (
          <View style={styles.featureItem}>
            <Label type="large" textType="regular" style={styles.featureTitle}>
              {item.label}
            </Label>
            <Label type="large" textType="semiBold">
              {item.value}
            </Label>
          </View>
        )}
      />
    );
  };

  private renderPropertyDescription = (): React.ReactElement | null => {
    const { t, detail } = this.props;
    if (!detail) return null;

    const data = detail.propertyDescription;

    return (
      <FlatList
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        data={data}
        keyExtractor={(item: AssetFeature, index: number): string => `${item.localeKey}[${index}]`}
        ListEmptyComponent={(): React.ReactElement => (
          <Label type="large" textType="regular" style={styles.description}>
            {t('noInformation')}
          </Label>
        )}
        renderItem={({ item }: { item: AssetFeature }): React.ReactElement => {
          return (
            <View style={styles.featureItem}>
              <Label type="large" textType="regular" style={styles.featureTitle}>
                {item.name}
              </Label>
              <Label type="large" textType="semiBold">
                {item.value.length ? item.value : 'N/A'}
              </Label>
            </View>
          );
        }}
      />
    );
  };

  private renderFactsAndFeatures = (): React.ReactElement => {
    const { t, detail } = this.props;
    return (
      <FlatList<AssetFeature>
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        data={detail?.features ?? []}
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

  private renderAmenities = (): React.ReactElement => {
    const { t, detail, isFromPortfolio = false } = this.props;
    const { amenitiesShowAll } = this.state;
    const length = detail?.amenityGroup?.amenities.length ?? 0;
    let data = detail?.amenityGroup?.amenities ?? [];

    if (length > 6 && !amenitiesShowAll) {
      data = data.slice(0, 6);
    }

    const onPress = (): void => {
      this.setState({ amenitiesShowAll: !amenitiesShowAll });
    };

    return (
      <View style={styles.sectionContainer}>
        <Text type="small" textType="semiBold" style={isFromPortfolio ? styles.textColorTint1 : styles.textColorTint4}>
          {t('amenities')}
        </Text>
        {length < 1 ? (
          <Label type="large" textType="regular" style={styles.description}>
            {t('noAmenities')}
          </Label>
        ) : (
          <>
            <FlatList
              numColumns={3}
              contentContainerStyle={styles.listContainer}
              data={data}
              keyExtractor={(item: CategoryAmenityGroup): string => `${item.id}`}
              renderItem={({ item }: { item: CategoryAmenityGroup }): React.ReactElement => (
                <View style={styles.amenityItem}>
                  <SVGUri uri={item.attachment.link} height={30} width={30} />
                  <Label type="regular" textType="regular" style={styles.amenityText}>
                    {item.name}
                  </Label>
                </View>
              )}
            />
            {length > 6 && (
              <Label type="large" textType="semiBold" style={styles.helperText} onPress={onPress}>
                {amenitiesShowAll ? t('property:showLess') : t('property:showAll', { total: length })}
              </Label>
            )}
          </>
        )}
        <Divider containerStyles={styles.divider} />
      </View>
    );
  };

  private renderAssetHighlights = (): React.ReactElement => {
    const { t, detail } = this.props;
    if (!detail || !detail?.highlights || detail?.highlights.length < 1) {
      return (
        <Label type="large" textType="regular" style={styles.description}>
          {t('noHighlights')}
        </Label>
      );
    }
    const selectedValues = detail?.highlights.filter((item) => item.covered).length;
    if (selectedValues === 0) {
      return (
        <Label type="large" textType="regular" style={styles.description}>
          {t('noHighlights')}
        </Label>
      );
    }
    const filterData = detail.highlights.filter((item) => item.covered);

    return (
      <FlatList<AssetHighlight>
        data={filterData}
        numColumns={2}
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
}

export default withTranslation(LocaleConstants.namespacesKey.assetDescription)(PropertyDetail);

const styles = StyleSheet.create({
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
  textColorTint1: {
    color: theme.colors.darkTint1,
  },
  textColorTint4: {
    color: theme.colors.darkTint4,
  },
  sectionContainer: {
    marginTop: 24,
  },
  divider: {
    marginTop: 24,
    borderColor: theme.colors.darkTint10,
  },
  topMargin: {
    marginTop: 12,
    marginBottom: 4,
  },
  title: {
    color: theme.colors.darkTint1,
  },
});
