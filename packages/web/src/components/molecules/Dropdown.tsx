import React, { useState, useRef, useEffect } from 'react';
import { View, LayoutChangeEvent, PickerItemProps } from 'react-native';
import { PopupProps, PopupActions } from 'reactjs-popup/dist/types';

import Popover from '@homzhub/web/src/components/atoms/Popover';
import PopupMenuOptions, { IPopupOptions } from '@homzhub/web/src/components/molecules/PopupMenuOptions';

export interface IDropdownProps {
  data: PickerItemProps[];
  valueChange: (changedValue: IPopupOptions) => void;
  dropdownVisible: boolean;
  content: React.ReactElement;
  customPopupProps?: PopupProps;
}

const DropDown = ({
  data,
  valueChange,
  dropdownVisible,
  content,
  customPopupProps,
}: IDropdownProps): React.ReactElement => {
  const defaultDropDownProps = (width: number): PopupProps => ({
    position: customPopupProps?.position ?? ('bottom right' as 'bottom right'),
    on: ['click' as 'click'],
    arrow: false,
    contentStyle: { minWidth: width, marginTop: '4px', alignItems: 'stretch', width },
    closeOnDocumentClick: true,
    children: undefined,
  });
  const [width, setWidth] = useState(0);
  const popupRef = useRef<PopupActions>(null);

  useEffect(() => {
    if (!dropdownVisible) {
      if (popupRef && popupRef.current) {
        popupRef.current?.close();
      }
    }
  }, [dropdownVisible]);

  const onLayout = (e: LayoutChangeEvent): void => {
    setWidth(e.nativeEvent.layout.width > 200 ? e.nativeEvent.layout.width : 200);
  };

  return (
    <Popover
      forwardedRef={popupRef}
      content={<PopupMenuOptions options={data} onMenuOptionPress={valueChange} />}
      popupProps={defaultDropDownProps(width)}
    >
      <View onLayout={onLayout}>{content}</View>
    </Popover>
  );
};

export default DropDown;
