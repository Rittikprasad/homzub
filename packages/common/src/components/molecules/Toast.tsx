import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle } from 'react-native';
import { MessageComponentProps } from 'react-native-flash-message';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';

interface IMessage {
  message: string;
  description?: string;
  type?: string;
  backgroundColor?: string;
  color?: string;
  duration?: number;
  onPress: () => void;
}

interface IState {
  scrollHeight: number | string;
}

type IProps = MessageComponentProps & WithTranslation;
class Toast extends React.PureComponent<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      scrollHeight: '',
    };
  }

  public componentDidMount = (): void => {
    if (PlatformUtils.isWeb()) {
      this.updateDimensions();
      window.addEventListener('scroll', this.updateDimensions);
    }
  };

  public componentWillUnmount = (): void => {
    if (PlatformUtils.isWeb()) {
      window.removeEventListener('scroll', this.updateDimensions);
    }
  };

  public render = (): React.ReactNode => {
    const {
      t,
      message: { message, type, description },
    } = this.props;

    const icon = type === 'danger' ? icons.circularCrossFilled : icons.circularCheckFilled;
    return (
      <View style={this.getContainerStyle()}>
        <View style={styles.iconMessageContainer}>
          {icon && <Icon name={icon} size={20} color={theme.colors.white} style={styles.icon} />}
          <View>
            {!!description && (
              <Text type="small" textType="semiBold" style={styles.text} numberOfLines={2}>
                {description}
              </Text>
            )}
            <Label type="large" style={styles.text} numberOfLines={2}>
              {message}
            </Label>
          </View>
        </View>
        {(type === 'danger' || 'info') && (
          <TouchableHighlight
            testID="toHighPress"
            style={styles.buttonContainer}
            onPress={this.onOKPress}
            underlayColor={theme.colors.highPriority}
          >
            <Label type="large" textType="semiBold" style={styles.buttonTitleStyle}>
              {t('ok')}
            </Label>
          </TouchableHighlight>
        )}
      </View>
    );
  };

  private onOKPress = (): void => {
    const { message } = this.props;
    const { onPress = FunctionUtils.noop } = message as IMessage;

    if (onPress) {
      onPress();
    }
    AlertHelper.dismiss();
  };

  private updateDimensions = (): void => {
    /**
     * window.scrollY or window.pageYOffset both can be used
     */
    this.setState({ scrollHeight: window.pageYOffset });
  };

  private getContainerStyle = (): StyleProp<ViewStyle> => {
    const isWeb = PlatformUtils.isWeb();
    const { scrollHeight } = this.state;
    const {
      message: { backgroundColor },
    } = this.props;
    return StyleSheet.flatten([
      styles.container,
      { backgroundColor },
      isWeb && styles.containerWeb && { top: scrollHeight },
    ]);
  };
}

const HOC = withTranslation()(Toast);
export { HOC as Toast };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: theme.layout.toastMargin,
  },
  containerWeb: {
    position: 'absolute',
  },
  buttonContainer: {
    borderRadius: 4,
  },
  iconMessageContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    flex: 1,
    marginEnd: 16,
    color: theme.colors.white,
  },
  buttonTitleStyle: {
    color: theme.colors.white,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  icon: {
    marginEnd: 12,
  },
});
