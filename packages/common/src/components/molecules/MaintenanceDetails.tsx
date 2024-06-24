import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FormikProps } from 'formik';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';

import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { FormDropdown } from '@homzhub/common/src/components/molecules/FormDropdown';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { ScheduleTypes } from '@homzhub/common/src/constants/Terms';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  formProps: FormikProps<any>;
  currencyData: Currency;
  maintenanceAmountKey: string;
  maintenanceScheduleKey: string;
  maintenanceUnitKey: string;
  assetGroupType: string;
}

export const MaintenanceDetails = (props: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  const maintenanceUnits = useSelector(RecordAssetSelectors.getMaintenanceUnits);
  const { formProps, currencyData, maintenanceAmountKey, maintenanceScheduleKey, maintenanceUnitKey, assetGroupType } =
    props;
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  const scheduleOptions = [
    { label: t('monthly'), value: ScheduleTypes.MONTHLY },
    { label: t('quarterly'), value: ScheduleTypes.QUARTERLY },
    { label: t('annually'), value: ScheduleTypes.ANNUALLY },
  ];

  useEffect(() => {
    if (maintenanceUnits.length > 0 && formProps.values[maintenanceUnitKey] === -1) {
      formProps.setFieldValue(maintenanceUnitKey, maintenanceUnits[0].value);
    }
  }, [maintenanceUnits]);

  return (
    <View style={[styles.container, PlatformUtils.isWeb() && !isMobile && styles.containerWeb]}>
      <View style={styles.fieldContainer}>
        <FormTextInput
          inputType="number"
          name={maintenanceAmountKey}
          label={assetGroupType === AssetGroupTypes.RES ? t('maintenanceAmount') : t('currentMaintenance')}
          placeholder={t('maintenanceAmountPlaceholder')}
          maxLength={formProps.values.maintenanceAmount && formProps.values.maintenanceAmount.includes('.') ? 13 : 12}
          formProps={formProps}
          inputPrefixText={currencyData.currencySymbol}
          inputGroupSuffixText={currencyData.currencyCode}
          isMandatory
        />
      </View>
      <View style={[styles.fieldContainer, styles.dropdownContainer]}>
        {assetGroupType === AssetGroupTypes.RES && (
          <FormDropdown
            isDisabled
            label={t('maintenanceSchedule')}
            listTitle={t('maintenanceSchedule')}
            listHeight={300}
            name={maintenanceScheduleKey}
            options={scheduleOptions}
            formProps={formProps}
            dropdownContainerStyle={styles.dropdownContainerStyle}
            isMandatory
          />
        )}
        {assetGroupType === AssetGroupTypes.COM && (
          <FormDropdown
            label={t('maintenanceUnits')}
            listTitle={t('maintenanceUnits')}
            listHeight={300}
            name={maintenanceUnitKey}
            options={maintenanceUnits}
            formProps={formProps}
            dropdownContainerStyle={styles.dropdownContainerStyle}
            isMandatory
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    flexDirection: 'row',
  },
  containerWeb: {
    width: 344,
  },
  fieldContainer: {
    flex: 0.5,
  },
  dropdownContainer: {
    marginStart: 16,
  },
  dropdownContainerStyle: {
    height: 48,
  },
});
