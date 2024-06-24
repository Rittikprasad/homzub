import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import RNRestart from 'react-native-restart';
import { AppModes, ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  children: ReactNode;
}

interface IErrorState {
  hasError: boolean;
}

interface IState {
  error: Error;
  errorInfo: ErrorInfo;
}

class ErrorBoundary extends Component<IProps, IState> {
  public state: IState & IErrorState = {
    hasError: false,
    error: {
      name: '',
      message: '',
      stack: '',
    },
    errorInfo: {
      componentStack: '',
    },
  };

  public static getDerivedStateFromError(): IErrorState {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
    };
  }

  // eslint-disable-next-line react/sort-comp
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    AnalyticsService.track(EventType.Exception, {
      isComponentError: true,
      componentStack: errorInfo.componentStack,
      message: error.message,
    });
    this.setState({
      error,
      errorInfo,
    });
  }

  public render(): ReactNode {
    const { hasError, errorInfo, error } = this.state;
    const { children } = this.props;
    const isDebug = ConfigHelper.getAppMode() === AppModes.DEBUG;

    if (hasError) {
      return (
        <View style={styles.container}>
          <Icon name={icons.filledWarning} size={80} color={theme.colors.warning} />
          <Text>{I18nService.t('common:genericErrorMessage')}</Text>
          <Button
            type="primary"
            title={I18nService.t('common:retry')}
            onPress={this.onRetry}
            containerStyle={styles.button}
          />
          {isDebug && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.message}>
                {error.message}
                {errorInfo.componentStack}
              </Text>
            </ScrollView>
          )}
        </View>
      );
    }

    return children;
  }

  private onRetry = (): void => {
    RNRestart.Restart();
  };
}

export default ErrorBoundary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    marginHorizontal: 20,
  },
  message: {
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
    flex: 0,
  },
});
