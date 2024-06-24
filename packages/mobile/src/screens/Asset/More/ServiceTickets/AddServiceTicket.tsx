import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { StyleSheet, TouchableOpacity } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { IUploadCompProps } from '@homzhub/common/src/components/organisms/AddRecordForm';
import AddServiceTicketForm from '@homzhub/common/src/components/organisms/ServiceTickets/AddServiceTicketForm';
import { UploadBoxComponent } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { IAssetState } from '@homzhub/common/src/modules/asset/interfaces';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';
import { IGetTicketParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IScreenState {
  clearCount: number;
  isScreenLoading: boolean;
}

interface IStateToProps {
  properties: Asset[];
  loaders: IAssetState['loaders'];
}

interface IDispatchToProps {
  getActiveAssets: () => void;
  getTickets: (param?: IGetTicketParam) => void;
  setCurrentTicket: (payload: ICurrentTicket) => void;
}

type NavigationProps = NavigationScreenProps<CommonParamList, ScreensKeys.AddServiceTicket>;

type Props = WithTranslation & IStateToProps & NavigationProps & IDispatchToProps;

class AddServiceTicket extends React.PureComponent<Props, IScreenState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      clearCount: 0,
      isScreenLoading: false,
    };
  }

  public render(): React.ReactElement {
    const {
      t,
      route,
      navigation: { goBack },
      properties,
      loaders: { activeAssets },
    } = this.props;
    const { isScreenLoading, clearCount } = this.state;

    const propertyId = route && route.params && route.params.propertyId;
    const isPropertiesPresent = properties && properties.length > 0;
    const title = route?.params?.isFromDashboard ? t('assetDashboard:dashboard') : t('assetMore:tickets');

    return (
      <UserScreen
        title={title}
        pageTitle={t('serviceTickets:newTicket')}
        onBackPress={goBack}
        rightNode={isPropertiesPresent ? this.renderClearButton() : undefined}
        scrollEnabled
        loading={activeAssets || isScreenLoading}
      >
        <AddServiceTicketForm
          propertyId={propertyId}
          onAddProperty={this.onAddProperty}
          onSubmit={this.onSubmit}
          renderUploadBoxComponent={this.renderUploadBoxComponent}
          toggleLoader={this.toggleScreenLoader}
          clearCount={clearCount}
        />
      </UserScreen>
    );
  }

  private renderUploadBoxComponent = (uploadProps: IUploadCompProps): React.ReactElement => {
    return <UploadBoxComponent allowedTypes={[DocumentPicker.types.images]} {...uploadProps} />;
  };

  private renderClearButton = (): React.ReactElement => {
    const { t } = this.props;

    return (
      <TouchableOpacity onPress={this.onClear}>
        <Label type="large" textType="semiBold" style={styles.clear}>
          {t('common:clear')}
        </Label>
      </TouchableOpacity>
    );
  };

  private onClear = (): void => {
    this.setState((prevState: IScreenState) => {
      return { clearCount: prevState.clearCount + 1 };
    });
  };

  private onAddProperty = (): void => {
    const { navigation } = this.props;
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, { screen: ScreensKeys.AssetLocationSearch });
    AnalyticsService.track(EventType.AddPropertyInitiation);
  };

  private onSubmit = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.RequestQuote, { isFromForm: true });
  };

  private toggleScreenLoader = (isScreenLoading: boolean): void => {
    this.setState({ isScreenLoading });
  };
}
const mapStateToProps = (state: IState): IStateToProps => {
  return {
    properties: AssetSelectors.getUserActiveAssets(state),
    loaders: AssetSelectors.getAssetLoaders(state),
  };
};

export default connect(mapStateToProps, null)(withTranslation()(AddServiceTicket));

const styles = StyleSheet.create({
  clear: {
    color: theme.colors.blue,
  },
});
