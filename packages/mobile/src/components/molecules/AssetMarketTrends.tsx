import React from 'react';
import { FlatList, ImageBackground, StyleSheet, TouchableOpacity, View, Keyboard } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import { MarketTrendsResults, MarketTrendType } from '@homzhub/common/src/domain/models/MarketTrends';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  isDashboard?: boolean;
  onViewAll?: () => void;
  onTrendPress: (url: string, id: number) => void;
}

interface IMarketTrendsState {
  data: MarketTrendsResults[];
  selectedType: MarketTrendType;
  searchQuery: string;
}

export class AssetMarketTrends extends React.PureComponent<IProps, IMarketTrendsState> {
  public state = {
    data: [],
    selectedType: MarketTrendType.PERSPECTIVE,
    searchQuery: '',
  };

  private debouncedSearch = debounce(() => {
    this.getMarketTrends(true).then();
  }, 500);

  public componentDidMount = async (): Promise<void> => {
    await this.getMarketTrends(true);
  };

  public render(): React.ReactNode {
    const { t, isDashboard = false } = this.props;
    const { data } = this.state;

    return (
      <View style={[styles.container, isDashboard && styles.headerView]}>
        {this.renderHeader()}
        {data.length > 0 ? (
          <FlatList
            data={data}
            initialNumToRender={30}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderTrends}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.8}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState title={t('assetMore:noTrends')} />
        )}
      </View>
    );
  }

  private renderHeader = (): React.ReactNode => {
    const { onViewAll, t, isDashboard = false } = this.props;
    const { data, selectedType, searchQuery } = this.state;

    if (isDashboard) {
      return (
        <View style={styles.header}>
          <Icon name={icons.increase} color={theme.colors.darkTint4} size={20} />
          <Text type="small" textType="semiBold" style={styles.headerText}>
            {t('marketTrends')}
          </Text>
          {data.length > 0 && (
            <Label type="large" textType="semiBold" onPress={onViewAll} style={styles.viewAll}>
              {t('viewAll')}
            </Label>
          )}
        </View>
      );
    }

    return (
      <View>
        <SelectionPicker<MarketTrendType>
          data={[
            { title: 'Perspective', value: MarketTrendType.PERSPECTIVE },
            { title: 'Video', value: MarketTrendType.VIDEO },
          ]}
          selectedItem={[selectedType]}
          onValueChange={this.onTabChange}
        />
        <SearchBar
          placeholder={t('searchByKeyword')}
          value={searchQuery}
          updateValue={this.onUpdateSearchText}
          containerStyle={styles.searchBar}
        />
      </View>
    );
  };

  public renderTrends = ({ item }: { item: MarketTrendsResults }): React.ReactElement => {
    const { title, postedAtDate, link, imageUrl, id, trendType } = item;
    const { onTrendPress } = this.props;

    const onLinkPress = (): void => {
      onTrendPress(link, id);
    };

    return (
      <TouchableOpacity onPress={onLinkPress} style={styles.trendContainer} testID="linkTouch">
        {imageUrl ? (
          <ImageBackground source={{ uri: imageUrl }} style={styles.image}>
            {trendType === MarketTrendType.VIDEO && (
              <View style={styles.videoOverlay}>
                <Icon name={icons.play} size={28} color={theme.colors.white} />
              </View>
            )}
          </ImageBackground>
        ) : (
          <ImagePlaceholder height={80} width={80} containerStyle={styles.placeHolderImage} />
        )}
        <View style={styles.trendValuesContainer}>
          <Label type="large" textType="regular" style={styles.trendHeader} numberOfLines={2}>
            {title}
          </Label>
          <View style={styles.trendData}>
            <Label type="regular" textType="regular" style={styles.trendDate}>
              {postedAtDate}
            </Label>
            <Icon name={icons.dart} color={theme.colors.primaryColor} size={18} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  private onTabChange = (newType: MarketTrendType): void => {
    Keyboard.dismiss();
    this.setState({ selectedType: newType, searchQuery: '' }, () => {
      this.getMarketTrends(true).then();
    });
  };

  private onUpdateSearchText = (searchQuery: string): void => {
    this.setState({ searchQuery }, this.debouncedSearch);
  };

  private onEndReached = (): void => {
    const { isDashboard = false } = this.props;
    if (isDashboard) {
      return;
    }
    this.getMarketTrends().then();
  };

  public getMarketTrends = async (reset = false): Promise<void> => {
    const { isDashboard } = this.props;
    const { selectedType, searchQuery, data } = this.state;

    let limit = 10;
    let trend_type: MarketTrendType | undefined = selectedType;
    let q: string | undefined = searchQuery;
    if (isDashboard) {
      limit = 2;
      trend_type = undefined;
      q = undefined;
    }

    try {
      const response = await CommonRepository.getMarketTrends({
        limit,
        trend_type,
        q,
        offset: reset ? 0 : data.length,
      });

      this.setState({ data: reset ? response.results : [...data, ...response.results] });
    }catch (err: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  };

  private keyExtractor = (item: MarketTrendsResults): string => `${item.id}`;
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(AssetMarketTrends);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerText: {
    marginStart: 12,
    flex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.background,
  },
  viewAll: {
    color: theme.colors.primaryColor,
  },
  trendDate: {
    color: theme.colors.darkTint5,
  },
  trendValuesContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginStart: 12,
  },
  trendData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendHeader: {
    color: theme.colors.darkTint2,
    flexWrap: 'wrap',
  },
  videoOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.overlay,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  placeHolderImage: {
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
    borderRadius: 4,
  },
  headerView: {
    marginTop: 16,
  },
  searchBar: {
    marginVertical: 16,
  },
});
