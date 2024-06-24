import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetNeighbourhood } from '@homzhub/mobile/src/screens/Asset/Search/AssetNeighbourhood';
import { mockAsset } from '@homzhub/common/src/mocks/AssetDescription';

describe('AssetNeighbourhood', () => {
  let component: ShallowWrapper;
  let props: any;
  const mock = jest.fn();

  beforeEach(() => {
    props = {
      asset: mockAsset,
      navigation: {
        goBack: mock,
      },
    };
  });

  it('should render snapshot', () => {
    component = shallow(<AssetNeighbourhood {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
