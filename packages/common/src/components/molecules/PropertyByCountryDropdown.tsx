import React, { useState, useCallback } from 'react';
import { PickerItemProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { Country } from '@homzhub/common/src/domain/models/Country';

interface IProps {
  countryList: Country[];
  selectedCountry: number;
  propertyList: PickerItemProps[];
  selectedProperty: number;
  onPropertyChange: (value: number) => void;
  onCountryChange: (value: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  countryContainerStyle?: StyleProp<ViewStyle>;
  propertyContainerStyle?: StyleProp<ViewStyle>;
}

const PropertyByCountryDropdown = (props: IProps): React.ReactElement | null => {
  const {
    propertyList,
    countryList,
    selectedCountry,
    selectedProperty,
    onPropertyChange,
    onCountryChange,
    containerStyle,
    countryContainerStyle,
    propertyContainerStyle,
  } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { t } = useTranslation();

  const handleCountrySelection = useCallback(
    (value: string | number): void => {
      const selectedCountryIndex = countryList.findIndex((data) => data.id === value);
      setSelectedIndex(selectedCountryIndex);
      onCountryChange(value as number);
      onPropertyChange(0);
    },
    [countryList, onCountryChange, onPropertyChange]
  );

  const countryOptions = useCallback(
    (): PickerItemProps[] =>
      countryList.map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [countryList]
  );

  if (countryList.length <= 0) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Dropdown
        data={[{ label: t('common:all'), value: 0 }, ...countryOptions()]}
        showImage
        value={selectedCountry}
        image={selectedCountry !== 0 ? countryList[selectedIndex].flag : 'globe'}
        onDonePress={handleCountrySelection}
        imageStyle={styles.image}
        containerStyle={[styles.imageDropdown, countryContainerStyle]}
        parentContainerStyle={[countryContainerStyle]}
      />
      <Dropdown
        data={[{ label: t('assetFinancial:allProperties'), value: 0 }, ...propertyList]}
        value={selectedProperty}
        // @ts-ignore
        onDonePress={onPropertyChange}
        containerStyle={styles.labelDropdown}
        parentContainerStyle={[styles.labelParent, propertyContainerStyle]}
        textStyle={styles.text}
        fontWeight="semiBold"
      />
    </View>
  );
};

const memoizedComponent = React.memo(PropertyByCountryDropdown);
export { memoizedComponent as PropertyByCountryDropdown };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    marginRight: 16,
    borderRadius: 6,
    width: 26,
    height: 22,
  },
  imageDropdown: {
    backgroundColor: theme.colors.white,
    marginEnd: 16,
  },
  labelDropdown: {
    paddingVertical: 8,
    backgroundColor: theme.colors.white,
  },
  labelParent: {
    flex: 1,
  },
  text: {
    color: theme.colors.darkTint4,
  },
});
