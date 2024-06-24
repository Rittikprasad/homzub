import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RentAndMaintenance } from '@homzhub/common/src/components/molecules/RentAndMaintenance';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { Transaction } from '@homzhub/common/src/domain/models/LeaseTransaction';

// @ts-ignore
const rentData: Transaction = {
  label: 'Rent',
  amount: 2700,
  status: 'Paid',
};

// @ts-ignore
const depositData: Transaction = {
  label: 'Deposit',
  amount: 5000,
  status: 'Due',
};

// @ts-ignore
const currency: Currency = {
  currencyName: 'INR',
  currencySymbol: '',
  currencyCode: '',
};

describe('Rent And Maintenance', () => {
  const props = {
    rentData,
    depositData,
    currency,
  };
  it('should match snapshot', () => {
    const wrapper = shallow(<RentAndMaintenance {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
