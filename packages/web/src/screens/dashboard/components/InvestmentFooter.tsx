import React from 'react';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import SalePropertyFooter from '@homzhub/web/src/screens/dashboard/components/SalePropertyFooter';
import NewPropertyFooter from '@homzhub/web/src/screens/dashboard/components/NewPropertyFooter';
import ReadyPropertyFooter from '@homzhub/web/src/screens/dashboard/components/ReadyPropertyFooter';

// TODO (LAKSHIT) - change dummy data with actual api data
interface IProps {
  investmentData: Asset;
}

const InvestmentFooter = (props: IProps): React.ReactElement => {
  const { investmentData } = props;
  const { investmentStatus } = investmentData;
  switch (investmentStatus) {
    case 'New':
      return <NewPropertyFooter />;
    case 'Ready':
      return <ReadyPropertyFooter />;
    case 'Sale':
      return <SalePropertyFooter />;
    default:
      return <NewPropertyFooter />;
  }
};

export default InvestmentFooter;
