import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { OverlayView } from '@react-google-maps/api';
import Icon from '@homzhub/common/src/assets/icon';
import { ILatLng } from '@homzhub/common/src/modules/search/interface';

interface IProps {
  position: ILatLng;
  iconName: string;
  iconColor: string;
  key?: string | number;
  iconSize: number;
  onSelectMarker?: (id: number | null) => void;
}

const CustomMarker = (props: IProps): React.ReactElement => {
  const { position, iconName, iconColor, iconSize, key } = props;
  const renderMarker = (): React.ReactNode => {
    return (
      <View key={key}>
        <Icon name={iconName} color={iconColor} size={iconSize} />
      </View>
    );
  };

  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <TouchableOpacity>{renderMarker()}</TouchableOpacity>
    </OverlayView>
  );
};

const memoizedComponent = React.memo(CustomMarker);
export { memoizedComponent as CustomMarker };
