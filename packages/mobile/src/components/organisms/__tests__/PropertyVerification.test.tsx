import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyVerification } from '@homzhub/mobile/src/components/organisms/PropertyVerification';
import { PropertyVerificationTypes } from '@homzhub/common/src/mocks/PropertyVerification';

let props: any;
let wrapper: ShallowWrapper;

describe('PropertyVerification', () => {
  const createTestProps = (testProps: any): object => ({
    navigateToPropertyHelper: jest.fn(),
    typeOfFlow: 'IDENTITY',
    updateStep: jest.fn(),
    propertyId: 1,
    setLoading: jest.fn(),
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<PropertyVerification {...props} t={(key: string): string => key} />);
    wrapper.setState({ verificationTypes: PropertyVerificationTypes });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
