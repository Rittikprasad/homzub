import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetMarketTrends } from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';

let props: any;

describe('AssetMarketTrends', () => {
  const createTestProps = (testProps: any): object => ({
    onViewAll: jest.fn(),
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot with empty results', () => {
    const mockData = {
      count: 0,
      links: {
        next: '',
        previous: '',
      },
      results: [],
    };
    const wrapper = shallow(<AssetMarketTrends {...props} t={(key: string): string => key} />);
    wrapper.setState({ data: mockData });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot with results', () => {
    const mockData = {
      count: 0,
      links: {
        next: '',
        previous: '',
      },
      results: [
        {
          id: 0,
          title: '',
          posted_at: '',
          link: '',
        },
      ],
    };
    const wrapper = shallow(<AssetMarketTrends {...props} t={(key: string): string => key} />);
    wrapper.setState({ data: mockData });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
