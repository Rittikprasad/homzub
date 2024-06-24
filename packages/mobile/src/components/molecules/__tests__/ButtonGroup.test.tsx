import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ButtonGroup } from '@homzhub/mobile/src/components/molecules/ButtonGroup';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';

const mock = jest.fn();

describe('Button Group Component', () => {
  it('should render item group label', () => {
    const props = {
      data: PropertyAssetGroupData,
      onItemSelect: mock,
      selectedItem: 0,
    };
    // @ts-ignore
    const component = shallow(<ButtonGroup {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render item group text', () => {
    const props = {
      data: PropertyAssetGroupData,
      onItemSelect: mock,
      selectedItem: 0,
      textType: 'text',
    };
    // @ts-ignore
    const component = shallow(<ButtonGroup {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should handle item select event', () => {
    const props = {
      data: PropertyAssetGroupData,
      onItemSelect: mock,
      selectedItem: 0,
      textType: 'text',
    };
    // @ts-ignore
    const component = shallow(<ButtonGroup {...props} />);
    // @ts-ignore
    component.find('[testID="btngrp"]').at(1).prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });
});
