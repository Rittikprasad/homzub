import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ContactPerson } from '@homzhub/common/src/components/molecules/ContactPerson';

const mock = jest.fn();
describe.skip('ContactPerson', () => {
  let wrapper: any;

  beforeEach(() => {
    const props = {
      fullName: 'John Doe',
      designation: 'CEO',
      phoneNumber: '9876543210',
      onContactTypeClicked: mock,
    };
    wrapper = shallow(<ContactPerson {...props} />);
  });

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call onContactTypeClicked', () => {
    [0, 1, 2].forEach((index: number) => {
      wrapper.find('[testID="to"]').at(index).prop('onPress')();
      expect(mock).toHaveBeenCalled();
    });
  });
});
