import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { DefaultLogin } from '@homzhub/mobile/src/screens/Asset/DefaultLogin';

describe('Default Login Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        dispatch: jest.fn(),
      },
    };
    component = shallow(<DefaultLogin {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
