import React, { ReactElement } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { UploadBoxComponent } from '@homzhub/mobile/src/components/molecules/UploadBoxComponent';
import AddRecordForm, { IUploadCompProps } from '@homzhub/common/src/components/organisms/AddRecordForm';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IScreenState {
  clearForm: number;
  isLoading: boolean;
}

interface IStateToProps {
  currency: Currency;
  assets: Asset[];
  activeAsset: Asset[];
}

type libraryProps = WithTranslation & NavigationScreenProps<CommonParamList, ScreensKeys.AddRecordScreen>;
type IProps = libraryProps & IStateToProps;

export class AddRecordScreen extends React.PureComponent<IProps, IScreenState> {
  public state = {
    isLoading: false,
    clearForm: 0,
  };

  public render(): ReactElement {
    const { t, route } = this.props;
    const { isLoading } = this.state;
    const title = route?.params?.isFromDashboard ? t('assetDashboard:dashboard') : t('financial');

    return (
      <>
        <UserScreen
          title={title}
          pageTitle={t('addRecords')}
          loading={isLoading}
          rightNode={route?.params?.isFromDues ? undefined : this.renderRightNode()}
          onBackPress={this.goBack}
        >
          <View style={styles.content}>{this.renderAddRecordForm()}</View>
        </UserScreen>
      </>
    );
  }

  private renderRightNode = (): ReactElement => {
    const { t } = this.props;
    return (
      <TouchableOpacity onPress={this.onClearPress}>
        <Text type="small" textType="bold" style={styles.clearText}>
          {t('common:clear')}
        </Text>
      </TouchableOpacity>
    );
  };

  private renderAddRecordForm = (): ReactElement => {
    const { clearForm } = this.state;
    const { currency, assets, route, activeAsset } = this.props;
    const isFromDues = Boolean(route?.params?.isFromDues);

    return (
      <AddRecordForm
        properties={isFromDues ? activeAsset : assets}
        clear={clearForm}
        defaultCurrency={currency}
        onFormClear={this.onClearPress}
        onSubmitFormSuccess={this.onSubmitFormSuccess}
        toggleLoading={this.toggleLoading}
        transactionId={route?.params?.transactionId ?? -1}
        renderUploadBoxComponent={this.renderUploadBoxComponent}
        onPressLink={this.onPressLink}
        assetId={route?.params?.assetId}
        containerStyles={styles.addFormContainer}
        isEditFlow={route?.params?.isEditFlow}
        isFromDues={isFromDues}
      />
    );
  };

  public renderUploadBoxComponent = (
    renderAttachements: () => React.ReactNode,
    uploadProps: IUploadCompProps
  ): ReactElement => {
    return <UploadBoxComponent {...uploadProps}>{renderAttachements()}</UploadBoxComponent>;
  };

  public onPressLink = (link: string): void => {
    LinkingService.canOpenURL(link).then();
  };

  private onClearPress = (): void => {
    const { clearForm } = this.state;
    this.setState({ clearForm: clearForm + 1 });
  };

  private onSubmitFormSuccess = (): void => {
    const { t, route } = this.props;
    if (route?.params?.isFromDues) {
      AlertHelper.success({ message: t('assetFinancial:dueMarkedAsPaid') });
    } else {
      AlertHelper.success({
        message: t(route?.params?.isEditFlow ? 'editedSuccessfullyMessage' : 'addedSuccessfullyMessage'),
      });
    }
    this.goBack();
  };

  private toggleLoading = (isLoading: boolean): void => {
    this.setState({ isLoading });
  };

  private goBack = (): void => {
    const { navigation } = this.props;

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
}

const mapStateToProps = (state: IState): IStateToProps => {
  return {
    currency: UserSelector.getCurrency(state),
    assets: UserSelector.getUserAssets(state),
    activeAsset: AssetSelectors.getUserActiveAssets(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.assetFinancial)(AddRecordScreen));

const styles = StyleSheet.create({
  addFormContainer: {
    marginTop: 24,
  },
  content: {
    marginHorizontal: 16,
  },
  clearText: {
    color: theme.colors.primaryColor,
  },
});
