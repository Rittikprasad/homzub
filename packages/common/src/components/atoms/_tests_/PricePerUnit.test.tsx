import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { currencyCodes } from '@homzhub/common/src/mocks/CommonRepositoryMocks';

describe('PricePerUnit', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot', () => {
    const props = {
      price: 1000,
      currency: ObjectMapper.deserialize(Currency, currencyCodes[0]),
    };
    wrapper = shallow(<PricePerUnit {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with unit', () => {
    const props = {
      price: 1000,
      currency: ObjectMapper.deserialize(Currency, currencyCodes[0]),
      unit: 'mo',
    };
    wrapper = shallow(<PricePerUnit {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with currency other than INR', () => {
    const props = {
      price: 1000,
      currency: ObjectMapper.deserialize(Currency, currencyCodes[0]),
      unit: 'mo',
    };
    wrapper = shallow(<PricePerUnit {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with priceTransformation', () => {
    const props = {
      price: 1000,
      currency: ObjectMapper.deserialize(Currency, currencyCodes[0]),
      unit: 'mo',
      priceTransformation: true,
    };
    wrapper = shallow(<PricePerUnit {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with priceTransformation false', () => {
    const props = {
      price: 1000,
      currency: ObjectMapper.deserialize(Currency, currencyCodes[0]),
      unit: 'mo',
      priceTransformation: false,
    };
    wrapper = shallow(<PricePerUnit {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
