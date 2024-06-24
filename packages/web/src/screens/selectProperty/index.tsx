import React, { FC, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useHistory } from 'react-router';
import { PopupActions } from 'reactjs-popup/dist/types';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { ValueAddedServiceCardList } from '@homzhub/common/src/components/organisms/ValueAddedServiceCardList';
import OrderSummaryPopover from '@homzhub/web/src/components/organisms/OrderSummaryPopover';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IGetServicesByIds } from '@homzhub/common/src/domain/models/ValueAddedService';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { IBadgeInfo } from '@homzhub/mobile/src/navigation/interfaces';

interface ILocationProps {
  city: string;
}

const SelectProperty: FC = () => {
  const history = useHistory<ILocationProps>();
  const {
    location: {
      state: { city },
    },
  } = history;
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const navigateToService = (
    propertyIdArg: number,
    assetType: string,
    projectName = '',
    address = '',
    _flag: React.ReactElement,
    serviceByIds: IGetServicesByIds = { assetGroupId: 0, city: '', countryId: 0 },
    badgeInfo: IBadgeInfo = { color: '', title: '' },
    amenities: IAmenitiesIcons[] = [],
    attachments: Attachment[] = [],
    assetCount = 0,
    iso2Code = ''
  ): void => {
    // console.log('I was here', propertyId);
    setPropertyId(propertyIdArg);
  };

  const popupRef = useRef<PopupActions>(null);

  const onOpenModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  const onCloseModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };

  useEffect(() => {
    if (propertyId) {
      onOpenModal();
    }
  }, [propertyId]);

  return (
    <View style={styles.container}>
      <ValueAddedServiceCardList
        navigateToAddPropertyScreen={FunctionUtils.noop}
        navigateToService={navigateToService}
        selectedCity={city}
      />
      <OrderSummaryPopover
        popupRef={popupRef}
        onOpenModal={onOpenModal}
        onCloseModal={onCloseModal}
        propertyId={propertyId as number}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SelectProperty;
