import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { DoubleBarGraph } from '@homzhub/mobile/src/components/atoms/DoubleBarGraph';

let props: any;

describe.skip('DoubleBarGraph', () => {
  beforeEach(() => {
    props = {
      data: {
        data1: [1, 2],
        data2: [3, 4],
        label: ['A', 'B'],
      },
    };
  });

  it('should match snapshot', () => {
    const wrapper: ShallowWrapper = shallow(<DoubleBarGraph {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
