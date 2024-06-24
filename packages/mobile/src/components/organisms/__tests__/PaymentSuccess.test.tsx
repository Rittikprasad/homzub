import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PaymentSuccess } from '@homzhub/mobile/src/components/organisms/PaymentSuccess';

const mock = jest.fn();

describe('Payment Success Component', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    const props = {
      onClickLink: mock,
    };
    component = shallow(<PaymentSuccess {...props} />);
  });

  it('should render payment success component', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should call handle link', () => {
    // @ts-ignore
    component.find('[testID="txtPress"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });
});
