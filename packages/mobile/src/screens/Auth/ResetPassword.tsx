import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { IForgotPasswordPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.ResetPassword>;

interface IResetPasswordState {
  password: string;
}

export class ResetPassword extends Component<Props, IResetPasswordState> {
  public state = {
    password: '',
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const formData = { ...this.state };
    return (
      <Screen
        headerProps={{
          type: 'secondary',
          icon: icons.close,
          onIconPress: this.handleIconPress,
        }}
        pageHeaderProps={{
          contentTitle: t('auth:resetPassword'),
          disableDivider: true,
        }}
        backgroundColor={theme.colors.white}
      >
        <Formik onSubmit={this.onSubmit} validate={FormUtils.validate(this.formSchema)} initialValues={formData}>
          {(formProps: FormikProps<FormikValues>): React.ReactElement => (
            <>
              <FormTextInput
                formProps={formProps}
                inputType="password"
                name="password"
                label="Password"
                helpText={t('auth:passwordValidation')}
                placeholder={t('auth:enterPassword')}
                isMandatory
              />
              <FormButton
                formProps={formProps}
                type="primary"
                title={t('auth:resetPasswordButtonTitle')}
                // @ts-ignore
                onPress={formProps.handleSubmit}
                containerStyle={styles.formButtonStyle}
              />
            </>
          )}
        </Formik>
      </Screen>
    );
  }

  private onSubmit = async (formProps: IResetPasswordState): Promise<void> => {
    const { password } = formProps;
    const userData = await StorageService.get<IUserTokens>(StorageKeys.USER);
    const {
      navigation,
      route: {
        params: { verification_id, invite_id },
      },
      t,
    } = this.props;
    const payload: IForgotPasswordPayload = {
      action: 'SET_PASSWORD',
      payload: {
        verification_id,
        invite_id,
        password,
      },
    };

    UserRepository.resetPassword(payload)
      .then(() => {
        if (userData) {
          StoreProviderService.logoutUserAndClearTokens();
          AlertHelper.success({ message: t('auth:PasswordChangedText') });
          return;
        }

        navigation.navigate(ScreensKeys.SuccessResetPassword);
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private formSchema = (): yup.ObjectSchema<{ password: string }> => {
    const { t } = this.props;
    return yup.object().shape({
      password: yup
        .string()
        .matches(FormUtils.passwordRegex, t('auth:passwordValidation'))
        .min(6, t('auth:minimumCharacters'))
        .required(t('auth:passwordRequired')),
    });
  };
}

export default withTranslation()(ResetPassword);

const styles = StyleSheet.create({
  formButtonStyle: {
    flex: 0,
    marginVertical: 30,
  },
});
