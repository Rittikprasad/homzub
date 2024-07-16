import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { debounce } from 'lodash';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { ResponseHelper } from '@homzhub/common/src/services/GooglePlaces/ResponseHelper';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import {
  IUpdateProfile,
  IUpdateProfileResponse,
  UpdateProfileTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput, IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  userData?: UserProfile;
  updateFormLoadingState: (isLoading: boolean) => void;
  webGroupPrefix?: (params: IWebProps) => React.ReactElement;
  isTab: boolean;
  updatePopUp: (data: string) => void;
  updateUserProfile: (data: IUserProfileForm) => void;
  updateProfileWithoutPassword: (data: IUpdateProfileResponse) => void;
  closePopUp: () => void;
  isMobile: boolean;
}

export interface IUserProfileForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  phoneCode: string;
  address: string;
  postalCode: string;
  cityName: string;
  stateName: string;
  country: string;
  countryIsoCode: string;
}

interface IState {
  userProfileForm: IUserProfileForm;
  isAddressRequired: boolean;
}

export class UserProfileForm extends React.PureComponent<IProps, IState> {
  public state = {
    userProfileForm: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      phoneCode: '',
      address: '',
      postalCode: '',
      cityName: '',
      stateName: '',
      country: '',
      countryIsoCode: '',
    },
    isAddressRequired: false,
  };

  public componentDidMount(): void {
    const { userData } = this.props;
    if (userData) {
      this.setState({
        userProfileForm: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneCode: userData.countryCode,
          phone: userData.phoneNumber,
          email: userData.email,
          address: userData.userAddress.length > 0 ? userData.userAddress[0].address : '',
          postalCode: userData.userAddress.length > 0 ? userData.userAddress[0].postalCode : '',
          cityName: userData.userAddress.length > 0 ? userData.userAddress[0].cityName : '',
          stateName: userData.userAddress.length > 0 ? userData.userAddress[0].stateName : '',
          country: userData.userAddress.length > 0 ? userData.userAddress[0].countryName : '',
          countryIsoCode: userData.userAddress.length > 0 ? userData.userAddress[0].country.iso2Code : '',
        },
        isAddressRequired: userData.userAddress.length > 0,
      });
    }
  }

  public render(): ReactElement {
    const { t, webGroupPrefix, isTab, closePopUp, isMobile } = this.props;
    const { userProfileForm } = this.state;

    return (
      <View style={styles.container}>
        <Formik
          onSubmit={this.handleUpdate}
          initialValues={userProfileForm}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
        >
          {(formProps: FormikProps<IUserProfileForm>): React.ReactNode => {
            return (
              <>
                <View style={[styles.container, isTab && styles.containerTablet]}>
                  <FormTextInput
                    name="firstName"
                    label={t('property:firstName')}
                    inputType="default"
                    placeholder={t('auth:enterFirstName')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormTextInput
                    name="lastName"
                    label={t('property:lastName')}
                    inputType="default"
                    placeholder={t('auth:enterLastName')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormTextInput
                    name="phone"
                    label={t('common:phone')}
                    inputPrefixText={formProps.values.phoneCode}
                    inputType="phone"
                    webGroupPrefix={webGroupPrefix}
                    placeholder={t('auth:yourNumber')}
                    helpText={t('auth:otpVerification')}
                    phoneFieldDropdownText={t('auth:countryRegion')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormTextInput
                    name="email"
                    label={t('common:email')}
                    numberOfLines={1}
                    inputType="email"
                    placeholder={t('auth:enterEmail')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormTextInput
                    name="address"
                    label={t('property:address')}
                    maxLength={100}
                    inputType="default"
                    multiline
                    onChangeText={(value): void => this.onChangeAddress(value, formProps)}
                    formProps={formProps}
                    style={styles.address}
                  />
                  <View style={styles.contentView}>
                    <View style={styles.subContentView}>
                      <FormTextInput
                        name="postalCode"
                        label={t('property:pincode')}
                        maxLength={10}
                        numberOfLines={1}
                        inputType="number"
                        onChangeText={(code): Promise<void> => this.onChangePincode(code, formProps)}
                        formProps={formProps}
                      />
                    </View>
                    <View style={styles.flexOne}>
                      <FormTextInput
                        name="cityName"
                        label={t('property:city')}
                        maxLength={20}
                        numberOfLines={1}
                        inputType="default"
                        editable={false}
                        formProps={formProps}
                      />
                    </View>
                  </View>
                  <View style={styles.contentView}>
                    <View style={styles.subContentView}>
                      <FormTextInput
                        name="stateName"
                        label={t('property:state')}
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
                        label={t('property:country')}
                        maxLength={20}
                        numberOfLines={1}
                        editable={false}
                        inputType="default"
                        formProps={formProps}
                      />
                    </View>
                  </View>
                </View>
                <View style={[styles.flexRow, isMobile && styles.buttonContainer]}>
                  <Button
                    onPress={closePopUp}
                    type="secondary"
                    title={t('common:cancel')}
                    containerStyle={styles.buttonStyleCancel}
                    titleStyle={styles.buttonTitle}
                  />
                  <FormButton
                    formProps={formProps}
                    // @ts-ignore
                    onPress={formProps.handleSubmit}
                    type="primary"
                    title={t('moreProfile:updateProfile')}
                    containerStyle={[styles.buttonStyle, isMobile && styles.buttonStyleMobile]}
                  />
                </View>
              </>
            );
          }}
        </Formik>
      </View>
    );
  }

  private onChangeAddress = (value: string, formProps: FormikProps<IUserProfileForm>): void => {
    formProps.setFieldValue('address', value);
    this.setState({
      isAddressRequired: value.length > 0,
    });
  };

  private onChangePincode = async (pincode: string, formProps: FormikProps<IUserProfileForm>): Promise<void> => {
    formProps.setFieldValue('postalCode', pincode);
    this.setState({
      isAddressRequired: true,
    });
    await this.updateValues(pincode, formProps);
  };

  // eslint-disable-next-line react/sort-comp
  private updateValues = debounce(async (pincode: string, formProps: FormikProps<IUserProfileForm>): Promise<void> => {
    if (pincode.length === 0) {
      formProps.setFieldValue('cityName', '');
      formProps.setFieldValue('stateName', '');
      formProps.setFieldValue('country', '');
      formProps.setFieldValue('countryIsoCode', '');
      this.setState({
        isAddressRequired: false,
      });
      return;
    }
    try {
      const response = await GooglePlacesService.getLocationData(undefined, pincode);
      const addressComponents = ResponseHelper.getLocationDetails(response);
      formProps.setFieldValue('cityName', addressComponents.city ?? addressComponents.area);
      formProps.setFieldValue('stateName', addressComponents.state);
      formProps.setFieldValue('country', addressComponents.country);
      formProps.setFieldValue('countryIsoCode', addressComponents.countryIsoCode);
    }catch (e: any) {      AlertHelper.error({ message: e.message });
    }
  }, 500);

  private handleUpdate = async (
    values: IUserProfileForm,
    formikHelpers: FormikHelpers<IUserProfileForm>
  ): Promise<void> => {
    const { isAddressRequired } = this.state;
    const { userData, t, updatePopUp, updateUserProfile, updateProfileWithoutPassword, closePopUp } = this.props;
    const { phone, phoneCode, email, address, postalCode } = values;

    formikHelpers.setSubmitting(true);

    if (((userData && userData.userAddress?.length > 0) || isAddressRequired) && !address) {
      formikHelpers.setFieldError('address', t('fieldRequiredError'));
      return;
    }

    if (((userData && userData.userAddress?.length > 0) || isAddressRequired) && !postalCode) {
      formikHelpers.setFieldError('postalCode', t('fieldRequiredError'));
      return;
    }

    if ((userData?.phoneNumber !== phone || userData?.countryCode !== phoneCode) && userData?.email !== email) {
      formikHelpers.setFieldError('email', 'Both the fields cannot be edited');
      AlertHelper.error({ message: 'Both the fields cannot be edited' });
      return;
    }

    this.setState({ userProfileForm: { ...values } });
    if (
      (userData?.phoneNumber !== phone || userData?.countryCode !== phoneCode || userData?.email !== email) &&
      userData.isPasswordCreated
    ) {
      updateUserProfile(values);
      updatePopUp('password');
      return;
    }
    updateUserProfile(values);
    const userAddress = {
      address,
      postal_code: postalCode,
      city_name: values.cityName,
      state_name: values.stateName,
      country_name: values.country,
      country_iso2_code: values.countryIsoCode,
    };
    const profileDetails = {
      first_name: values.firstName,
      last_name: values.lastName,
      phone_code: phoneCode,
      phone_number: phone,
      email,
      user_address: userAddress,
    };
    const payload: IUpdateProfile = {
      action: UpdateProfileTypes.GET_OTP_OR_UPDATE,
      payload: {
        profile_details: profileDetails,
      },
    };
    try {
      const response = await UserRepository.updateUserProfileByActions(payload);
      updateProfileWithoutPassword(response);
      if (response && response.user_id) {
        closePopUp();
      } else {
        updatePopUp('otpWithEmail');
      }
    }catch (e: any) {      AlertHelper.error({ message: e.message });
    }
  };

  private formSchema = (): yup.ObjectSchema<IUserProfileForm> => {
    const { t } = this.props;

    return yup.object().shape({
      firstName: yup.string().required(t('fieldRequiredError')),
      lastName: yup.string().required(t('fieldRequiredError')),
      email: yup.string().required(t('fieldRequiredError')),
      phone: yup.string().required(t('fieldRequiredError')),
      phoneCode: yup.string(),
      address: yup.string(),
      postalCode: yup.string(),
      cityName: yup.string(),
      stateName: yup.string(),
      country: yup.string(),
      countryIsoCode: yup.string(),
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.moreProfile)(UserProfileForm);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    overflowY: 'scroll',
    height: 400,
  },
  containerTablet: {
    height: 700,
  },
  buttonStyle: {
    margin: 16,
    width: '50%',
    height: 44,
  },
  buttonStyleCancel: {
    margin: 16,
    width: '30%',
    height: 44,
    paddingTop: 4,
  },
  profileImage: {
    marginTop: 16,
    alignItems: 'center',
  },
  commonTextStyle: {
    textAlign: 'center',
  },
  passwordText: {
    marginTop: 20,
  },
  helpText: {
    marginBottom: 32,
  },
  contentView: {
    flexDirection: 'row',
  },
  subContentView: {
    flex: 1,
    marginRight: 16,
  },
  address: {
    height: 64,
    paddingTop: 16,
    paddingBottom: 16,
  },
  flexOne: {
    flex: 1,
  },
  buttonTitle: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  submit: {
    marginStart: 12,
  },
  buttonStyleMobile: {
    height: 'fit-content',
  },
  flexRow: {
    flexDirection: 'row',
  },
  buttonContainer: {
    paddingTop: 18,
  },
});
