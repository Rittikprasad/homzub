import React, { PureComponent } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { WithTranslation } from 'react-i18next';
// @ts-ignore
import Markdown from 'react-native-easy-markdown';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { CommonService } from '@homzhub/common/src/services/CommonService';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Header } from '@homzhub/mobile/src/components';

type OwnProps = WithTranslation & NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.MarkdownScreen>;
type Props = OwnProps;

interface IMarkdownState {
  markdownData: string;
}

export class MarkdownView extends PureComponent<Props, IMarkdownState> {
  public state = {
    markdownData: '',
  };

  public componentDidMount = (): void => {
    const {
      route: { params },
    } = this.props;
    CommonService.getMarkdownData(params.isFrom).then((response) => {
      this.setState({ markdownData: response });
    });
  };

  public render(): React.ReactElement {
    const {
      route: { params },
    } = this.props;
    const { markdownData } = this.state;
    return (
      <View style={styles.container}>
        <Header
          type="primary"
          icon={icons.leftArrow}
          onIconPress={this.navigateBack}
          title={params.title ?? ''}
          testID="header"
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.markdownContainer}>
            <Markdown markdownStyles={{ strong: { fontWeight: 'bold' }, text: { fontWeight: 'normal', fontSize: 16 } }}>
              {markdownData}
            </Markdown>
          </View>
        </ScrollView>
      </View>
    );
  }

  public navigateBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  markdownContainer: {
    margin: theme.layout.screenPadding,
  },
});
