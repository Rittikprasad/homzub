import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { RadioButtonGroup } from '@homzhub/common/src/components/molecules/RadioButtonGroup';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { IUpdateProspectProfile } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IOfferForm {
  jobType: number;
  companyName: string;
  workEmail: string | null;
  occupants: string;
  tenantType: number;
}

interface IScreenState {
  offerForm: IOfferForm;
  userType: number;
  categories: IUnit[];
  tenantType: IUnit[];
}

interface IStateToProps {
  userDetails: UserProfile | null;
}

interface IProp {
  editData: boolean;
  isTablet: boolean;
  isMobile: boolean;
  onClosePopover: () => void;
  changePopUpStatus: (datum: string) => void;
}

type libraryProps = WithTranslation;
type Props = libraryProps & IProp & IStateToProps;
class ProspectProfileForm extends Component<Props, IScreenState> {
  public state = {
    offerForm: {
      jobType: 0,
      companyName: '',
      workEmail: '',
      occupants: '',
      tenantType: 0,
    },
    userType: 0,
    categories: [],
    tenantType: [],
  };

  public async componentDidMount(): Promise<void> {
    try {
      const { userDetails } = this.props;
      const { offerForm } = this.state;
      const tenant = await OffersRepository.getTenantTypes();
      const jobType = await OffersRepository.getJobType();
      this.setState({
        categories: jobType,
        tenantType: tenant,
        offerForm: {
          ...offerForm,
          workEmail: userDetails?.workInfo?.workEmail ?? '',
          companyName: userDetails?.workInfo?.companyName ?? '',
        },
      });
      const prospectsData = await OffersRepository.getProspectsInfo();
      const {
        user: { workInfo },
        occupants,
        tenantType,
      } = prospectsData;
      const { editData } = this.props;
      if (editData) {
        this.setState({
          offerForm: {
            jobType: workInfo.jobType.id,
            occupants: String(occupants),
            companyName: workInfo.companyName,
            workEmail: workInfo.workEmail ?? '',
            tenantType: tenantType.id,
          },
          userType: tenantType.id,
        });
      }
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  }

  public render = (): React.ReactNode => {
    const { t, userDetails, isTablet, isMobile, onClosePopover } = this.props;
    const { offerForm, userType, tenantType } = this.state;
    if (!userDetails) return null;
    return (
      <View>
        <Formik
          onSubmit={this.onSubmit}
          initialValues={offerForm}
          enableReinitialize
          validate={FormUtils.validate(this.formSchema)}
        >
          {(formProps: FormikProps<IOfferForm>): React.ReactNode => {
            const disabledButton = !formProps.values.occupants || !formProps.values.jobType || !userType;
            return (
              <>
                <View
                  style={[styles.container, isTablet && styles.containerTablet, isMobile && styles.containerMobile]}
                >
                  <KeyboardAwareScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <Avatar
                      fullName={userDetails.name}
                      designation={userDetails.email}
                      image={userDetails.profilePicture}
                    />
                    <Label type="large" textType="regular" style={styles.radioGroup}>
                      {t('offers:tenantProfileInfo')}
                    </Label>

                    <FormDropdown
                      formProps={formProps}
                      isMandatory
                      options={this.loadJobTypeCategories()}
                      name="jobType"
                      label={t('offers:jobType')}
                      placeholder={t('offers:selfEmployed')}
                      dropdownContainerStyle={styles.dropdownStyle}
                    />
                    <FormTextInput
                      formProps={formProps}
                      inputType="default"
                      name="companyName"
                      label={t('offers:organizationName')}
                      placeholder={t('offers:enterName')}
                    />
                    <FormTextInput
                      formProps={formProps}
                      inputType="email"
                      name="workEmail"
                      label={t('offers:workEmail')}
                      placeholder={t('offers:enterEmail')}
                    />
                    <FormTextInput
                      formProps={formProps}
                      isMandatory
                      inputType="number"
                      name="occupants"
                      label={t('offers:occupants')}
                      placeholder={t('offers:enterNumber')}
                    />

                    <Text type="small" textType="semiBold" style={styles.radioGroup}>
                      {t('offers:tenantType')}
                    </Text>
                    <RadioButtonGroup
                      numColumns={3}
                      data={tenantType as Unit[]}
                      onToggle={this.handleUserType}
                      selectedValue={userType}
                      containerStyle={styles.radioButton}
                    />
                  </KeyboardAwareScrollView>

                  <View style={styles.formButtonContainer}>
                    <FormButton
                      // @ts-ignore
                      onPress={formProps.handleSubmit}
                      formProps={formProps}
                      disabled={disabledButton}
                      type="primary"
                      title={t('common:next')}
                      containerStyle={styles.submitButton}
                    />
                    <Button
                      onPress={onClosePopover}
                      type="secondary"
                      title={t('common:cancel')}
                      containerStyle={styles.cancelButton}
                    />
                  </View>
                </View>
              </>
            );
          }}
        </Formik>
      </View>
    );
  };

  public onSubmit = async (values: IOfferForm): Promise<void> => {
    const { t, changePopUpStatus } = this.props;
    const { userType } = this.state;
    const isValid = await this.validateEmail(values.workEmail);
    if (!isValid) {
      AlertHelper.error({ message: t('auth:emailUsed') });
      return;
    }

    const payload: IUpdateProspectProfile = {
      job_type: values.jobType,
      company_name: values.companyName,
      work_email: !values.workEmail ? null : values.workEmail,
      number_of_occupants: Number(values.occupants),
      tenant_type: userType,
    };

    try {
      await OffersRepository.updateProspects(payload);
      changePopUpStatus('OFFER');
      return;
    }catch (err: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
    }
  };

  private validateEmail = async (email: string | null): Promise<boolean> => {
    const { userDetails } = this.props;
    let isExists = true;
    if (!email || userDetails?.workInfo?.workEmail === email) return true;
    if (userDetails?.workInfo?.workEmail !== email) {
      try {
        const res = await UserRepository.workEmailExists(email);
        isExists = res.is_exists;
      }catch (e: any) {        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
      }
    }
    return !isExists;
  };

  private formSchema = (): yup.ObjectSchema => {
    const { t } = this.props;
    return yup.object().shape({
      jobType: yup.number().required(t('moreProfile:fieldRequiredError')),
      occupants: yup.string().required(t('moreProfile:fieldRequiredError')),
      tenantType: yup.number().required(t('moreProfile:fieldRequiredError')),
    });
  };

  private loadJobTypeCategories = (): IDropdownOption[] => {
    const { categories } = this.state;
    return categories.map((category: IUnit) => {
      return {
        value: category.id,
        label: category.label,
      };
    });
  };

  private handleUserType = (id: number): void => {
    this.setState({ userType: id });
  };
}

const mapStateToProps = (state: IState): IStateToProps => {
  return {
    userDetails: UserSelector.getUserProfile(state),
  };
};

export default connect(mapStateToProps, null)(withTranslation()(ProspectProfileForm));

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    overflowY: 'scroll',
    height: 400,
  },
  containerTablet: {
    height: 660,
  },
  containerMobile: {
    height: 450,
  },
  radioGroup: {
    marginVertical: 16,
    color: theme.colors.darkTint3,
  },
  dropdownStyle: {
    paddingVertical: 12,
  },
  scrollView: {
    flex: 2.9,
    paddingHorizontal: 16,
  },
  formButtonContainer: {
    width: '100%',
    flex: 0.1,
    backgroundColor: theme.colors.white,
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    marginTop: 28,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: theme.colors.boxShadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    elevation: 7,
  },
  radioButton: {
    marginBottom: 20,
  },
  submitButton: {
    height: 46,
  },
  cancelButton: {
    marginRight: 18,
  },
});
