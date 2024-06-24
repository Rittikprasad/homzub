import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import UserSubscriptionPlan from '@homzhub/common/src/components/molecules/UserSubscriptionPlan';
import { UserSubscription } from '@homzhub/common/src/domain/models/UserSubscription';
import { AssetSubscriptionData } from '@homzhub/common/src/mocks/AssetSubscriptionData';

const deserializedValue = ObjectMapper.deserialize(UserSubscription, AssetSubscriptionData);
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: (): any => {
    return {
      t: (str: string): string => str,
      i18n: {
        changeLanguage: (): any => new Promise(() => {}),
      },
    };
  },
}));

const createTestProps = (testProps: object): any => ({
  ...testProps,
});

const setHookState = (newState: any): any => jest.fn().mockImplementation(() => [newState, (): any => {}]);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const reactMock = require('react');

describe('AssetSubscriptionPlan', () => {
  let wrapper: any;
  beforeEach(() => {
    const props = createTestProps({
      onApiFailure: jest.fn(),
    });
    reactMock.useState = setHookState({
      data: deserializedValue,
      isMoreToggled: false,
    });
    jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());
    jest.spyOn(UserRepository, 'getUserSubscription').mockImplementation(() => Promise.resolve(deserializedValue));
    wrapper = shallow(<UserSubscriptionPlan {...props} />);
    console.debug(wrapper);
  });

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
