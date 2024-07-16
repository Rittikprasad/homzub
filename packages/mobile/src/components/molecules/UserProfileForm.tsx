import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { Formik, FormikProps } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { debounce } from 'lodash';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { ResponseHelper } from '@homzhub/common/src/services/GooglePlaces/ResponseHelper';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import {
  IUpdateProfile,
  IUpdateProfileResponse,
  UpdateProfileTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import PasswordVerificationForm from '@homzhub/mobile/src/components/molecules/PasswordVerificationForm';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';

interface IProps extends WithTranslation {
  onFormSubmitSuccess: (
    profileDetails: IUserProfileForm,
    profileUpdateResponse?: IUpdateProfileResponse,
    isAddressRequired?: boolean
  ) => void;
  userData?: UserProfile;
  updateFormLoadingState: (isLoading: boolean) => void;
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
  isPasswordVerificationRequired?: boolean;
  selectedImage: ImagePickerResponse;
  isImageError: boolean;
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
    isPasswordVerificationRequired: false,
    selectedImage: {} as ImagePickerResponse,
    isImageError: false,
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
    const { t, userData } = this.props;
    const { userProfileForm, isPasswordVerificationRequired, selectedImage } = this.state;

    return (
      <>
        <Formik
          onSubmit={this.handleUpdate}
          initialValues={userProfileForm}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
        >
          {(formProps: FormikProps<IUserProfileForm>): React.ReactNode => {
            return (
              <>
                <View style={styles.container}>
                  <View style={styles.profileImage}>
                    <Avatar
                      isOnlyAvatar
                      imageSize={80}
                      fullName={userData?.fullName ?? ''}
                      image={selectedImage.path ?? userData?.profilePicture}
                      onPressCamera={(): void => {
                        this.handleProfileImageUpload(formProps).then();
                      }}
                    />
                  </View>
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
                        multiline
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
                <FormButton
                  formProps={formProps}
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  type="primary"
                  title={t('moreProfile:updateProfile')}
                  containerStyle={styles.buttonStyle}
                />
                <BottomSheet
                  sheetHeight={theme.viewport.height / 1.6}
                  visible={isPasswordVerificationRequired}
                  onCloseSheet={this.closeBottomSheet}
                >
                  <View>
                    <Text style={[styles.commonTextStyle, styles.passwordText]} type="large" textType="semiBold">
                      {t('passwordVerificationText')}
                    </Text>
                    <Text style={[styles.commonTextStyle, styles.helpText]} type="small">
                      {t('enterYourPasswordText')}
                    </Text>
                    <PasswordVerificationForm onFormSubmit={this.onSubmit} />
                  </View>
                </BottomSheet>
              </>
            );
          }}
        </Formik>
      </>
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

  private onSubmit = async (password?: string): Promise<void> => {
    const { onFormSubmitSuccess, updateFormLoadingState } = this.props;
    const { userProfileForm, selectedImage, isAddressRequired } = this.state;
    const {
      firstName,
      lastName,
      email,
      phone,
      phoneCode,
      address,
      postalCode,
      cityName,
      stateName,
      country,
      countryIsoCode,
    } = userProfileForm;

    const userAddress = {
      address,
      postal_code: postalCode,
      city_name: cityName,
      state_name: stateName,
      country_name: country,
      country_iso2_code: countryIsoCode,
    };

    const profileDetails = {
      first_name: firstName,
      last_name: lastName,
      phone_code: phoneCode,
      phone_number: phone,
      email,
      user_address: isAddressRequired ? userAddress : null,
    };

    if (password) {
      this.closeBottomSheet();
    }

    if (!ObjectUtils.isEmpty(selectedImage)) {
      await this.uploadProfileImage();
    }

    const payload: IUpdateProfile = {
      action: UpdateProfileTypes.GET_OTP_OR_UPDATE,
      payload: {
        ...(password && { password }),
        profile_details: profileDetails,
      },
    };

    try {
      updateFormLoadingState(true);

      const response = await UserRepository.updateUserProfileByActions(payload);
      const { isImageError } = this.state;
      updateFormLoadingState(false);
      if (!isImageError) {
        onFormSubmitSuccess(userProfileForm, response && response.user_id ? undefined : response, isAddressRequired);
      }
    }catch (e: any) {      updateFormLoadingState(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private uploadProfileImage = async (): Promise<void> => {
    const { selectedImage } = this.state;
    try {
      const formData = new FormData();
      formData.append('files[]', {
        // @ts-ignore
        name: PlatformUtils.isIOS()
          ? selectedImage.filename
          : selectedImage.path.substring(selectedImage.path.lastIndexOf('/') + 1),
        uri: selectedImage.path,
        type: selectedImage.mime,
      });
      const imageData = await AttachmentService.uploadImage(formData, AttachmentType.PROFILE_IMAGE);
      const { data, error } = imageData;
      if (data) {
        this.setState({ isImageError: false });
        await UserRepository.updateProfileImage({ profile_picture: data[0].id });
      } else if (error && error.length > 0) {
        this.setState({ isImageError: true });
        AlertHelper.error({ message: error[0].message });
      }
    }catch (e: any) {      AlertHelper.error({ message: e.message });
    }
  };

  private handleProfileImageUpload = async (formProps: FormikProps<IUserProfileForm>): Promise<void> => {
    try {
      // @ts-ignore
      const image: ImagePickerResponse = await ImagePicker.openPicker({
        multiple: false,
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
        includeBase64: true,
        mediaType: 'photo',
        freeStyleCropEnabled: true,
      });
      this.setState({ selectedImage: image });
      formProps.setFieldTouched('firstName');
    }catch (e: any) {      if (e.code !== 'E_PICKER_CANCELLED') {
        AlertHelper.error({ message: e.message });
      }
    }
  };

  private handleUpdate = async (
    values: IUserProfileForm,
    formikHelpers: FormikHelpers<IUserProfileForm>
  ): Promise<void> => {
    const { isAddressRequired } = this.state;
    const { userData, t } = this.props;
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
      this.setState({ isPasswordVerificationRequired: userData.isPasswordCreated });
      return;
    }

    await this.onSubmit();
  };

  private closeBottomSheet = (): void => {
    this.setState({ isPasswordVerificationRequired: false });
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
    backgroundColor: theme.colors.white,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
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
    height: 80,
    paddingTop: 16,
    paddingBottom: 16,
  },
  flexOne: {
    flex: 1,
  },
});
