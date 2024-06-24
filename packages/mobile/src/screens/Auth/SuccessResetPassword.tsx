import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';

export type Props = WithTranslation & NavigationScreenProps<CommonParamList, ScreensKeys.SuccessResetPassword>;

export class SuccessResetPassword extends Component<Props, {}> {
  public render(): React.ReactNode {
    const { t } = this.props;
    return (
      <Screen
        headerProps={{
          type: 'secondary',
          icon: icons.close,
          onIconPress: this.navigateToLogin,
        }}
        pageHeaderProps={{
          contentTitle: t('auth:successResetPassword'),
          contentSubTitle: t('auth:successResetPasswordDescription'),
          disableDivider: true,
        }}
        backgroundColor={theme.colors.white}
      >
        <Button
          type="primary"
          title={t('common:login')}
          onPress={this.navigateToLogin}
          containerStyle={styles.button}
          testID="btnLogin"
        />
      </Screen>
    );
  }

  public navigateToLogin = (): void => {
    const { navigation } = this.props;

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreensKeys.Login }],
      })
    );
  };
}

export default withTranslation()(SuccessResetPassword);

const styles = StyleSheet.create({
  button: {
    flex: 0,
  },
});
