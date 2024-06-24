import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, IButtonProps } from '@homzhub/common/src/components/atoms/Button';
import { IPaymentParams, PaymentFailureResponse } from '@homzhub/common/src/domain/repositories/interfaces';
import { Payment } from '@homzhub/common/src/domain/models/Payment';

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

interface IProps extends IButtonProps {
  initiatePayment: () => Promise<Payment>;
  paymentApi: (paymentSuccessData: IPaymentParams) => void;
}

const PaymentGateway = (props: IProps): React.ReactElement => {
  const { initiatePayment, paymentApi } = props;

  const onPress = (): void => {
    initiatePayment()
      .then(onPayment)
      .catch((error) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(error.details), statusCode: error.details.statusCode });
      });
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const onPaymentClose = (payment_transaction_id: number, user_invoice_id: number, order_id: string): void => {
    paymentApi({
      error_code: PaymentFailureResponse.PAYMENT_CANCELLED,
      payment_transaction_id,
      user_invoice_id,
      razorpay_order_id: order_id,
    });
  };

  const onPayment = (paymentDetails: Payment): void => {
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
        handler: paymentApi,
        modal: {
          ondismiss: (): void => onPaymentClose(payment_transaction_id, user_invoice_id, order_id),
        },
        prefill: ObjectMapper.serialize(prefill),
        notes: ObjectMapper.serialize(notes),
      },
    };

    const RazorpayCheckout = new (window as any).Razorpay(options);

    RazorpayCheckout.open();
  };

  return (
    <>
      <Button {...props} onPress={onPress} containerStyle={styles.button} />
    </>
  );
};

export default PaymentGateway;

const styles = StyleSheet.create({
  button: {},
});
