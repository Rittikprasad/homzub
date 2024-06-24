import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetSummary } from '@homzhub/mobile/src/components/molecules/AssetSummary';

describe('AssetSummary', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot', () => {
    const props = {
      notification: 10,
      serviceTickets: 10,
      dues: 10,
    };
    wrapper = shallow(<AssetSummary {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot without values', () => {
    const props = {};
    wrapper = shallow(<AssetSummary {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
