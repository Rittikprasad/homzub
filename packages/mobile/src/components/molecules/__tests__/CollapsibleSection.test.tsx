import React from 'react';
import { View } from 'react-native';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { CollapsibleSection } from '@homzhub/mobile/src/components/molecules/CollapsibleSection';

let props: any;

describe('CollapsibleSection', () => {
  const createTestProps = (testProps: any): object => ({
    title: '',
    children: <View />,
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    const wrapper = shallow(<CollapsibleSection {...props}>{props.children}</CollapsibleSection>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot with press', () => {
    const wrapper = shallow(<CollapsibleSection {...props}>{props.children}</CollapsibleSection>);
    wrapper.find('[testID="collapse"]').simulate('press');
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
