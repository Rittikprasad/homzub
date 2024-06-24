import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetMetricsList } from '@homzhub/mobile/src/components/organisms/AssetMetricsList';
import { AssetMetricsData } from '@homzhub/common/src/mocks/AssetMetrics';
import { Miscellaneous } from '@homzhub/common/src/domain/models/AssetMetrics';

let props: any;
let wrapper: ShallowWrapper;

describe.skip('AssetMetricsList', () => {
  const createTestProps = (testProps: any): object => ({
    data: ObjectMapper.deserializeArray(Miscellaneous, AssetMetricsData.asset_metrics.miscellaneous),
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<AssetMetricsList {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
