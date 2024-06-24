import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { theme } from '@homzhub/common/src/styles/theme';
import { GraphLegends } from '@homzhub/mobile/src/components/atoms/GraphLegends';

let props: any;

describe.skip('GraphLegends', () => {
  beforeEach(() => {
    props = {
      direction: 'row',
      data: [
        {
          key: 1,
          title: 'Some Title',
          value: 1000,
          svg: { fill: theme.colors.blueDonut },
        },
      ],
    };
  });

  it('should match snapshot', () => {
    const wrapper: ShallowWrapper = shallow(<GraphLegends {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for column direction', () => {
    props = {
      ...props,
      direction: 'column',
    };
    const wrapper: ShallowWrapper = shallow(<GraphLegends {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
