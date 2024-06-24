import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, FormikProps } from 'formik';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { RazorpayService } from '@homzhub/common/src/services/RazorpayService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { IfscDetail } from '@homzhub/common/src/domain/models/IfscDetail';
import { PanNumber } from '@homzhub/common/src/domain/models/PanNumber';
import { IBankAccountPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IfscLength } from '@homzhub/common/src/assets/constants';

interface IOwnProps {
  onSubmit?: () => void;
  userId?: number;
  setLoading?: (loading: boolean) => void;
  isEditFlow?: boolean;
  isSocietyAccount?: boolean;
  isConfirmed?: boolean;
  handleConfirmation?: () => void;
  onError?: (isConfirm: boolean) => void;
}
interface IBankAccount {
  beneficiaryName: string;
  bankName: string;
  ifscCode: string;
  bankAccNum: string;
  confirmBankAccNum: string;
  panNumber?: string;
}

const AddBankAccountForm = (props: IOwnProps): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    onSubmit,
    userId,
    setLoading,
    isEditFlow = false,
    isSocietyAccount = false,
    isConfirmed = false,
    handleConfirmation,
    onError,
  } = props;
  const [panDetail, setPanDetail] = useState(new PanNumber());
  const [ifscError, setIfscError] = useState('');
  const [formDetail, setFormDetail] = useState<IBankAccountPayload>();
  const ifscDetail = useSelector(CommonSelectors.getIfscDetail);
  const currentBankId = useSelector(UserSelector.getCurrentBankId);
  const currentBank = useSelector(UserSelector.getCurrentBankAccountSelected);
  const societyBankData = useSelector(PropertyPaymentSelector.getSocietyBankData);

  useEffect(() => {
    if (isConfirmed) {
      handleSubmit();
    }
  }, [isConfirmed]);

  const getInitialData = (): IBankAccount => {
    if (isEditFlow && currentBank) {
      const { beneficiaryName, bankName, ifscCode, panNumber, accountNumber } = currentBank;
      return {
        beneficiaryName,
        bankName,
        ifscCode,
        bankAccNum: accountNumber,
        confirmBankAccNum: '',
        panNumber: panNumber ?? '',
      };
    }

    if (isSocietyAccount && societyBankData) {
      return {
        beneficiaryName: societyBankData.beneficiary_name,
        bankName: societyBankData.bank_name,
        bankAccNum: societyBankData.account_number,
        confirmBankAccNum: '',
        ifscCode: societyBankData.ifsc_code,
      };
    }
    return {
      beneficiaryName: '',
      bankName: '',
      ifscCode: '',
      bankAccNum: '',
      confirmBankAccNum: '',
      ...(!isSocietyAccount && { panNumber: panDetail.panNumber }),
    };
  };

  const fetchPanDetails = async (): Promise<void> => {
    try {
      if (setLoading) {
        setLoading(true);
      }
      if (userId) {
        const response = await UserRepository.getPanDetails(userId);
        setPanDetail(response);
      }
      if (setLoading) {
        setLoading(false);
      }
    } catch (e) {
      if (setLoading) {
        setLoading(false);
      }
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  useEffect(() => {
    fetchPanDetails().then();
  }, []);

  const formSchema = (): yup.ObjectSchema<IBankAccount> => {
    return yup.object().shape({
      beneficiaryName: yup.string().required(t('moreProfile:fieldRequiredError')),
      bankName: yup.string().required(t('moreProfile:fieldRequiredError')),
      ifscCode: yup
        .string()
        .required(t('moreProfile:fieldRequiredError'))
        .test({
          name: 'hasIfscTest',
          message: t('assetFinancial:ifscFormatError'),
          test(ifsc: string) {
            if (ifsc.length > 0) return StringUtils.isValidIfsc(ifsc);
            return true;
          },
        }),
      bankAccNum: yup.string().required(t('moreProfile:fieldRequiredError')),
      confirmBankAccNum: yup.string().test({
        name: 'confirmBankAccNumTest',
        exclusive: true,
        message: t('assetFinancial:accNumMismatch'),
        test(confirmBankAccNum: string) {
          // eslint-disable-next-line react/no-this-in-sfc
          const { bankAccNum } = this.parent;
          return confirmBankAccNum === bankAccNum;
        },
      }),
      ...(!isSocietyAccount && {
        panNumber: yup.string().test({
          name: 'hasIfscTest',
          message: t('assetFinancial:panFormatError'),
          test(pan: string) {
            return pan.length > 0 ? StringUtils.isValidPan(pan) : true;
          },
        }),
      }),
    });
  };

  const onChangeIfsc = async (input: string, formProps: FormikProps<IBankAccount>): Promise<void> => {
    if (input.length === IfscLength) {
      const errorPayload = {
        onError: (error: string): void => setIfscError(error),
      };
      await RazorpayService.validateIfsc(input, errorPayload);
    } else {
      setIfscError('');
      dispatch(CommonActions.setIfscDetail(new IfscDetail()));
    }
  };

  const onFormSubmit = (values: IBankAccount): void => {
    const { beneficiaryName, bankName, bankAccNum, ifscCode, panNumber } = values;

    // Handle bank account addition flow for society
    if (isSocietyAccount && onSubmit) {
      dispatch(
        PropertyPaymentActions.setSocietyBankData({
          beneficiary_name: beneficiaryName,
          bank_name: bankName,
          account_number: bankAccNum,
          ifsc_code: ifscCode.toUpperCase(),
        })
      );
      onSubmit();
    } else {
      const payload = {
        beneficiary_name: beneficiaryName,
        bank_name: bankName,
        account_number: bankAccNum,
        pan_number: panNumber && panNumber.length > 0 ? panNumber : undefined,
        ifsc_code: ifscCode.toUpperCase(),
        is_confirmed: false,
      } as IBankAccountPayload;

      setFormDetail(payload);
      if (handleConfirmation) {
        handleConfirmation();
      }
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (formDetail) {
      try {
        if (setLoading) {
          setLoading(true);
        }
        const payload = {
          ...formDetail,
          is_confirmed: isConfirmed,
        };
        // Handle bank account addition flow for users
        if (isEditFlow && currentBankId !== -1 && userId) {
          await UserRepository.editBankDetails(userId, currentBankId, payload);
          AlertHelper.success({ message: t('assetFinancial:bankAccountEditedSuccessfully') });
        } else {
          if (userId) {
            await UserRepository.addBankDetails(userId, payload);
          }
          AlertHelper.success({ message: t('assetFinancial:addBankDetailsSuccess') });
        }
        dispatch(CommonActions.clearIfscDetail());
        if (setLoading) {
          setLoading(false);
        }
        if (onSubmit) onSubmit();
      } catch (e) {
        if (setLoading) {
          setLoading(false);
        }
        if (onError) {
          onError(false);
        }
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
      }
    }
  };

  const renderIcon = (): React.ReactNode => {
    if (!ifscDetail.branch) return null;
    return <Icon name={icons.circularCheckFilled} size={20} color={theme.colors.primaryColor} />;
  };

  return (
    <>
      <View style={styles.infoTextContainer}>
        <Icon name={icons.roundFilled} color={theme.colors.blackTint2} style={styles.dotIcon} size={7} />
        <Label type="small" style={styles.infoText}>
          {t('common:featureInIndiaOnly')}
        </Label>
      </View>
      <Formik
        initialValues={getInitialData()}
        onSubmit={onFormSubmit}
        validate={FormUtils.validate(formSchema)}
        enableReinitialize
      >
        {(formProps): React.ReactNode => {
          return (
            <>
              <FormTextInput
                formProps={formProps}
                inputType="default"
                name="beneficiaryName"
                label={t('assetFinancial:beneficiaryName')}
                placeholder={t('assetFinancial:enterBeneficiaryName')}
                fontWeightType="semiBold"
              />
              <FormTextInput
                formProps={formProps}
                inputType="default"
                name="bankName"
                label={t('assetFinancial:bankName')}
                placeholder={t('assetFinancial:enterBankName')}
                fontWeightType="semiBold"
              />
              <FormTextInput
                formProps={formProps}
                inputType="default"
                name="ifscCode"
                label={t('assetFinancial:ifscCode')}
                placeholder={t('assetFinancial:ifscCode')}
                fontWeightType="semiBold"
                helpText={ifscDetail.branch}
                maxLength={IfscLength}
                extraError={ifscError}
                inputGroupSuffix={renderIcon()}
                onValueChange={(input): Promise<void> => onChangeIfsc(input, formProps)}
              />
              <FormTextInput
                formProps={formProps}
                inputType="default"
                name="bankAccNum"
                label={t('assetFinancial:bankAccountNumber')}
                placeholder={t('assetFinancial:bankAccountNumber')}
                fontWeightType="semiBold"
                secureTextEntry
              />
              <FormTextInput
                formProps={formProps}
                inputType="default"
                name="confirmBankAccNum"
                label={t('assetFinancial:confirmBankAccountNumber')}
                placeholder={t('assetFinancial:confirmBankAccountNumber')}
                fontWeightType="semiBold"
              />
              {!isSocietyAccount && (
                <FormTextInput
                  formProps={formProps}
                  inputType="default"
                  name="panNumber"
                  label={t('assetFinancial:panNumber')}
                  placeholder={t('assetFinancial:enterPanNumber')}
                  fontWeightType="semiBold"
                  optionalText={t('common:optional')}
                  editable={panDetail.canEdit}
                />
              )}
              <FormButton
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
                type="primary"
                title={
                  isEditFlow && currentBank ? t('assetFinancial:updateDetails') : t('assetFinancial:addBankAccount')
                }
                containerStyle={styles.button}
                disabled={isEqual(formProps.values, getInitialData()) || !!ifscError}
              />
            </>
          );
        }}
      </Formik>
    </>
  );
};
export default AddBankAccountForm;
const styles = StyleSheet.create({
  button: {
    marginVertical: 30,
  },
  dotIcon: {
    marginEnd: 7,
  },
  infoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: theme.colors.blackTint2,
  },
});
