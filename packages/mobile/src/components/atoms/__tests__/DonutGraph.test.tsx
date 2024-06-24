import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { GeneralLedgersData } from '@homzhub/common/src/mocks/GeneralLedgers';
import { DonutGraph } from '@homzhub/mobile/src/components/atoms/DonutGraph';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';

let props: any;

describe('DonutGraph', () => {
  beforeEach(() => {
    props = {
      data: ObjectMapper.deserializeArray(GeneralLedgers, GeneralLedgersData),
    };
  });

  it('should match snapshot', () => {
    const wrapper: ShallowWrapper = shallow(<DonutGraph {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
