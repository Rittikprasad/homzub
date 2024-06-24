// @ts-noCheck
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { GoogleSearchBar } from '@homzhub/mobile/src/components/molecules/GoogleSearchBar';

let props: any;

describe('SearchBar', () => {
  const createTestProps = (testProps: any): object => ({
    placeholder: 'search',
    value: 'Kochi',
    updateValue: jest.fn(),
    ...testProps,
  });
  props = createTestProps({});
  it('should match snapshot', () => {
    const wrapper = shallow(<GoogleSearchBar {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should call onBlur function without prop', () => {
    const wrapper = shallow(<GoogleSearchBar {...props} t={(key: string): string => key} />);
    wrapper.find('[testID="textInput"]').simulate('blur');
    expect(wrapper.instance().state.showCancel).toBe(false);
  });
  it('should call onFocus function without prop', () => {
    const wrapper = shallow(<GoogleSearchBar {...props} t={(key: string): string => key} />);
    wrapper.find('[testID="textInput"]').simulate('focus');
    wrapper.find('[testID="btnCancel"]').simulate('press');
    expect(wrapper.instance().state.showCancel).toBe(true);
  });
  it('should call onBlur function', () => {
    props = createTestProps({
      onFocusChange: jest.fn(),
    });
    const wrapper = shallow(<GoogleSearchBar {...props} t={(key: string): string => key} />);
    wrapper.find('[testID="textInput"]').simulate('blur');
    expect(wrapper.instance().state.showCancel).toBe(false);
  });
  it('should call onFocus function', () => {
    props = createTestProps({
      onFocusChange: jest.fn(),
    });
    const wrapper = shallow(<GoogleSearchBar {...props} t={(key: string): string => key} />);
    wrapper.find('[testID="textInput"]').simulate('focus');
    expect(wrapper.instance().state.showCancel).toBe(true);
  });
  it('should call onSearch function ', () => {
    const wrapper = shallow(<GoogleSearchBar {...props} t={(key: string): string => key} />);
    wrapper.find('[testID="btnSearch"]').simulate('press');
  });
  it('should call onSearch function ', () => {
    const wrapper = shallow(<GoogleSearchBar {...props} t={(key: string): string => key} />);
    wrapper.find('[testID="btnCross"]').simulate('press');
  });
});
