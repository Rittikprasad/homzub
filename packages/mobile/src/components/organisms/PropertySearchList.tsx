import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { ToggleButton } from '@homzhub/common/src/components/atoms/ToggleButton';
import PropertyListCard from '@homzhub/mobile/src/components/organisms/PropertyListCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { IFilter } from '@homzhub/common/src/domain/models/Search';

interface IProps {
  properties: AssetSearch;
  getPropertiesListView: () => void;
  setFilter: (payload: IFilter) => void;
  filters: IFilter;
  favIds: number[];
  handleToggle: () => void;
  handleSortToggle: () => void;
  onSelectedProperty: (item: Asset) => void;
}

type Props = IProps & WithTranslation;

export class PropertySearchList extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { properties, t, favIds, handleToggle, handleSortToggle } = this.props;
    const foundPropertyText = (): string => {
      if (properties.count === 1) return `${properties.count} ${t('propertyFound')}`;
      if (properties.count > 1) return `${properties.count} ${t('propertiesFound')}`;
      return `0 ${t('propertiesFound')}`;
    };
    return (
      <View>
        <FlatList
          data={properties.results}
          renderItem={this.renderItem}
          keyExtractor={this.renderKeyExtractor}
          ListFooterComponent={this.renderFooter}
          ListHeaderComponent={(): React.ReactElement => (
            <Label type="large" textType="semiBold" style={styles.label}>
              {foundPropertyText()}
            </Label>
          )}
          onEndReached={this.loadMoreProperties}
          onEndReachedThreshold={0.8}
          extraData={favIds}
          testID="resultList"
          showsVerticalScrollIndicator={false}
          style={styles.container}
        />
        <ToggleButton
          onToggle={handleSortToggle}
          title={t('common:sort')}
          icon={icons.sort}
          containerStyle={styles.sortButton}
        />
        <ToggleButton
          onToggle={handleToggle}
          title={t('common:map')}
          icon={icons.map}
          containerStyle={styles.toggleButton}
        />
      </View>
    );
  }

  public renderItem = ({ item, index }: { item: Asset; index: number }): React.ReactElement => {
    const { filters, onSelectedProperty } = this.props;
    let containerStyle = {};
    if (index === 0) {
      containerStyle = { marginVertical: 0, marginBottom: 10 };
    }

    const navigateToAssetDescription = (): void => {
      const { leaseTerm, saleTerm } = item;
      if (leaseTerm) {
        onSelectedProperty(item);
      }
      if (saleTerm) {
        onSelectedProperty(item);
      }
    };
    return (
      <PropertyListCard
        property={item}
        key={item.id}
        transaction_type={filters.asset_transaction_type || 0}
        isCarousel
        onSelectedProperty={navigateToAssetDescription}
        testID="listCard"
        containerStyle={containerStyle}
        isAssetOwner={item.isAssetOwner}
      />
    );
  };

  public renderFooter = (): React.ReactElement | null => {
    const { t, properties } = this.props;
    if (properties.count === properties.results.length) {
      return null;
    }
    return (
      <Text type="regular" textType="regular" style={styles.loading}>
        {t('common:loading')}
      </Text>
    );
  };

  private renderKeyExtractor = (item: Asset, index: number): string => {
    return `${item.id}-${index}`;
  };

  public loadMoreProperties = (): void => {
    const {
      setFilter,
      getPropertiesListView,
      filters: { offset },
      properties,
    } = this.props;

    setFilter({ offset: (offset ?? 0) + properties.results.length, is_sorting: false });
    getPropertiesListView();
  };
}

export default withTranslation(LocaleConstants.namespacesKey.propertySearch)(PropertySearchList);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    marginVertical: 20,
    color: theme.colors.darkTint4,
  },
  loading: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  toggleButton: {
    position: 'absolute',
    top: 14,
    right: 16,
  },
  sortButton: {
    position: 'absolute',
    top: 14,
    right: '25%',
  },
});
