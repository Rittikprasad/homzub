import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Progress } from '@homzhub/common/src/components/atoms/Progress/Progress';

let props: any;

describe('ProgressBar', () => {
  beforeEach(() => {
    props = {
      progress: 50,
    };
  });

  it('should match snapshot', () => {
    const wrapper: ShallowWrapper = shallow(<Progress {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
