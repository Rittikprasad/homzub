import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { WebViewScreen } from '@homzhub/mobile/src/screens/common/WebViewScreen';

const mock = jest.fn();

describe('Web View Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        goBack: mock,
      },
      route: {
        params: {
          url: '',
        },
      },
    };
    component = shallow(<WebViewScreen {...props} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
