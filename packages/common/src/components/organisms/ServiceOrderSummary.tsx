import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';
import InvoiceSummary from '@homzhub/common/src/components/molecules/InvoiceSummary';
import HomzhubCoins from '@homzhub/common/src/components/molecules/HomzhubCoins';
import OrderSummary from '@homzhub/common/src/components/molecules/OrderSummary';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import PromoCode from '@homzhub/common/src/components/molecules/PromoCode';
import { PaymentGateway } from '@homzhub/mobile/src/components/molecules/PaymentGateway';
import PaymentGatewayWeb from '@homzhub/web/src/components/molecules/PaymentGateway';
import { DueOrderSummaryAction } from '@homzhub/common/src/domain/models/DueOrderSummary';
import { Coins } from '@homzhub/common/src/domain/models/OrderSummary';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { IProcessPaymentPayload } from '@homzhub/common/src/modules/financials/interfaces';
import {
  DuePaymentActions,
  IDueOrderSummaryAction,
  IPaymentParams,
  IPaymentPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  onSuccess: () => void;
  invoiceId?: number;
  isLabelRequired?: boolean;
}

const ServiceOrderSummary = ({ invoiceId, onSuccess, isLabelRequired = false }: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const invoice = useSelector(PropertyPaymentSelector.getUserInvoice);
  const orderSummary = useSelector(FinancialSelectors.getDueOrderSummary);

  const [areCoinsApplied, setAreCoinsApplied] = useState(false);
  const [isPromoSelected, setIsPromoSelected] = useState(false);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isPromoFailed, setIsPromoFailed] = useState(false);
  const id = invoiceId || invoice.userInvoiceId;

  useEffect(() => {
    getSummary();
  }, []);

  const getSummary = (onCallback?: (status: boolean) => void): void => {
    if (id) {
      dispatch(FinancialActions.getDueOderSummary({ id, onCallback }));
    }
  };

  const handleAction = (payload: IDueOrderSummaryAction, fromCoins?: boolean): void => {
    const onCallback = (status: boolean): void => {
      if (status) {
        if (isPromoSelected) {
          setIsPromoApplied(true);
        }
        if (isPromoFailed) {
          setIsPromoFailed(false);
        }
        if (fromCoins) {
          setAreCoinsApplied(true);
        }
      } else if (isPromoSelected) {
        setIsPromoFailed(true);
      }
    };
    if (id) {
      dispatch(FinancialActions.updateOderSummary({ id, payload, onCallback }));
    }
  };

  const handleCoins = (): void => {
    const payload: IDueOrderSummaryAction = {
      action: DueOrderSummaryAction.REFRESH_INVOICE_AMOUNT,
      coins: orderSummary?.coins?.currentBalance,
    };
    handleAction(payload, true);
  };

  const handlePromo = (code: string): void => {
    const payload: IDueOrderSummaryAction = {
      action: DueOrderSummaryAction.REFRESH_INVOICE_AMOUNT,
      promo_code: code,
    };
    handleAction(payload);
  };

  const resetStates = (): void => {
    setAreCoinsApplied(false);
    setIsPromoApplied(false);
    setIsPromoFailed(false);
    setIsPromoSelected(false);
  };

  const initiatePayment = async (): Promise<Payment | null> => {
    const payload: IDueOrderSummaryAction = {
      action: DueOrderSummaryAction.TRIGGER_PAYMENT,
      ...(isPromoApplied && { promo_code: orderSummary?.promo?.code }),
      ...(areCoinsApplied && { coins: orderSummary?.coins?.coinsUsed }),
    };

    if (id) {
      try {
        const response = await LedgerRepository.dueOrderSummaryAction(id, payload);
        return response.order;
      } catch (e) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details.message), statusCode: e.details.statusCode });
        return null;
      }
    }

    return null;
  };

  const onOrderPlaced = (paymentParams: IPaymentParams): void => {
    const getBody = (): IPaymentPayload => {
      // Payment successful
      if (paymentParams.razorpay_payment_id) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentParams;
        return {
          action: DuePaymentActions.PAYMENT_CAPTURED,
          payload: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
        };
      }
      // Payment cancelled
      const { razorpay_order_id } = paymentParams;
      return {
        action: DuePaymentActions.PAYMENT_CANCELLED,
        payload: { razorpay_order_id },
      };
    };

    const payload: IProcessPaymentPayload = {
      data: getBody(),
      onCallback: (status) => {
        if (status && paymentParams.razorpay_payment_id) {
          onSuccess();
          resetStates();
          AlertHelper.success({
            message: t('assetFinancial:paidSuccessfully', { amount: orderSummary?.totalPriceFormatted }),
          });
        }
      },
    };

    dispatch(FinancialActions.processPayment(payload));
  };

  const onToggleCoins = (): void => {
    // Unselecting the coins -> Call GET again
    if (areCoinsApplied && id) {
      const handleCallback = (status: boolean): void => {
        if (status) {
          setAreCoinsApplied(false);
        }
      };
      getSummary(handleCallback);
      return;
    }
    if (orderSummary && orderSummary.coins && orderSummary.coins.currentBalance > 0) {
      handleCoins();
    }
  };

  const onTogglePromoCode = (): void => {
    if (isPromoSelected) {
      if (isPromoApplied) {
        getSummary();
        setIsPromoApplied(false);
      }
      setIsPromoFailed(false);
    }
    setIsPromoSelected((initValue) => !initValue);
  };

  const onApplyPromo = (code: string): void => {
    // Call API with applied promo.
    if (code.length) {
      handlePromo(code);
      return;
    }
    // For empty promo, refresh the data.
    onClearPromo();
  };

  const onClearPromo = (): void => {
    setIsPromoFailed(false);
    setIsPromoApplied(false);
    getSummary();
  };

  if (!orderSummary) return <EmptyState />;

  const {
    asset,
    dueTitle,
    coins,
    dueOrderSummaryList,
    totalPricePayableFormatted,
    currency,
    invoiceTitle,
    countryFlag,
  } = orderSummary;

  const primaryAddressStyles: ITypographyProps = {
    variant: 'text',
    size: 'small',
  };

  const subAddressStyles: ITypographyProps = {
    size: 'regular',
    variant: 'label',
  };

  return (
    <>
      <View style={styles.containerPadding}>
        {isLabelRequired && (
          <Text type="small" textType="regular" style={styles.orderSummaryText}>
            {t('property:orderSummary')}
          </Text>
        )}
        <PropertyAddressCountry
          primaryAddress={asset ? asset.projectName : dueTitle}
          primaryAddressTextStyles={primaryAddressStyles}
          subAddress={asset ? asset.formattedAddressWithCity : invoiceTitle}
          subAddressTextStyles={subAddressStyles}
          containerStyle={styles.addressContainer}
          countryFlag={countryFlag}
        />
        {orderSummary && <InvoiceSummary summary={orderSummary} />}
      </View>
      {orderSummary.isCoinsAllowed && (
        <HomzhubCoins
          onToggle={onToggleCoins}
          disabled={isPromoSelected || Boolean(coins && coins.currentBalance <= 0)}
          selected={areCoinsApplied}
          coins={coins ?? new Coins()}
          hasBalanceInNewLine
          containerStyle={styles.coinsContainer}
          showCoinCount={Boolean(coins && coins.currentBalance > 0)}
        />
      )}
      <View style={styles.containerPadding}>
        {orderSummary.isPromoCodeAllowed && (
          <PromoCode
            type="regular"
            onApplyPromo={onApplyPromo}
            isPromoApplied={isPromoApplied}
            isError={isPromoFailed}
            onClear={onClearPromo}
            hasToggleButton
            isToggleButtonSelected={isPromoSelected}
            onToggle={onTogglePromoCode}
            containerStyles={styles.promoContainer}
            isToggleButtonDisabled={areCoinsApplied}
          />
        )}
        <OrderSummary
          summaryList={dueOrderSummaryList}
          amountPayableText={totalPricePayableFormatted}
          currency={currency}
          containerStyle={styles.orderSummaryContainer}
          showOrderSummaryHeader={false}
          hasDottedDivider
        />
        {orderSummary.totalPricePayable > 0 &&
          (PlatformUtils.isWeb() ? (
            <PaymentGatewayWeb
              type="primary"
              title={t('assetFinancial:payNow')}
              containerStyle={styles.payButton}
              // @ts-ignore
              initiatePayment={initiatePayment}
              paymentApi={onOrderPlaced}
            />
          ) : (
            <PaymentGateway
              type="primary"
              title={t('assetFinancial:payNow')}
              containerStyle={styles.payButton}
              // @ts-ignore
              initiatePayment={initiatePayment}
              paymentApi={onOrderPlaced}
              isVerificationRequired
            />
          ))}
        <View style={styles.secureView}>
          <Icon name={icons.badge} color={theme.colors.darkTint7} size={28} />
          <Label type="large" textType="semiBold" style={styles.secureText}>
            {t('property:securePayment')}
          </Label>
        </View>
      </View>
    </>
  );
};

export default ServiceOrderSummary;

const styles = StyleSheet.create({
  addressContainer: {
    marginTop: 14,
    marginBottom: 10,
  },
  coinsContainer: {
    backgroundColor: theme.colors.moreSeparator,
    paddingHorizontal: 16,
  },
  orderSummaryContainer: {
    marginHorizontal: 0,
  },
  orderSummaryText: {
    color: theme.colors.darkTint4,
  },
  topSummaryContainer: {
    marginBottom: 10,
  },
  promoContainer: {
    marginHorizontal: 0,
  },
  payButton: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  secureView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
  },
  secureText: {
    color: theme.colors.darkTint7,
    marginLeft: 6,
  },
  containerPadding: {
    paddingHorizontal: 16,
  },
});
