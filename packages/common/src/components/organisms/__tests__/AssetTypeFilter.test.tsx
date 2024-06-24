import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetTypeFilter } from '@homzhub/common/src/components/organisms/AssetTypeFilter';
import { FilterData } from '@homzhub/common/src/mocks/FilterData';

let props: any;
let wrapper: ShallowWrapper;

describe.skip('AssetTypeFilter', () => {
  const createTestProps = (testProps: any): object => ({
    filterData: FilterData,
    asset_group: 1,
    asset_type: [1],
    updateAssetFilter: jest.fn(),
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<AssetTypeFilter {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call update filter', () => {
    wrapper = shallow(<AssetTypeFilter {...props} t={(key: string): string => key} />);
    // @ts-ignore
    wrapper.find('[testID="assetGroupSelection"]').prop('onValueChange')(1);
    expect(props.updateAssetFilter).toBeCalled();
  });

  it('should call onAssetGroupChecked', () => {
    wrapper = shallow(<AssetTypeFilter {...props} t={(key: string): string => key} />);
    // @ts-ignore
    wrapper.find('[testID="assetGroupCheck"]').prop('onToggle')(1, true);
    // @ts-ignore
    wrapper.find('[testID="assetGroupCheck"]').prop('onToggle')(1, false);
    expect(props.updateAssetFilter).toBeCalled();
  });
});
