import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import PropertyCard from '@homzhub/ffm/src/components/molecules/PropertyCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Tabs } from '@homzhub/common/src/constants/Tabs';
import { DynamicLinkTypes, RouteTypes } from '@homzhub/mobile/src/services/constants';

interface IProps {
  isOnDashboard?: boolean;
}

const HotPropertiesTab = ({ isOnDashboard = false }: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const properties = useSelector(FFMSelector.getHotProperties);
  const [currentTab, setCurrentTab] = useState(Tabs.RENT);
  const [selectedAsset, setAsset] = useState<number>(0);
  const [isLoading, setLoader] = useState<boolean>(false);

  useEffect(() => {
    setAsset(0);
    dispatch(FFMActions.getHotProperties(currentTab));
  }, [currentTab]);

  const onPressProperty = (item: Asset): void => {
    const { leaseTerm, saleTerm } = item;
    const transactionType = leaseTerm ? 0 : 1;
    setLoader(true);
    CommonRepository.getDeepLink({
      action: 'MAIN',
      payload: {
        type: DynamicLinkTypes.AssetDescription,
        routeType: RouteTypes.Public,
        propertyTermId: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0,
        asset_transaction_type: transactionType,
      },
    })
      .then((res) => {
        setLoader(false);
        LinkingService.canOpenURL(res.deepLink).then();
      })
      .catch((e) => {
        setLoader(false);
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  const handleArrowTouch = (id: number): void => {
    if (id === selectedAsset) {
      setAsset(0);
    } else {
      setAsset(id);
    }
  };

  const renderProperties = ({ item }: { item: Asset }): React.ReactElement => {
    return (
      <PropertyCard
        asset={item}
        isExpanded={selectedAsset === item.id}
        onPressCard={(): void => onPressProperty(item)}
        handleArrowPress={handleArrowTouch}
      />
    );
  };

  return (
    <View style={styles.container}>
      <SelectionPicker
        data={[
          { title: Tabs.RENT, value: Tabs.RENT },
          { title: Tabs.SELL, value: Tabs.SELL },
        ]}
        selectedItem={[currentTab]}
        onValueChange={setCurrentTab}
        containerStyles={styles.picker}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        renderItem={renderProperties}
        data={isOnDashboard ? properties.slice(0, 2) : properties}
        keyExtractor={(item): string => `${item.id}`}
        style={styles.list}
      />
      <Loader visible={isLoading} />
    </View>
  );
};

export default HotPropertiesTab;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flex: 1,
  },
  picker: {
    backgroundColor: theme.colors.white,
  },
  list: {
    marginVertical: 10,
  },
});
