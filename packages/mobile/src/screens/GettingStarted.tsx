import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { GuestStackNavigatorParamList } from '@homzhub/mobile/src/navigation/GuestStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type IProps = NavigationScreenProps<GuestStackNavigatorParamList, ScreensKeys.GettingStarted> & WithTranslation;

export class GettingStarted extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    const { t } = this.props;
    return (
      <>
        <View style={styles.container}>
          <Image source={{ uri: '' }} style={styles.image} />
          <Text type="regular" textType="semiBold" style={styles.header}>
            {t('header')}
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              title={t('common:searchProperties')}
              type="primary"
              textSize="small"
              containerStyle={styles.searchProperty}
              onPress={this.searchProperty}
              testID="btnSearchProperty"
            />
            <Button
              title={t('login')}
              type="secondary"
              containerStyle={styles.login}
              onPress={this.login}
              testID="btnLogin"
            />
            <Label type="large" textType="regular" style={styles.image}>
              {t('newAroundHere')} &nbsp;
              <Label
                type="large"
                textType="bold"
                style={styles.signUpLink}
                onPress={this.navigateToSignUp}
                testID="lblSignup"
              >
                {t('signUp')}
              </Label>
            </Label>
          </View>
        </View>
      </>
    );
  }

  public searchProperty = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.SearchStack);
  };

  public login = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.AuthStack, { screen: ScreensKeys.Login, params: {} });
  };

  public navigateToSignUp = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.AuthStack, { screen: ScreensKeys.SignUp, params: {} });
  };
}

export default withTranslation()(GettingStarted);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-around',
    padding: theme.layout.screenPadding,
  },
  image: {
    alignSelf: 'center',
  },
  header: {
    textAlign: 'center',
    lineHeight: 30,
  },
  buttonContainer: {
    alignItems: 'stretch',
    marginHorizontal: 20,
  },
  searchProperty: {
    flex: 0,
  },
  login: {
    flex: 0,
    marginVertical: 20,
  },
  signUpLink: {
    color: theme.colors.blue,
  },
});
