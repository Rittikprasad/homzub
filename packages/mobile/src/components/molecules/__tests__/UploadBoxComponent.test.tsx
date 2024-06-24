import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { UploadBoxComponent } from '@homzhub/mobile/src/components/molecules/UploadBoxComponent';

const createTestProps = (testProps: any): object => ({
  header: 'Header',
  subHeader: 'subHeader',
  icon: 'left-arrow',
  onCapture: jest.fn(),
  onDelete: jest.fn(),
  ...testProps,
});
let props: any;

describe('UploadBoxComponent', () => {
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<UploadBoxComponent {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
