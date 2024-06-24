import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { remove } from 'lodash';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { BATHROOM_FILTER, BEDROOM_FILTER, IFilterDataObject } from '@homzhub/common/src/constants/SearchFilters';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';

interface IProps {
  bedCount: number[];
  bedTitle?: string;
  bathroomCount?: number[];
  onSelection: (type: string, value: number | number[]) => void;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  isBathRequired?: boolean;
}

export const RoomsFilter = (props: IProps): React.ReactElement => {
  const { bedCount, bathroomCount, onSelection, textStyle, isBathRequired = true, bedTitle, containerStyle } = props;

  const { t } = useTranslation(LocaleConstants.namespacesKey.propertySearch);

  const bubbleSelectedValue = (type: string, value: number | number[]): void => onSelection(type, value);

  const onUpdateBedroomCount = (value: number): void => {
    if (value !== -1) {
      remove(bedCount, (count: number) => count === -1);
      if (bedCount.includes(value)) {
        remove(bedCount, (count: number) => count === value);
        const newBedroomCount = bedCount.length === 0 ? [-1] : bedCount;
        bubbleSelectedValue('room_count', newBedroomCount);
      } else {
        const newBedroomCount = bedCount.concat(value);
        bubbleSelectedValue('room_count', newBedroomCount);
      }
    } else {
      const newBedroomCount = [-1];
      bubbleSelectedValue('room_count', newBedroomCount);
    }
  };

  const translateData = (data: IFilterDataObject[]): IFilterDataObject[] => {
    return data.map((currentData: IFilterDataObject) => {
      return {
        ...currentData,
        title: t(currentData.title),
      };
    });
  };

  const onUpdateBathroomCount = (value: number): void => bubbleSelectedValue('bath_count', value);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text type="small" textType="semiBold" style={[styles.textStyle, textStyle]}>
        {bedTitle || t('beds')}
      </Text>
      <SelectionPicker
        data={translateData(BEDROOM_FILTER)}
        selectedItem={bedCount}
        onValueChange={onUpdateBedroomCount}
        testID="bedPicker"
      />
      {bathroomCount && isBathRequired && (
        <>
          <Text type="small" textType="semiBold" style={[styles.textStyle, styles.pickerMargin]}>
            {t('baths')}
          </Text>
          <SelectionPicker
            data={translateData(BATHROOM_FILTER)}
            selectedItem={bathroomCount}
            onValueChange={onUpdateBathroomCount}
            testID="bathPicker"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingHorizontal: 2,
    paddingTop: 0,
  },
  textStyle: {
    color: theme.colors.darkTint4,
  },
  pickerMargin: {
    marginVertical: 15,
  },
});
