import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MarkdownView } from '@homzhub/mobile/src/screens/Asset/MarkdownView';

describe('Markdown View', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        goBack: jest.fn(),
      },
      route: {
        params: {
          isFrom: '',
        },
      },
    };
  });

  it('should render snapshot', () => {
    component = shallow(<MarkdownView {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot when is from verification', () => {
    props = {
      ...props,
      route: {
        params: {
          isFrom: 'verification',
        },
      },
    };
    component = shallow(<MarkdownView {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should call goBack', () => {
    component = shallow(<MarkdownView {...props} t={(key: string): string => key} />);
    // @ts-ignore
    component.find('[testID="header"]').prop('onIconPress')();
    expect(props.navigation.goBack).toBeCalled();
  });
});
