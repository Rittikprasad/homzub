import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  formProps: FormikProps<FormikValues>;
  isVerificationDone?: boolean;
}

const PostAssetForm = ({ formProps, isVerificationDone }: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  return (
    <>
      <View style={styles.fieldsView}>
        <FormTextInput
          name="projectName"
          label={t('projectName')}
          inputType="default"
          maxLength={50}
          numberOfLines={1}
          placeholder={t('projectNamePlaceholder')}
          formProps={formProps}
          isMandatory
          editable={!isVerificationDone}
        />
        <View style={styles.contentView}>
          <View style={styles.subContentView}>
            <FormTextInput
              name="unitNo"
              label={t('unitNo')}
              maxLength={10}
              numberOfLines={1}
              inputType="default"
              formProps={formProps}
              isMandatory
              editable={!isVerificationDone}
            />
          </View>
          <View style={styles.flexOne}>
            <FormTextInput
              name="blockNo"
              label={t('blockNo')}
              maxLength={10}
              numberOfLines={1}
              inputType="default"
              formProps={formProps}
              editable={!isVerificationDone}
            />
          </View>
        </View>
        <FormTextInput
          name="address"
          label={t('address')}
          maxLength={100}
          inputType="default"
          multiline
          formProps={formProps}
          style={styles.address}
          isMandatory
        />
        <View style={styles.contentView}>
          <View style={styles.subContentView}>
            <FormTextInput
              name="pincode"
              label={t('pincode')}
              maxLength={12}
              numberOfLines={1}
              inputType="default"
              formProps={formProps}
              isMandatory
            />
          </View>
          <View style={styles.flexOne}>
            <FormTextInput
              name="city"
              label={t('city')}
              maxLength={20}
              numberOfLines={1}
              inputType="default"
              formProps={formProps}
              isMandatory
            />
          </View>
        </View>
        <View style={styles.contentView}>
          <View style={styles.subContentView}>
            <FormTextInput
              name="state"
              label={t('state')}
              maxLength={20}
              numberOfLines={1}
              inputType="default"
              editable={false}
              formProps={formProps}
            />
          </View>
          <View style={styles.flexOne}>
            <FormTextInput
              name="country"
              label={t('country')}
              maxLength={20}
              numberOfLines={1}
              editable={false}
              inputType="default"
              formProps={formProps}
            />
          </View>
        </View>
      </View>
      <Divider />
    </>
  );
};

const memoizedComponent = React.memo(PostAssetForm);
export { memoizedComponent as PostAssetForm };

const styles = StyleSheet.create({
  fieldsView: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  contentView: {
    flexDirection: 'row',
  },
  subContentView: {
    flex: 1,
    marginRight: 16,
  },
  address: {
    height: 80,
    paddingTop: 16,
    paddingBottom: 16,
  },
  flexOne: {
    flex: 1,
  },
});
