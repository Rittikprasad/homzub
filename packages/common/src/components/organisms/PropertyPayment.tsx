import React, { Component } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { withMediaQuery, IWithMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PaymentRepository } from '@homzhub/common/src/domain/repositories/PaymentRepository';
import { RecordAssetRepository } from '@homzhub/common/src/domain/repositories/RecordAssetRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import HomzhubCoins from '@homzhub/common/src/components/molecules/HomzhubCoins';
import OrderSummary from '@homzhub/common/src/components/molecules/OrderSummary';
import PromoCode from '@homzhub/common/src/components/molecules/PromoCode';
import { PaymentGateway } from '@homzhub/mobile/src/components/molecules/PaymentGateway';
import PaymentGatewayWeb from '@homzhub/web/src/components/molecules/PaymentGateway';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { OrderSummary as Summary } from '@homzhub/common/src/domain/models/OrderSummary';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { ValueAddedService, ISelectedValueServices } from '@homzhub/common/src/domain/models/ValueAddedService';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import {
  DuePaymentActions,
  IOrderSummaryPayload,
  IPaymentParams,
  IUpdateAssetParams,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IReviewRefer } from '@homzhub/common/src/modules/common/interfaces';
import { IFinancialState, IProcessPaymentPayload } from '@homzhub/common/src/modules/financials/interfaces';

interface IPaymentProps {
  valueAddedServices: ValueAddedService[];
  setValueAddedServices: (payload: ISelectedValueServices) => void;
  propertyId?: number;
  handleNextStep: () => void;
  goBackToService?: () => void;
  typeOfPlan?: TypeOfPlan;
  lastVisitedStep?: ILastVisitedStep;
  isFromListing?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

interface IPaymentState {
  isCoinApplied: boolean;
  isPromoFailed: boolean;
  orderSummary: Summary;
  isLoading: boolean;
}

interface IStateProps {
  financialLoaders: IFinancialState['loaders'];
}

interface IDispatchProps {
  processPayment: (payload: IProcessPaymentPayload) => void;
  setReviewReferData: (payload: IReviewRefer) => void;
}

type Props = IPaymentProps & WithTranslation & IWithMediaQuery & IStateProps & IDispatchProps;

class PropertyPayment extends Component<Props, IPaymentState> {
  public state = {
    isCoinApplied: false,
    isPromoFailed: false,
    orderSummary: {} as Summary,
    isLoading: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getOrderSummary();
  };

  public async componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<IPaymentState>): Promise<void> {
    const { valueAddedServices, goBackToService } = this.props;
    if (isEqual(prevProps.valueAddedServices, valueAddedServices)) {
      return;
    }

    if (goBackToService && valueAddedServices.filter((service) => service.value).length === 0) {
      await this.getOrderSummary();
      goBackToService();
      return;
    }

    await this.getOrderSummary();
  }

  public render(): React.ReactNode {
    const { isCoinApplied, orderSummary, isPromoFailed, isLoading } = this.state;
    const { t, isTablet, financialLoaders, containerStyle } = this.props;

    if (PlatformUtils.isWeb() && orderSummary.amountPayable < 1) {
      return this.renderServices(true);
    }
    return (
      <View style={[styles.container, PlatformUtils.isWeb() && !isTablet && styles.containerWeb, containerStyle]}>
        {this.renderServices()}
        <HomzhubCoins
          disabled={
            orderSummary.coins ? orderSummary.coins?.currentBalance <= 0 || orderSummary.promo?.promoApplied : true
          }
          onToggle={this.onToggleCoin}
          selected={isCoinApplied}
          coins={orderSummary.coins}
          showCoinCount={false}
        />
        <PromoCode
          type="regular"
          onApplyPromo={this.applyPromo}
          isPromoApplied={orderSummary.promo?.promoApplied}
          isError={isPromoFailed}
          onClear={this.clearPromo}
          isToggleButtonDisabled={isCoinApplied}
        />
        <OrderSummary
          summaryList={orderSummary.summaryList}
          currency={orderSummary.currency}
          amountPayableText={orderSummary.amountPayableText}
        />
        {orderSummary.amountPayable > 0 &&
          (PlatformUtils.isWeb() ? (
            <PaymentGatewayWeb
              type="primary"
              title={t('assetFinancial:payNow')}
              containerStyle={styles.payButton}
              initiatePayment={this.initiatePayment}
              paymentApi={this.paymentApi}
            />
          ) : (
            <PaymentGateway
              type="primary"
              title={t('assetFinancial:payNow')}
              containerStyle={styles.payButton}
              initiatePayment={this.initiatePayment}
              paymentApi={this.paymentApi}
              isVerificationRequired
            />
          ))}
        <View style={styles.secureView}>
          <Icon name={icons.badge} color={theme.colors.darkTint7} size={28} />
          <Label type="large" textType="semiBold" style={styles.secureText}>
            {t('property:securePayment')}
          </Label>
        </View>
        <Loader visible={isLoading || financialLoaders.payment} />
      </View>
    );
  }

