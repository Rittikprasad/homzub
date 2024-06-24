import React, { useRef } from 'react';
import { View } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import CaptureSelfie from '@homzhub/web/src/components/molecules/CaptureSelfie';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  onCaptureSelfie: (data: string | null) => void;
  takeSelfie: boolean;
}

const CaptureSelfiePopover: React.FC<IProps> = (props: IProps) => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { onCaptureSelfie, takeSelfie } = props;
  const selfiePopoverRef = useRef<PopupActions>(null);
  const onClosePopover = (): void => {
    if (selfiePopoverRef && selfiePopoverRef.current) {
      selfiePopoverRef.current.close();
    }
  };

  return (
    <View>
      <Popover
        content={<CaptureSelfie onCapture={onCaptureSelfie} closePopover={onClosePopover} />}
        popupProps={{
          open: takeSelfie,
          closeOnDocumentClick: false,
          arrow: false,
          contentStyle: {
            alignItems: 'stretch',
            width: isMobile ? 300 : 450,
            height: isMobile ? 300 : 430,
            paddingBottom: 170,
            borderRadius: 8,
          },
          children: undefined,
          modal: true,
          position: 'center center',
          onClose: onClosePopover,
        }}
        forwardedRef={selfiePopoverRef}
      />
    </View>
  );
};

export default CaptureSelfiePopover;
