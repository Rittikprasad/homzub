import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { More } from '@homzhub/mobile/src/screens/Asset/More';

describe('Financials Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        goBack: jest.fn(),
      },
      logout: jest.fn(),
    };
    component = shallow(<More {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
