import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { SvgUri } from 'react-native-svg';

interface IProps {
  uri: string;
  width?: string | number;
  height?: string | number;
  stroke?: string;
  strokeWidth?: number;
  viewBox?: string;
  preserveAspectRatio?: string;
  style?: StyleProp<ViewStyle>;
}

const SVGUri = ({
  uri,
  width,
  height,
  preserveAspectRatio,
  stroke,
  strokeWidth,
  style,
}: IProps): React.ReactElement<Svg> => {
  return (
    <SvgUri
      uri={uri}
      height={height}
      width={width}
      stroke={stroke}
      strokeWidth={strokeWidth}
      preserveAspectRatio={preserveAspectRatio}
      style={style}
    />
  );
};

export { SVGUri };
