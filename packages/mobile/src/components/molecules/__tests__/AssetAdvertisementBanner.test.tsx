import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetAdvertisementBanner } from '@homzhub/mobile/src/components/molecules/AssetAdvertisementBanner';
import { AssetAdvertisementData } from '@homzhub/common/src/mocks/AssetMetrics';

describe('AssetAdvertisementBanner', () => {
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<AssetAdvertisementBanner />);
  });

  it('should match snapshot', () => {
    wrapper.setState({ banners: AssetAdvertisementData });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call function', () => {
    wrapper.setState({ banners: AssetAdvertisementData });
    // @ts-ignore
    wrapper.find('[testID="bannerSnap"]').prop('onSnapToItem')(1);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot without banners', () => {
    wrapper.setState({ banners: {} });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot with null banners', () => {
    wrapper.setState({ banners: null });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
