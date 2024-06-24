import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormDropdown } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { AssetDescriptionDropdownValues } from '@homzhub/common/src/domain/models/AssetDescriptionForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  formProps: FormikProps<FormikValues>;
  dropDownOptions: AssetDescriptionDropdownValues;
}

const AssetDescriptionForm = ({ formProps, dropDownOptions }: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const styles = formStyles(isMobile, isTablet);
  return (
    <View style={styles.formFieldsContainer}>
      <View style={styles.formFieldsContainer}>
        <View style={styles.contentView}>
          <View style={styles.subContentView}>
            <FormTextInput
              style={styles.inputFieldStyle}
              name="carpetArea"
              label={t('propertySearch:carpetArea')}
              maxLength={10}
              numberOfLines={1}
              inputType="number"
              placeholder={t('propertySearch:carpetAreaPlaceholder')}
              formProps={formProps}
            />
          </View>
          <View style={styles.flexOne}>
            <FormDropdown
              name="areaUnit"
              label={t('areaUnit')}
              options={dropDownOptions.areaUnitDropdownValues}
              placeholder={t('selectAreaUnit')}
              formProps={formProps}
              dropdownContainerStyle={styles.dropdownArea}
            />
          </View>
        </View>
        <View style={styles.formFields}>
          <FormDropdown
            label={t('facingText')}
            name="facing"
            options={dropDownOptions.facing}
            placeholder={t('propertySearch:selectFacing')}
            formProps={formProps}
            dropdownContainerStyle={styles.formDropdown}
          />
        </View>
        <View style={styles.formFieldsFlooring}>
          <FormDropdown
            label={t('flooringType')}
            name="flooringType"
            options={dropDownOptions.typeOfFlooring}
            placeholder={t('selectFlooringType')}
            formProps={formProps}
            dropdownContainerStyle={styles.formDropdown}
          />
        </View>
        <View style={styles.formFields}>
          <FormCalendar
            formProps={formProps}
            label={t('yearOfPossession')}
            name="yearOfConstruction"
            allowPastDates
            isYearView
            calendarTitle={t('yearOfPossession')}
            placeHolder={t('assetFinancial:addDatePlaceholder')}
            placeHolderStyle={styles.placeHolderStyle}
            dateStyle={styles.dateStyle}
            dateContainerStyle={styles.dateContainerStyle}
            textType="label"
          />
        </View>
      </View>
      <View style={[styles.counter, isTablet && styles.counterTab, isMobile && styles.counterMobile]}>
        <View style={[PlatformUtils.isWeb() && styles.subContentView, styles.subContentViewAlign]}>
          <FormTextInput
            style={styles.inputFieldStyle}
            name="totalFloors"
            label={t('totalFloor')}
            maxLength={3}
            numberOfLines={1}
            inputType="number"
            formProps={formProps}
          />
        </View>
        <View style={[PlatformUtils.isWeb() && styles.subContentView, styles.subContentViewAlign]}>
          <FormTextInput
            style={styles.inputFieldStyle}
            name="onFloorNumber"
            label={t('onFloorText')}
            maxLength={3}
            numberOfLines={1}
            inputType="number"
            formProps={formProps}
          />
        </View>
      </View>
    </View>
  );
};

interface IFormStyles {
  formContainer: ViewStyle;
  contentView: ViewStyle;
  subContentView: ViewStyle;
  formFields: ViewStyle;
  formFieldsContainer: ViewStyle;
  formCounter: ViewStyle;
  flexOne: ViewStyle;
  inputFieldStyle: ViewStyle;
  dateStyle: ViewStyle;
  dateContainerStyle: ViewStyle;
  placeHolderStyle: ViewStyle;
  dropdownArea: ViewStyle;
  formDropdown: ViewStyle;
  formFieldsFlooring: ViewStyle;
  counter: ViewStyle;
  counterTab: ViewStyle;
  counterMobile: ViewStyle;
  divider: ViewStyle;
  subContentViewAlign: ViewStyle;
}

const formStyles = (isMobile: boolean, isTablet: boolean): StyleSheet.NamedStyles<IFormStyles> =>
  StyleSheet.create<IFormStyles>({
    formFieldsContainer: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    formContainer: {
      flexDirection: isMobile ? undefined : 'row',
      flexWrap: isMobile ? undefined : 'wrap',
      backgroundColor: theme.colors.white,
      paddingBottom: 24,
    },
    contentView: {
      flexShrink: isMobile ? 1 : undefined,
      flexDirection: 'row',
      alignItems: 'center',
    },
    subContentView: {
      flex: 1,
      marginRight: 16,
      width: !isMobile ? 160 : undefined,
    },
    formFields: {
      width: isMobile ? '100%' : undefined,
      marginLeft: isMobile ? 0 : 24,
      justifyContent: 'center',
    },
    formFieldsFlooring: {
      width: isMobile ? '100%' : undefined,
      marginLeft: isTablet ? 0 : 24,
      justifyContent: 'center',
    },
    formCounter: {
      marginTop: 24,
      marginRight: isMobile ? 0 : 24,
    },
    flexOne: {
      flex: 1,
      marginLeft: !isMobile ? 24 : undefined,
    },
    inputFieldStyle: {
      height: 40,
    },
    dateStyle: {
      marginLeft: 0,
    },
    dateContainerStyle: {
      paddingVertical: 8,
      marginTop: 0,
      width: !isMobile ? 230 : undefined,
      height: 45,
    },
    placeHolderStyle: {
      color: theme.colors.darkTint8,
    },
    dropdownArea: {
      width: 130,
      height: 45,
    },
    formDropdown: {
      width: !isMobile ? 230 : undefined,
      height: 45,
      marginLeft: 0,
    },
    counter: {
      flexDirection: 'row',
      width: '30%',
    },
    counterTab: {
      width: '48%',
    },
    counterMobile: {
      width: '100%',
      flexDirection: 'column',
    },
    divider: {
      marginLeft: 20,
      marginRight: 30,
      marginTop: 20,
    },
    subContentViewAlign: {
      marginRight: isMobile ? 0 : 38,
    },
  });

const memoizedComponent = React.memo(AssetDescriptionForm);
export { memoizedComponent as AssetDescriptionForm };
