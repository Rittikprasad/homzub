import React, { Component, ReactElement } from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { AssetListingSection } from '@homzhub/common/src/components/HOC/AssetListingSection';
import { Amenity } from '@homzhub/common/src/domain/models/Amenity';

interface IProps {
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

export class AssetHighlightCard extends Component<IProps, IState> {
  public state = {
    activeSlide: 0,
  };

  public render(): React.ReactNode {
    const { title, renderCarousel } = this.props;
    const { activeSlide } = this.state;
    const formattedData = this.getFormattedData();

    return (
      <AssetListingSection title={title} containerStyles={styles.container}>
        <>
          {renderCarousel
            ? renderCarousel(formattedData, this.renderCarouselItem, activeSlide, this.onSnapToItem)
            : null}
        </>
      </AssetListingSection>
    );
  }

  private renderCarouselItem = (item: Amenity[]): React.ReactElement => {
    return (
      <FlatList
        data={item}
        numColumns={3}
        renderItem={this.renderListItem}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />
    );
  };

  private renderListItem = ({ item }: { item: Amenity }): React.ReactElement => {
    const { selectedAmenity, onAmenityPress } = this.props;
    const isSelected = selectedAmenity.includes(item.id);
    const amenityPress = (): void => {
      onAmenityPress(item.id);
    };
    return (
      <TouchableOpacity style={styles.amenityItem} onPress={amenityPress}>
        {PlatformUtils.isMobile() && (
          <SVGUri
            uri={item.attachment.link}
            height={30}
            width={30}
            stroke={isSelected ? theme.colors.active : undefined}
            strokeWidth={isSelected ? 0.5 : undefined}
          />
        )}
        <Label type="regular" textType="regular" style={[styles.label, isSelected && { color: theme.colors.blue }]}>
          {item.name}
        </Label>
      </TouchableOpacity>
    );
  };

  private onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  listContainer: {
    paddingTop: 16,
  },
  amenityItem: {
    width: (theme.viewport.width - 32) / 3,
    alignItems: 'center',
    marginVertical: 16,
  },
  label: {
    textAlign: 'center',
    color: theme.colors.darkTint4,
  },
});
