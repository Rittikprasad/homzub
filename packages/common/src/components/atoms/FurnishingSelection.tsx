import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { FurnishingTypes } from '@homzhub/common/src/constants/Terms';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  titleHidden?: boolean;
  value: FurnishingTypes;
  onFurnishingChange: (type: FurnishingTypes) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const FurnishingSelection = ({
  value,
  onFurnishingChange,
  titleHidden = false,
  containerStyle = {},
}: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  return (
    <View style={[styles.furnishingContainer, containerStyle]}>
      {!titleHidden && (
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('furnishing')}
        </Text>
      )}
      <View style={styles.buttonContainer}>
        {[FurnishingTypes.FULL, FurnishingTypes.SEMI, FurnishingTypes.NONE].map(
          (type: FurnishingTypes, index: number) => {
            const isSelected = value === type;
            const textStyle = StyleSheet.flatten([styles.textStyle, isSelected && styles.selectedTextStyle]);
            const buttonItemContainerStyle = StyleSheet.flatten([
              styles.item,
              isMobile && styles.itemMobile,
              isSelected && styles.selectedContainerStyle,
              index === 1 && { marginHorizontal: isMobile ? 8 : 16 },
            ]);

            const onPress = (): void => onFurnishingChange(type);

            return (
              <TouchableOpacity key={type} style={buttonItemContainerStyle} onPress={onPress}>
                <Label type="large" textType={isSelected ? 'semiBold' : 'regular'} style={textStyle}>
                  {StringUtils.toTitleCase(type)}
                </Label>
              </TouchableOpacity>
            );
          }
        )}
      </View>
    </View>
  );
};

const memoizedComponent = React.memo(FurnishingSelection);
export { memoizedComponent as FurnishingSelection };

const styles = StyleSheet.create({
  furnishingContainer: {
    backgroundColor: theme.colors.white,
    marginBottom: 16,
  },
  title: {
    color: theme.colors.darkTint3,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  item: {
    flex: undefined,
    paddingVertical: 4,
    paddingHorizontal: 33,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    backgroundColor: theme.colors.white,
  },
  itemMobile: {
    flex: 1,
    paddingHorizontal: undefined,
  },
  selectedContainerStyle: {
    backgroundColor: theme.colors.primaryColor,
  },
  textStyle: {
    color: theme.colors.darkTint5,
  },
  selectedTextStyle: {
    color: theme.colors.white,
  },
});
