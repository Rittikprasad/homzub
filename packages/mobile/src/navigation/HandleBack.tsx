import React from 'react';
import { BackHandler, View, StyleSheet } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  navigation?: any;
  onBack?: () => void;
  children: React.ReactElement | React.ReactNode;
}

class HandleBack extends React.Component<IProps> {
  public _didFocusSubscription: any;
  public _willBlurSubscription: any;

  constructor(props: IProps) {
    super(props);
    if (PlatformUtils.isAndroid()) {
      BackHandler.addEventListener('hardwareBackPress', this.onBack);

      const { navigation } = this.props;
      if (navigation) {
        this._didFocusSubscription = navigation.addListener('didFocus', (payload: any) =>
          BackHandler.addEventListener('hardwareBackPress', this.onBack)
        );
      } else {
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
      }
    }
  }

  public componentDidMount(): void {
    if (PlatformUtils.isAndroid()) {
      const { navigation } = this.props;
      if (navigation) {
        this._willBlurSubscription = navigation.addListener('willBlur', (payload: any) =>
          BackHandler.removeEventListener('hardwareBackPress', this.onBack)
        );
      } else {
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
      }
    }
  }

  public componentWillUnmount(): void {
    if (PlatformUtils.isAndroid()) {
      const { navigation } = this.props;
      if (navigation) {
        this._didFocusSubscription();
        this._willBlurSubscription();
      }
      BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }
  }

  public render(): React.ReactElement | React.ReactNode {
    const { children } = this.props;
    return <View style={styles.container}>{children}</View>;
  }

  public onBack = (): boolean => {
    const { onBack } = this.props;
    if (onBack) {
      onBack();
      return true;
    }

    return false;
  };
}

export default HandleBack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
