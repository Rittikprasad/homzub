import React, { FC, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { PopupProps, PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import PopupMenuOptions from '@homzhub/web/src/components/molecules/PopupMenuOptions';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

type Props = IWebProps;
const PhoneCodePrefix: FC<Props> = (props: Props) => {
  const { phoneCodes, fetchFlag, fetchPhoneCodes, inputPrefixText, isBottomSheetVisible, onCloseDropDownWeb } = props;

  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const popupRef = useRef<PopupActions>(null);
  useEffect(() => {
    if (popupRef && popupRef.current) {
      if (!isBottomSheetVisible === true) {
        popupRef.current.open();
      }
    }
  }, []);

  const selectedValue = (value: IDropdownOption): void => {
    onCloseDropDownWeb(value && value);
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  const defaultDropDownProps = (isOpen: boolean, width: string): PopupProps => ({
    arrow: false,
    contentStyle: {
      minWidth: width,
      overflowY: 'scroll',
      position: 'absolute',
      height: 300,
      top: !isMobile ? (isTablet ? '13%' : '21.5%') : '16.5%',
    },
    overlayStyle: { background: theme.colors.transparent },
    closeOnDocumentClick: true,
    children: undefined,
  });
  return (
    <View style={styles.dropDownWeb}>
      <Popover
        forwardedRef={popupRef}
        content={<PopupMenuOptions options={phoneCodes} onMenuOptionPress={selectedValue} />}
        popupProps={defaultDropDownProps(isBottomSheetVisible, 'fit-content')}
      >
        <View>
          <TouchableOpacity style={styles.inputGroupPrefix} onPress={fetchPhoneCodes}>
            {fetchFlag()}
            <Label type="regular" style={styles.inputPrefixText}>
              {inputPrefixText}
            </Label>
            <Icon name={icons.downArrowFilled} color={theme.colors.darkTint7} size={12} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
      </Popover>
    </View>
  );
};

export default PhoneCodePrefix;

const styles = StyleSheet.create({
  inputGroupPrefix: {
    position: 'absolute',
    left: 1,
    marginTop: 2,
    right: 5,
    width: 90,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: theme.colors.disabled,
  },
  inputPrefixText: {
    color: theme.colors.darkTint4,
    marginStart: 8,
  },
  flagStyle: {
    borderRadius: 2,
    width: 24,
    height: 24,
    marginEnd: 6,
  },
  iconStyle: {
    marginStart: 6,
  },
  dropDownWeb: {
    top: '-48px',
    position: 'relative',
  },
});
