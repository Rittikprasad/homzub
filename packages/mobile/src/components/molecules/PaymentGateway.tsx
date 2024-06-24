import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, IButtonProps } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { IPaymentParams, PaymentFailureResponse } from '@homzhub/common/src/domain/repositories/interfaces';

let options = {
  image: '',
  key: ConfigHelper.getRazorApiKey(),
  theme: { color: theme.colors.primaryColor },
  method: {
    netbanking: true,
    card: true,
    upi: true,
    wallet: true,
  },
};

interface IRazorPayError {
  code: number;
  description: string;
  error?: {
    description: string;
  };
  razorpay_order_id?: string;
}

interface IProps extends IButtonProps {
  initiatePayment: () => Promise<Payment>;
  paymentApi: (paymentSuccessData: IPaymentParams) => void;
  outerContainerStyle?: StyleProp<ViewStyle>;
  isVerificationRequired?: boolean;
}

interface IOwnState {
  loading: boolean;
  isCheckboxSelected: boolean;
}

export class PaymentGateway extends React.PureComponent<IProps, IOwnState> {
  public state = {
    loading: false,
    isCheckboxSelected: false,
  };

  public render = (): React.ReactElement => {
    const { loading, isCheckboxSelected } = this.state;
    const { outerContainerStyle = {}, isVerificationRequired = false, disabled } = this.props;
    return (
      <>
        {isVerificationRequired && (
          <RNCheckbox
            label={I18nService.t('common:agreeToHomzhub')}
            labelType="regular"
            subLabel={I18nService.t('moreSettings:termsConditionsText')}
            selected={isCheckboxSelected}
            onToggle={this.onToggleCheckbox}
            onPressLink={NavigationService.navigateToTermsCondition}
            labelStyle={styles.checkboxLabel}
            containerStyle={styles.checkboxContainer}
          />
        )}
        {/* @ts-ignore */}
        <Button
          {...this.props}
          onPress={this.onPress}
          disabled={(isVerificationRequired && !isCheckboxSelected) || disabled}
          containerStyle={[styles.button, outerContainerStyle]}
        />
        <Loader visible={loading} />
      </>
    );
  };

  private onToggleCheckbox = (): void => {
    const { isCheckboxSelected } = this.state;
    this.setState({ isCheckboxSelected: !isCheckboxSelected });
  };

  private onPress = (): void => {
    const { initiatePayment } = this.props;

    this.setState({ loading: true });
    initiatePayment()
      .then(this.onPayment)
      .catch((e) => {
        this.setState({ loading: false });
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  private onPayment = (paymentDetails: Payment): void => {
    const { paymentApi } = this.props;
    const {
      description,
      name,
      currency,
      amount,
      prefill,
      notes,
      orderId: order_id,
      paymentTransactionId: payment_transaction_id,
      userInvoiceId: user_invoice_id,
    } = paymentDetails;

    options = {
      ...options,
      ...{
        name,
        description,
        currency,
        amount,
        order_id,
        prefill: ObjectMapper.serialize(prefill),
        notes: ObjectMapper.serialize(notes),
      },
    };

    this.setState({ loading: false });
    RazorpayCheckout.open(options)
      .then(paymentApi)
      .catch((error: IRazorPayError) => {
        // paymentApi({
        //   error_code: this.getErrorResponse(error.code),
        //   payment_transaction_id,
        //   user_invoice_id,
        //   razorpay_order_id: order_id,
        // });

        if (this.getErrorResponse(error.code) === PaymentFailureResponse.PAYMENT_CANCELLED) {
          if (error.error) {
            AlertHelper.error({ message: error.error.description });
          } else {
            AlertHelper.error({ message: error.description });
          }
        } else {
          AlertHelper.error({ message: JSON.parse(error.description).description });
        }
      });
  };

  // eslint-disable-next-line consistent-return
  private getErrorResponse = (errorCode: number): PaymentFailureResponse | undefined => {
    if ((PlatformUtils.isAndroid() && errorCode === 0) || (PlatformUtils.isIOS() && errorCode === 2)) {
      return PaymentFailureResponse.PAYMENT_CANCELLED;
    }
  };
}

const styles = StyleSheet.create({
  button: {
    flex: 0,
    marginHorizontal: 16,
  },
  checkboxLabel: {
    color: theme.colors.darkTint3,
  },
  checkboxContainer: {
    marginVertical: 16,
    marginHorizontal: 16,
  },
});
