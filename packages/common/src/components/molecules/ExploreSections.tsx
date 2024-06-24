import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PlaceTypes } from '@homzhub/common/src/services/GooglePlaces/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { MetricSystems } from '@homzhub/common/src/domain/models/UserPreferences';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PointOfInterest } from '@homzhub/common/src/services/GooglePlaces/interfaces';

interface IPlaceTypeData {
  key: PlaceTypes;
  label: string;
  icon: string;
  mapMarker: string;
}

interface IProps extends WithTranslation {
  placeTypes: IPlaceTypeData[];
  selectedPlaceType: IPlaceTypeData;
  onPlaceTypePress: (newSection: PlaceTypes) => void;
  pointsOfInterest: PointOfInterest[];
  selectedPoiId: string;
  metricSystem: MetricSystems;
  onPoiPress: (poi: PointOfInterest) => void;
}

export class ExploreSections extends React.PureComponent<IProps> {
  public render = (): React.ReactNode => {
    const { placeTypes, pointsOfInterest, selectedPlaceType, selectedPoiId, t } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.shadowContainer}>
          <FlatList<IPlaceTypeData>
            horizontal
            showsHorizontalScrollIndicator={false}
            data={placeTypes}
            renderItem={this.renderSectionItem}
            contentContainerStyle={styles.sectionsContainer}
            extraData={selectedPlaceType.key}
            keyExtractor={this.keyExtractorSections}
            testID="placesList"
          />
        </View>
        {pointsOfInterest.length > 0 ? (
          <FlatList<PointOfInterest>
            style={styles.resultContainer}
            showsVerticalScrollIndicator={false}
            data={pointsOfInterest}
            ListHeaderComponent={this.renderListHeader}
            renderItem={this.renderPOI}
            extraData={selectedPoiId}
            keyExtractor={this.keyExtractorResult}
            testID="interestList"
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Icon name={icons.search} size={30} color={theme.colors.disabledSearch} />
            <Text type="small" textType="semiBold" style={styles.noResultText}>
              {t('common:noResultsFound')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  private renderSectionItem = ({ item }: { item: IPlaceTypeData }): React.ReactElement => {
    const { selectedPlaceType, onPlaceTypePress } = this.props;
    const { icon, key } = item;
    let backgroundColor = theme.colors.background;
    let iconColor = theme.colors.active;

    if (key === selectedPlaceType.key) {
      backgroundColor = theme.colors.active;
      iconColor = theme.colors.white;
    }

    const onPress = (): void => onPlaceTypePress(key);

    return (
      <TouchableOpacity onPress={onPress} style={[styles.iconContainer, { backgroundColor }]} testID="iconPress">
        <Icon size={24} name={icon} color={iconColor} />
      </TouchableOpacity>
    );
  };

  private renderListHeader = (): React.ReactElement => {
    const { selectedPlaceType, t } = this.props;

    return (
      <>
        <View style={styles.listHeader}>
          <Icon name={selectedPlaceType.icon} size={24} color={theme.colors.darkTint4} />
          <Text type="small" style={styles.title}>
            {t(selectedPlaceType.label)}
          </Text>
        </View>
        <Divider containerStyles={styles.divider} />
      </>
    );
  };

  private renderPOI = ({ item }: { item: PointOfInterest }): React.ReactElement => {
    const { selectedPlaceType, selectedPoiId, onPoiPress, metricSystem } = this.props;
    const { name, distanceFromOrigin, placeId } = item;

    let color = theme.colors.darkTint5;
    if (selectedPoiId === placeId) {
      color = theme.colors.active;
    }

    const onResultPress = (): void => {
      onPoiPress(item);
    };

    return (
      <TouchableOpacity onPress={onResultPress} style={styles.resultItem} testID="resultPress">
        <View style={styles.resultNameContainer}>
          <Icon name={selectedPlaceType.mapMarker} size={16} color={color} />
          <Label type="large" style={[styles.title, { color }]} numberOfLines={1}>
            {name}
          </Label>
        </View>
        <Label type="regular" style={{ color }}>
          {`${
            metricSystem === MetricSystems.METERS ? Math.ceil(distanceFromOrigin) : distanceFromOrigin.toFixed(2)
          } ${metricSystem}`}
        </Label>
      </TouchableOpacity>
    );
  };

  private keyExtractorResult = (item: PointOfInterest): string => item.placeId;
  private keyExtractorSections = (item: IPlaceTypeData, index: number): string => `${item.key}-${index}`;
}

export default withTranslation(LocaleConstants.namespacesKey.assetDescription)(ExploreSections);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  iconContainer: {
    padding: 12,
    marginEnd: 16,
    borderRadius: 4,
    backgroundColor: theme.colors.background,
  },
  shadowContainer: {
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    paddingBottom: 12,
  },
  sectionsContainer: {
    paddingStart: 16,
  },
  resultContainer: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 16,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: {
    flexDirection: 'row',
  },
  divider: {
    marginVertical: 12,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: 232,
    paddingStart: 12,
    color: theme.colors.darkTint4,
  },
  noResultText: {
    color: theme.colors.darkTint3,
    marginVertical: 10,
  },
});
