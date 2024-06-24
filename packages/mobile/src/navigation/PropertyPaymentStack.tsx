import React from 'react';
import PropertyList from '@homzhub/mobile/src/screens/Asset/Financials/PropertyPayment/PropertyList';
import PaymentServices from '@homzhub/mobile/src/screens/Asset/Financials/PropertyPayment/PaymentServices';
import SocietyController from '@homzhub/mobile/src/screens/Asset/Financials/PropertyPayment/SocietyController';
import SocietyOrderSummary from '@homzhub/mobile/src/screens/Asset/Financials/PropertyPayment/SocietyController/SocietyOrderSummary';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

export type PropertyPaymentList = {
  [ScreensKeys.PropertyPayment]: undefined;
  [ScreensKeys.PaymentServices]: undefined | { isFromSummary: boolean };
  [ScreensKeys.SocietyController]: undefined | { fromReminder: boolean };
  [ScreensKeys.SocietyOrderSummary]: undefined;
};

export const getPropertyPaymentScreen = (Stack: any): React.ReactElement => {
  return (
    <>
      <Stack.Screen name={ScreensKeys.PropertyPayment} component={PropertyList} />
      <Stack.Screen name={ScreensKeys.PaymentServices} component={PaymentServices} />
      <Stack.Screen name={ScreensKeys.SocietyController} component={SocietyController} />
      <Stack.Screen name={ScreensKeys.SocietyOrderSummary} component={SocietyOrderSummary} />
    </>
  );
};
