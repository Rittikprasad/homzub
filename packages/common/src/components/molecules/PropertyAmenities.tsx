import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { AmenitiesIcon } from '@homzhub/common/src/components/atoms/AmenitiesIcon';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';

export interface IAmenitiesData {
  icon: string;
  iconSize?: number;
  iconColor?: string;
  label: string;
}

interface IProps {
  data: IAmenitiesData[];
  direction: 'row' | 'column';
  labelStyles?: ITypographyProps;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export class PropertyAmenities extends React.PureComponent<IProps, {}> {
  public render(): React.ReactNode {
    const { containerStyle } = this.props;
    return <View style={[styles.rowContainer, containerStyle]}>{this.renderIcons()}</View>;
  }

  public renderIcons = (): React.ReactNode => {
    const { data, direction, contentContainerStyle, labelStyles } = this.props;
    return data.map((amenity: IAmenitiesData, index: number) => {
      const isLastIndex = index === data.length - 1;
      return (
        <AmenitiesIcon
          labelStyles={labelStyles}
          direction={direction}
          icon={amenity.icon}
          label={amenity.label}
          key={index}
          iconColor={amenity.iconColor}
          iconSize={amenity.iconSize}
          isLastIndex={isLastIndex}
          containerStyle={contentContainerStyle}
        />
      );
    });
  };
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
