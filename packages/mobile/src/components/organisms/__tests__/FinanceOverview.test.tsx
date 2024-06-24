import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FinanceOverview } from '@homzhub/mobile/src/components/organisms/FinanceOverview';

let wrapper: ShallowWrapper;
let props: any;

describe.skip('FinanceOverview', () => {
  wrapper = shallow(<FinanceOverview {...props} t={(key: string): string => key} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should update the tab', () => {
    // @ts-ignore
    wrapper.find('[testID="financeSelection"]').prop('onValueChange')(2);
    // @ts-ignore
    expect(wrapper.instance().state.currentTab).toBe(2);
  });
});
