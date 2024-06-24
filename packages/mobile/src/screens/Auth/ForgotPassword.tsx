import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { IForgotPasswordPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

interface IForgotPasswordState {
  email: string;
  isRequestDisable: boolean;
}

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.ForgotPassword>;

export class ForgotPassword extends Component<Props, IForgotPasswordState> {
  public state = {
    email: '',
    isRequestDisable: false,
  };

  public render(): React.ReactNode {
    const {
      t,
      route: { params },
    } = this.props;
    const { isRequestDisable } = this.state;
    const formData = { ...this.state };
    return (
      <Screen
        headerProps={{
          type: 'secondary',
          icon: icons.close,
          onIconPress: this.handleIconPress,
        }}
        pageHeaderProps={{
          contentTitle: t('auth:forgotPassword'),
          contentSubTitle: t('auth:forgotPasswordDescription'),
          disableDivider: true,
        }}
        backgroundColor={theme.colors.white}
      >
        <Formik onSubmit={this.onSubmit} validate={FormUtils.validate(this.formSchema)} initialValues={formData}>
          {(formProps: FormikProps<FormikValues>): React.ReactElement => (
            <>
              <FormTextInput
                formProps={formProps}
                inputType="email"
                name="email"
                label="Email"
                placeholder={t('auth:enterEmail')}
                isMandatory
                onValueChange={this.onValueChange}
              />
              <FormButton
                formProps={formProps}
                type="primary"
                title={t('auth:forgotPasswordRequestLink')}
                // @ts-ignore
                onPress={formProps.handleSubmit}
                containerStyle={styles.formButtonStyle}
                disabled={!formProps.values.email || (formProps.values.email && isRequestDisable)}
              />
            </>
          )}
        </Formik>
        {params && !params.isFromMore && (
          <Text
            type="small"
            textType="semiBold"
            style={styles.backToLoginLink}
            onPress={this.navigateToLogin}
            testID="txtLogin"
          >
            {t('auth:backToLogin')}
          </Text>
        )}
      </Screen>
    );
  }

  private onValueChange = (): void => {
    const { isRequestDisable } = this.state;
    if (isRequestDisable) {
      this.setState({ isRequestDisable: false });
    }
  };

  private onSubmit = async (formProps: IForgotPasswordState): Promise<void> => {
    const { t } = this.props;
    const { email } = formProps;
    const payload: IForgotPasswordPayload = {
      action: 'SEND_EMAIL',
      payload: {
        email,
      },
    };

    this.setState({ isRequestDisable: true });

    try {
      const emailData = await UserRepository.emailExists(email);
      if (emailData.is_exists) {
        UserRepository.resetPassword(payload)
          .then(() => {
            AlertHelper.success({ message: t('auth:resetLink') });
          })
          .catch((err) => {
            AlertHelper.error({ message: err });
          });
      } else {
        AlertHelper.error({ message: t('auth:emailNotExists') });
      }
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  public navigateToLogin = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;
    const onCallback = params && params.onCallback ? { onCallback: params.onCallback } : {};
    navigation.navigate(ScreensKeys.EmailLogin, onCallback);
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private formSchema = (): yup.ObjectSchema<{ email: string }> => {
    const { t } = this.props;
    return yup.object().shape({
      email: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
    });
  };
}

export default withTranslation()(ForgotPassword);

const styles = StyleSheet.create({
  formButtonStyle: {
    flex: 0,
    marginVertical: 30,
  },
  backToLoginLink: {
    color: theme.colors.blue,
    alignSelf: 'center',
  },
});
