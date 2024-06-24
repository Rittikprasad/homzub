import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetMetrics } from '@homzhub/mobile/src/components/molecules/AssetMetrics';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe.skip('AssetMetrics', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot', () => {
    const props = {
      header: 'header',
      value: 'value',
      angle: 180,
      currency: 'INR',
      location: [0, 1],
      showPlusIcon: true,
      colorCode: theme.colors.white,
      isCurrency: true,
    };
    wrapper = shallow(<AssetMetrics {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for show plus icon', () => {
    const props = {
      header: 'header',
      value: 'value',
      angle: 180,
      currency: 'INR',
      location: [0, 1],
      showPlusIcon: true,
      colorCode: theme.colors.white,
      isCurrency: true,
    };
    wrapper = shallow(<AssetMetrics {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for currency', () => {
    const props = {
      header: 'header',
      value: 'value',
      angle: 180,
      currency: 'INR',
      location: [0, 1],
      showPlusIcon: true,
      colorCode: theme.colors.white,
      isCurrency: true,
    };
    wrapper = shallow(<AssetMetrics {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