  private renderServices = (isEmpty?: boolean): React.ReactNode => {
    const { t, valueAddedServices, isTablet } = this.props;
    return (
      <View style={[styles.servicesContainer, isEmpty && styles.emptyView]}>
        <Text
          type="small"
          textType="semiBold"
          style={[styles.serviceTitle, PlatformUtils.isWeb() && !isTablet && isEmpty && styles.serviceTitleWeb]}
        >
          {t('property:services')}
        </Text>
        {isEmpty ? (
          <Text type="small" textType="semiBold" style={styles.serviceSubText}>
            {t('property:No Service Selected')}
          </Text>
        ) : (
          valueAddedServices.map((item) => {
            return this.renderItem(item);
          })
        )}
      </View>
    );
  };

  private renderItem = (item: ValueAddedService): React.ReactNode => {
    const { t, setValueAddedServices } = this.props;
    const removeService = (): void => setValueAddedServices({ id: item.id, value: false });

    if (!item.value) {
      return null;
    }
    const {
      price,
      currency: { currencySymbol },
      valueBundle: { label },
    } = item;

    return (
      <View key={`${item.id}`}>
        <View style={styles.serviceItem}>
          <View style={styles.content}>
            <Text type="small" textType="semiBold" style={styles.serviceName}>
              {label}
            </Text>
            <Text type="small" textType="semiBold" style={styles.serviceAmount}>
              {`${currencySymbol} ${price}`}
            </Text>
          </View>
          <TouchableOpacity onPress={removeService} style={styles.removeView}>
            <Icon name={icons.trash} color={theme.colors.blue} size={16} />
            <Label type="large" textType="semiBold" style={styles.removeText}>
              {t('common:remove')}
            </Label>
          </TouchableOpacity>
        </View>
        <Divider containerStyles={styles.divider} />
      </View>
    );
  };

  private onToggleCoin = (): void => {
    const {
      isCoinApplied,
      orderSummary: { coins },
    } = this.state;
    this.setState({ isCoinApplied: !isCoinApplied }, () => {
      // eslint-disable-next-line react/destructuring-assignment
      this.getOrderSummary({ coins: this.state.isCoinApplied ? coins.currentBalance : 0 }).then();
    });
  };

  private paymentApi = (paymentParams: IPaymentParams): void => {
    const {
      t,
      handleNextStep,
      lastVisitedStep,
      typeOfPlan,
      propertyId,
      processPayment,
      setReviewReferData,
      isFromListing = false,
    } = this.props;
    let payload;

    if (paymentParams.razorpay_payment_id) {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentParams;
      payload = {
        action: DuePaymentActions.PAYMENT_CAPTURED,
        payload: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
      };
    } else {
      // Payment cancelled
      const { razorpay_order_id } = paymentParams;
      payload = {
        action: DuePaymentActions.PAYMENT_CANCELLED,
        payload: { razorpay_order_id },
      };
    }

    const finalPayload: IProcessPaymentPayload = {
      data: payload,
      onCallback: async (status) => {
        if (status && paymentParams.razorpay_order_id) {
          if (lastVisitedStep && typeOfPlan && propertyId) {
            const updateAssetPayload: IUpdateAssetParams = {
              last_visited_step: {
                ...lastVisitedStep,
                listing: {
                  ...lastVisitedStep.listing,
                  type: typeOfPlan,
                  is_payment_done: true,
                },
              },
            };
            await AssetRepository.updateAsset(propertyId, updateAssetPayload);
            if (!isFromListing) {
              setReviewReferData({ message: t('property:paymentSuccessMsg'), isSheetVisible: true });
            }
            if (typeOfPlan === TypeOfPlan.MANAGE) {
              AnalyticsService.track(EventType.TenantInviteSent);
            }
          }
          handleNextStep();
        }
      },
    };
    processPayment(finalPayload);
  };

