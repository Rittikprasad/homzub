import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { bindActionCreators, Dispatch } from 'redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src//utils/ErrorUtils';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/PortfolioStack';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { EditTenantDetails } from '@homzhub/mobile/src/components/molecules/EditTenantDetails';
import PropertyConfirmationView from '@homzhub/mobile/src/components/molecules/PropertyConfirmationView';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { NavigationScreenProps, ScreensKeys, UpdatePropertyFormTypes } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { TenantInfo } from '@homzhub/common/src/domain/models/TenantInfo';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IGetHistoryParam, IGetHistoryPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { ClosureReasonType, IUpdateTenantParam } from '@homzhub/common/src/domain/repositories/interfaces';

interface IStateProps {
  assetId: number;
  tenantsList: TenantInfo[];
}

interface IDispatchProps {
  getTenantHistory: (payload: IGetHistoryParam) => void;
}

interface IScreenProps {
  propertyData: Asset;
}

interface IScreenState {
  tenantsList: TenantInfo[];
  selectedTenant: TenantInfo;
  isLoading: boolean;
  isSheetVisible: boolean;
}

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.ManageTenantScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps & IScreenProps;

class ManageTenantsScreen extends Component<Props, IScreenState> {
  public state = {
    tenantsList: [],
    selectedTenant: {} as TenantInfo,
    isLoading: false,
    isSheetVisible: false,
  };

  public componentDidMount = (): void => {
    this.getTenantListData();
  };

  public render = (): React.ReactNode => {
    const { t } = this.props;
    const { isLoading } = this.state;
    return (
      <>
        <UserScreen
          scrollEnabled
          title={t('portfolio')}
          pageTitle={t('property:manageTenants')}
          backgroundColor={theme.colors.white}
          onBackPress={this.handleBackPress}
        >
          <View style={styles.container}>
            <Button
              type="primary"
              title={t('property:inviteTenant')}
              titleStyle={{ color: theme.colors.primaryColor }}
              activeOpacity={1}
              containerStyle={styles.inviteButton}
            />
            {this.renderTenants()}
          </View>
        </UserScreen>
        {this.renderBottomSheet()}
        <Loader visible={isLoading} />
      </>
    );
  };

