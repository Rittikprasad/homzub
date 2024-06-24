import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';

const createTestProps = (testProps: any): object => ({
  placeholder: 'Search',
  value: 'doc',
  updateValue: jest.fn(),
  ...testProps,
});
let props: any;

describe('Search Bar', () => {
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<SearchBar {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
