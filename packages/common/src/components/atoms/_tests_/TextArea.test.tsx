import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';

describe('Text Area', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot', () => {
    const props = {
      value: 'Message',
      label: 'Some label',
      placeholder: 'placeholder',
    };
    wrapper = shallow(<TextArea {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for optional', () => {
    const props = {
      value: 'Message',
      label: 'Some label',
      placeholder: 'placeholder',
    };
    wrapper = shallow(<TextArea {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
