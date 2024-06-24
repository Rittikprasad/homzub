import React, { Component, ReactElement } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, View } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import { AssetListingSection } from '@homzhub/common/src/components/HOC/AssetListingSection';
import { Amenity } from '@homzhub/common/src/domain/models/Amenity';
import '@homzhub/common/src/components/molecules/AssetHighlightCard/AssetHighlightCard.scss';

interface IOwnProps {
  title: string;
  data: Amenity[];
  selectedAmenity: number[];
  onAmenityPress: (id: number) => void;
  renderCarousel?: (
    data: Amenity[][],
    renderItem: (item: Amenity[]) => ReactElement,
    activeSlide: number,
    onSnap: (slideNumber: number) => void
  ) => ReactElement;
}

interface IState {
  activeSlide: number;
}

type IProps = IOwnProps & IWithMediaQuery;

class AssetHighlightCard extends Component<IProps, IState> {
  public render(): React.ReactNode {
    const { title, isMobile } = this.props;
    const formattedData = this.getFormattedData();

    return (
      <AssetListingSection title={title} containerStyles={styles.container}>
        <>
          {isMobile ? (
            <View style={styles.snapCarouselWeb}>
              <MultiCarousel>
                {formattedData.map((item) => {
                  return this.renderCarouselItem(item);
                })}
              </MultiCarousel>
            </View>
          ) : (
            this.renderAmenitiesListWeb()
          )}
        </>
      </AssetListingSection>
    );
  }

  private renderCarouselItem = (item: Amenity[]): React.ReactElement => {
    const { isMobile } = this.props;
    return (
      <FlatList
        data={item}
        numColumns={PlatformUtils.isMobile() || isMobile ? 3 : 10}
        renderItem={this.renderListItem}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  private renderAmenitiesListWeb = (): React.ReactElement => {
    const { data } = this.props;

    return (
      <View style={styles.amenitiesListWebConatiner}>
        {data.map((amenity) => (
          <View key={amenity.id}>{this.renderListItem({ item: amenity })}</View>
        ))}
      </View>
    );
  };

  private renderListItem = ({ item }: { item: Amenity }): React.ReactElement => {
    const { selectedAmenity, onAmenityPress, isMobile } = this.props;
    const isSelected = selectedAmenity.includes(item.id);
    const amenityPress = (): void => {
      onAmenityPress(item.id);
    };
    return (
      <TouchableOpacity style={[isMobile ? styles.amenityItemWebMobile : styles.amenityItem]} onPress={amenityPress}>
        <div className={isSelected ? 'asset-icon-selected' : 'asset-icon'}>
          <Image source={{ uri: item.attachment.link }} style={styles.amenitiesIcon} />
        </div>
        <Label type="regular" textType="regular" style={[styles.label, isSelected && { color: theme.colors.blue }]}>
          {item.name}
        </Label>
      </TouchableOpacity>
    );
  };

  private getFormattedData = (): Amenity[][] => {
    const { data } = this.props;

    let index;
    const arrayLength = data.length;
    const tempArray = [];
    let chunk = [];
    for (index = 0; index < arrayLength; index += 9) {
      chunk = data.slice(index, index + 9);
      tempArray.push(chunk);
    }
    return tempArray;
  };
}

const assetHighlightCard = withMediaQuery<IProps>(AssetHighlightCard);
export { assetHighlightCard as AssetHighlightCard };
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  listContainer: {
    paddingTop: 16,
  },
  amenitiesListWebConatiner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    width: 120,
    alignItems: 'center',
    marginVertical: 16,
  },
  amenityItemWebMobile: {
    width: '33%',
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    textAlign: 'center',
  },
  amenitiesIcon: {
    width: 25,
    height: 25,
  },
  snapCarouselWeb: {
    width: '78vw',
  },
});
