import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { TenantHistory } from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/TenantHistory';

describe('Tenant History Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      assetId: 1,
      tenantHistory: [],
      getTenantHistory: jest.fn(),
      route: {
        params: {
          isFromPortfolio: true,
        },
      },
      navigation: {
        navigate: jest.fn(),
      },
    };
    component = shallow(<TenantHistory {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
