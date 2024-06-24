import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';

export interface IMenu {
  icon?: string;
  label: string;
  value: string;
  labelColor?: string;
  isExtraData?: boolean;
  isExtraDataAllowed?: boolean;
  onPressItem?: () => void | Promise<void>;
  isDisable?: boolean;
}

interface IProps {
  data: IMenu[];
  optionTitle?: string;
  onSelect: (value: string) => void;
  sheetHeight?: number;
  extraNode?: React.ReactElement;
  isExtraNode?: boolean;
  isShadowView?: boolean;
  onPressIcon?: () => void;
  iconStyle?: StyleProp<ViewStyle>;
  renderMenuPopup?: (menuList: React.ReactElement) => React.ReactElement;
  onCloseMenuPopup?: () => void;
}

const Menu = (props: IProps): React.ReactElement => {
  const {
    data,
    onSelect,
    optionTitle,
    sheetHeight,
    extraNode,
    isExtraNode,
    onPressIcon,
    isShadowView = false,
    iconStyle,
    renderMenuPopup,
    onCloseMenuPopup,
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [isExtraData, setExtraData] = useState(false);

  useEffect(() => {
    if (!isExtraNode) {
      setIsVisible(false);
    }
  }, [isExtraNode]);

  const isWeb = PlatformUtils.isWeb();

  const handleSelection = (item: IMenu): void => {
    onSelect(item.value);
    if (onCloseMenuPopup) {
      onCloseMenuPopup();
    }
    if (!item.isExtraData || (!item.isExtraDataAllowed && item.isExtraData)) {
      setIsVisible(false);
    } else {
      setExtraData(true);
    }
  };

  const renderMenuItem = (item: IMenu, index: number): React.ReactElement => {
    const { labelColor = theme.colors.darkTint3 } = item;
    const lastItem = data.length === index + 1;
    return (
      <View>
        <TouchableOpacity
          onPress={(): void => handleSelection(item)}
          key={index}
          style={[styles.content, item.isDisable && styles.disableStyle, isWeb ? styles.contentWeb : styles.contentApp]}
          disabled={item.isDisable}
        >
          {!!item.icon && <Icon name={item.icon} size={24} color={theme.colors.darkTint3} style={styles.iconStyle} />}
          <Text type="small" style={{ color: labelColor }}>
            {item.label}
          </Text>
        </TouchableOpacity>
        {isWeb && !lastItem && <Divider />}
      </View>
    );
  };

  const onPress = (): void => {
    if (onPressIcon) onPressIcon();
    setIsVisible(!isVisible);
  };

  const renderMenuList = (): React.ReactElement => {
    return (
      <View>
        <View style={[!isWeb && styles.listContainer]}>{data.map((item, index) => renderMenuItem(item, index))}</View>
        {isExtraData && extraNode}
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity onPress={onPress} style={iconStyle}>
        <Icon name={icons.verticalDots} color={theme.colors.primaryColor} size={18} />
      </TouchableOpacity>
      {isWeb && renderMenuPopup ? (
        <View>{renderMenuPopup(renderMenuList())}</View>
      ) : (
        <BottomSheet
          visible={isVisible}
          headerTitle={optionTitle}
          sheetHeight={sheetHeight}
          isShadowView={isShadowView}
          onCloseSheet={(): void => {
            setIsVisible(false);
            setExtraData(false);
          }}
        >
          {renderMenuList()}
        </BottomSheet>
      )}
    </>
  );
};

export default Menu;

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentWeb: {
    justifyContent: 'center',
    margin: 16,
  },
  contentApp: {
    marginBottom: 26,
    marginHorizontal: 16,
  },
  disableStyle: {
    opacity: 0.6,
  },
  iconStyle: {
    marginRight: 6,
  },
  listContainer: {
    marginVertical: 10,
  },
});
