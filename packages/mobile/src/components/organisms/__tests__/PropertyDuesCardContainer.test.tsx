import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyDuesCardContainer } from '@homzhub/mobile/src/components/organisms/PropertyDuesCardContainer';
import { propertyDues } from '@homzhub/common/src/mocks/FinancialsTabMockData';

let props: any;
let wrapper: ShallowWrapper;

describe('PropertyDuesCardContainer', () => {
  const createTestProps = (testProps: any): object => ({
    propertyDues: propertyDues.details,
    totalDue: 1200,
    currency: 'INR',
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<PropertyDuesCardContainer {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
