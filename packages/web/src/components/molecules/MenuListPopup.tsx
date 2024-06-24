import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import Popover from '@homzhub/web/src/components/atoms/Popover';

interface IProps {
  popupRef: React.MutableRefObject<PopupActions | null>;
  onOpenModal: () => void;
  onCloseModal: () => void;
  children: React.ReactElement;
  isOpen?: boolean;
  onSuccessCallback?: (message?: string) => void;
  contentStyle?: StyleProp<ViewStyle>;
}

const MenuListPopup: React.FC<IProps> = (props: IProps) => {
  const { popupRef, onCloseModal, children: renderChildren, contentStyle, onOpenModal, isOpen } = props;

  const renderPopoverContent = (): React.ReactNode => {
    return <View>{renderChildren}</View>;
  };

  return (
    <Popover
      content={renderPopoverContent}
      popupProps={{
        open: isOpen,
        closeOnDocumentClick: true,
        arrow: false,
        contentStyle: {
          maxHeight: '100%',
          overflow: 'auto',
          minWidth: 160,
          ...{ contentStyle },
        },
        children: undefined,
        position: 'bottom center',
        onOpen: onOpenModal,
        onClose: onCloseModal,
      }}
      forwardedRef={popupRef}
    />
  );
};

export default MenuListPopup;
