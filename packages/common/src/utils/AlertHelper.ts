import { Alert, Keyboard } from 'react-native';
import { hideMessage, showMessage } from 'react-native-flash-message';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';

export interface IToastProps {
  message: string;
  onPress?: () => void;
  description?: string;
  duration?: number;
  statusCode?: number;
}

export interface IAlertProps {
  title: string;
  message: string;
  onOkay: () => void;
  onCancel?: () => void;
}

class AlertHelper {
  public success = (options: IToastProps): void => {
    const { message, onPress, description, duration } = options;
    showMessage({
      message,
      type: 'success',
      backgroundColor: theme.colors.success,
      onPress,
      description,
      duration,
    });
  };

  public error = (options: IToastProps): void => {
    Keyboard.dismiss();
    const { message } = options;
    if (PlatformUtils.isMobile()) {
      showMessage({
        duration: 5000,
        message,
        type: 'danger',
        backgroundColor: theme.colors.error,
      });
    } else {
      const { statusCode } = options;
      const messageProps = {
        message,
      };
      NavigationService.errorNavSwitch(statusCode as number, messageProps);
    }
  };

  public info = (options: IToastProps): void => {
    Keyboard.dismiss();
    const { message } = options;
    showMessage({
      duration: 3000,
      message,
      type: 'info',
      backgroundColor: theme.colors.alertInfo,
    });
  };

  public dismiss(): void {
    hideMessage();
  }

  public alert = (options: IAlertProps): void => {
    const { title, message, onOkay, onCancel } = options;
    Alert.alert(
      title,
      message,
      [
        { text: 'OK', onPress: onOkay },
        {
          text: 'Cancel',
          onPress: onCancel,
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };
}

const alertHelper = new AlertHelper();
export { alertHelper as AlertHelper };
