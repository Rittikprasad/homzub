import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyListCard } from '@homzhub/mobile/src/components/organisms/PropertyListCard';
import { mockAsset } from '@homzhub/common/src/mocks/AssetDescription';

let props: any;
let wrapper: ShallowWrapper;

describe.skip('PropertyListCard', () => {
  const createTestProps = (testProps: any): object => ({
    property: mockAsset,
    onFavorite: jest.fn(),
    transaction_type: 1,
    onSelectedProperty: jest.fn(),
    isCarousel: true,
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<PropertyListCard {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for optional props', () => {
    props = createTestProps({
      transaction_type: 0,
    });
    wrapper = shallow(<PropertyListCard {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