  private renderTenants = (): React.ReactElement => {
    const { t } = this.props;
    const { tenantsList } = this.state;

    return (
      <View style={styles.content}>
        <Text textType="semiBold" type="small">
          {t('property:tenants')}
        </Text>
        {tenantsList.length > 0 ? (
          <FlatList
            data={tenantsList}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparatorComponent}
            keyExtractor={this.renderKeyExtractor}
          />
        ) : (
          <EmptyState containerStyle={styles.emptyState} title={t('property:noTenants')} />
        )}
      </View>
    );
  };

  private renderItem = ({ item }: { item: TenantInfo }): React.ReactElement => {
    const { t } = this.props;
    const { tenantUser, isInviteAccepted } = item;

    return (
      <Avatar
        designation={isInviteAccepted ? t('property:tenant') : t('common:invitationSent')}
        fullName={tenantUser?.fullName ?? ''}
        isRightIcon
        icon={!isInviteAccepted ? icons.circularCheckFilled : undefined}
        imageSize={40}
        rightIconName={isInviteAccepted ? icons.close : undefined}
        rightIconColor={isInviteAccepted ? theme.colors.error : theme.colors.green}
        onPressRightIcon={(): void => this.handleIconPress(item)}
        containerStyle={styles.avatar}
        customDesignation={isInviteAccepted ? undefined : styles.designation}
      />
    );
  };

  private renderBottomSheet = (): React.ReactElement | null => {
    const {
      t,
      route: {
        params: { assetDetail },
      },
    } = this.props;
    const { isSheetVisible, tenantsList, selectedTenant } = this.state;
    if (isEmpty(selectedTenant)) return null;
    const { isInviteAccepted, leaseTransaction, id } = selectedTenant;
    const { assetStatusInfo } = assetDetail;
    const isActive = assetStatusInfo && assetStatusInfo.action ? assetStatusInfo.action.label === 'TERMINATE' : false;
    return (
      <BottomSheet
        visible={isSheetVisible}
        headerTitle={isInviteAccepted ? t('property:removeTenant') : t('common:editInvite')}
        sheetHeight={theme.viewport.height * (isInviteAccepted ? 0.55 : 0.75)}
      >
        {!isInviteAccepted ? (
          <EditTenantDetails
            onHandleActionProp={this.navigateToTerminate}
            numberOfTenants={tenantsList.length}
            assetId={assetDetail.id}
            leaseTransaction={leaseTransaction?.id ?? 0}
            leaseTenantId={id}
            isActive={isActive}
            endDate={leaseTransaction?.leaseEndDate ?? ''}
            onCloseSheet={this.onCloseSheet}
            details={selectedTenant.tenantUser}
          />
        ) : (
          <PropertyConfirmationView
            user={selectedTenant.tenantUser}
            userRole={t('property:tenant')}
            description={t('property:leaseTerminated')}
            message={t('common:wantToContinue')}
            onCancel={this.onCloseSheet}
            onContinue={this.handleAction}
            secondaryButtonTitle={tenantsList.length > 1 ? t('common:remove') : undefined}
            secondaryButtonStyle={tenantsList.length > 1 ? styles.buttonContainer : undefined}
            secondaryTitleStyle={tenantsList.length > 1 ? styles.buttonTitle : undefined}
          />
        )}
      </BottomSheet>
    );
  };

  private renderSeparatorComponent = (): React.ReactElement => {
    return <Divider containerStyles={styles.divider} />;
  };

  private renderKeyExtractor = (item: TenantInfo, index: number): string => {
    return `${item.id}-${index}`;
  };

  private onCloseSheet = (): void => {
    this.setState({ isSheetVisible: false });
  };

  private onListCallback = (): void => {
    const { tenantsList } = this.props;
    if (tenantsList) {
      this.setState({ tenantsList, isLoading: false });
    }
  };

  private handleIconPress = (item: TenantInfo): void => {
    const {
      t,
      route: {
        params: { assetDetail },
      },
    } = this.props;
    const { leaseTransaction, isInviteAccepted } = item;
    const { assetStatusInfo } = assetDetail;
    const date = leaseTransaction?.leaseEndDate;
    const isActive = assetStatusInfo && assetStatusInfo.action ? assetStatusInfo.action.label === 'TERMINATE' : false;
    if (!isInviteAccepted || (isInviteAccepted && isActive)) {
      this.setState({
        selectedTenant: item,
        isSheetVisible: true,
      });
    } else {
      AlertHelper.error({ message: t('property:tenantRemoveDate', { date }) });
    }
  };

  private handleAction = async (): Promise<void> => {
    const {
      route: {
        params: { assetDetail },
      },
    } = this.props;
    const { tenantsList, selectedTenant } = this.state;
    this.setState({
      isSheetVisible: false,
    });
    if (tenantsList.length > 1) {
      const param: IUpdateTenantParam = {
        assetId: assetDetail.id,
        leaseTransactionId: selectedTenant.leaseTransaction?.id ?? 0,
        leaseTenantId: selectedTenant.id,
      };
      try {
        await AssetRepository.deleteTenant(param);
      } catch (err) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      }
    } else {
      this.navigateToTerminate();
    }
  };

  private navigateToTerminate = (): void => {
    const {
      navigation,
      route: {
        params: { assetDetail },
      },
    } = this.props;
    const { selectedTenant } = this.state;
    this.setState({
      isSheetVisible: false,
    });

    const { assetGroup, country } = assetDetail;

    navigation.navigate(ScreensKeys.UpdatePropertyScreen, {
      formType: UpdatePropertyFormTypes.TerminateListing,
      payload: {
        type: ClosureReasonType.LEASE_TRANSACTION_TERMINATION,
        asset_group: assetGroup.id,
        asset_country: country.id,
      },
      param: {
        id: selectedTenant.leaseTransaction?.id,
        endDate: selectedTenant.leaseTransaction?.leaseEndDate,
      },
      assetDetail,
    });
  };

  private handleBackPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private getTenantListData = (): void => {
    const {
      assetId,
      getTenantHistory,
      route: {
        params: {
          assetDetail: { assetStatusInfo },
        },
      },
    } = this.props;
    if (!assetStatusInfo) return;

    this.setState({ isLoading: true });
    const data: IGetHistoryPayload = {
      lease_transaction_id: assetStatusInfo.leaseTransaction.id,
      active: true,
    };
    getTenantHistory({ id: assetId, onCallback: this.onListCallback, data });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    assetId: PortfolioSelectors.getCurrentAssetId(state),
    tenantsList: PortfolioSelectors.getTenantHistory(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTenantHistory } = PortfolioActions;
  return bindActionCreators({ getTenantHistory }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(ManageTenantsScreen));

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  content: {
    marginTop: 24,
  },
  inviteButton: {
    backgroundColor: theme.colors.primaryOpacity,
    borderRadius: 4,
  },
  avatar: {
    marginTop: 10,
  },
  divider: {
    marginTop: 12,
    borderColor: theme.colors.darkTint10,
  },
  emptyState: {
    top: 20,
  },
  designation: {
    color: theme.colors.green,
  },
  buttonContainer: {
    borderColor: theme.colors.error,
  },
  buttonTitle: {
    color: theme.colors.error,
  },
});