  private applyPromo = async (code: string): Promise<void> => {
    await this.getOrderSummary({ promo_code: code });
  };

  private clearPromo = (): void => {
    this.setState({ isPromoFailed: false });
  };

  private initiatePayment = (): Promise<Payment> => {
    const { propertyId } = this.props;
    return PaymentRepository.valueAddedServices({
      ...(this.getServiceIds().length > 0 && { value_added_services: this.getServiceIds() }),
      ...(propertyId && { asset: propertyId }),
    });
  };

  private getServiceIds = (): number[] => {
    const { valueAddedServices } = this.props;
    const selectedServices: number[] = [];

    valueAddedServices.forEach((service) => {
      if (service.value) {
        selectedServices.push(service.id);
      }
    });

    return selectedServices;
  };

  private getOrderSummary = async (data?: IOrderSummaryPayload): Promise<void> => {
    const { propertyId } = this.props;
    const { isPromoFailed } = this.state;
    const payload: IOrderSummaryPayload = {
      value_added_services: this.getServiceIds(),
      ...(propertyId && { asset: propertyId }),
      ...(data?.coins && data.coins > 0 && { coins: data.coins }),
      ...(data?.promo_code && { promo_code: data.promo_code }),
    };
    this.setState({ isLoading: true });

    try {
      const response = await RecordAssetRepository.getOrderSummary(payload);
      this.setState({ isLoading: false });
      this.setState({ orderSummary: response });
      if (isPromoFailed) {
        this.setState({ isPromoFailed: false });
      }
    } catch (e) {
      this.setState({ isLoading: false });
      if (data?.promo_code) {
        this.setState({ isPromoFailed: true });
      } else {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
      }
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getFinancialLoaders } = FinancialSelectors;
  return {
    financialLoaders: getFinancialLoaders(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { processPayment } = FinancialActions;
  const { setReviewReferData } = CommonActions;
  return bindActionCreators({ processPayment, setReviewReferData }, dispatch);
};

const HOC = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(PropertyPayment));
const propertyPayment = withMediaQuery<any>(HOC);
export { propertyPayment as PropertyPayment };

const styles = StyleSheet.create({
  container: {
    flex: PlatformUtils.isWeb() ? 1 : 0,
    backgroundColor: theme.colors.white,
    paddingVertical: 16,
    height: PlatformUtils.isWeb() ? 'max-content' : 'auto',
    marginHorizontal: 0,
  },
  containerWeb: {
    marginHorizontal: 0,
    marginLeft: 16,
  },
  payButton: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  secureView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    justifyContent: 'center',
  },
  serviceTitle: {
    color: theme.colors.darkTint4,
    marginTop: 16,
  },
  serviceTitleWeb: {
    marginLeft: 16,
  },
  serviceSubText: {
    alignItems: 'center',
    textAlign: 'center',
    color: theme.colors.darkTint7,
    marginTop: PlatformUtils.isWeb() ? 24 : 'auto',
  },
  secureText: {
    color: theme.colors.darkTint7,
    marginLeft: 6,
  },
  servicesContainer: {
    marginHorizontal: 16,
  },
  serviceItem: {
    marginVertical: 20,
  },
  serviceName: {
    color: theme.colors.darkTint2,
  },
  serviceAmount: {
    color: theme.colors.blue,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  removeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  removeText: {
    color: theme.colors.blue,
    marginLeft: 4,
  },
  divider: {
    borderColor: theme.colors.darkTint10,
  },
  emptyView: {
    backgroundColor: theme.colors.white,
    height: PlatformUtils.isWeb() ? 236 : '50%',
    width: PlatformUtils.isWeb() ? '25%' : 'auto',
    marginHorizontal: 0,
    marginLeft: 16,
  },
});
