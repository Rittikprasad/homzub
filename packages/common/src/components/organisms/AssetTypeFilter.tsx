import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { remove } from 'lodash';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';

import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { SelectionPicker, ISelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { CheckboxGroup, ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';
import { FilterDetail } from '@homzhub/common/src/domain/models/FilterDetail';
import { Unit } from '@homzhub/common/src/domain/models/Unit';

interface IProps {
  filterData: FilterDetail;
  asset_group: number;
  asset_type: number[];
  updateAssetFilter: (type: string, value: number | number[]) => void;
  isDisabled?: boolean;
}

type Props = WithTranslation & IProps;

export class AssetTypeFilter extends React.PureComponent<Props> {
  public render = (): React.ReactNode => {
    const { t, asset_group, isDisabled = false } = this.props;
    return (
      <View>
        <Text type="small" textType="semiBold" style={styles.title}>
          {StringUtils.toTitleCase(t('property:propertyType'))}
        </Text>
        <SelectionPicker
          data={this.assetGroupsListPickerData()}
          selectedItem={[asset_group]}
          onValueChange={this.onAssetGroupListChanged}
          testID="assetGroupSelection"
          isDisabled={isDisabled}
          containerStyles={PlatformUtils.isWeb() && styles.containerStyle}
        />
        <CheckboxGroup
          data={this.assetGroupsTypesData()}
          onToggle={this.onAssetGroupChecked}
          labelStyle={styles.checkboxLabel}
          containerStyle={styles.checkboxGroupContainer}
          testID="assetGroupCheck"
          numOfColumns={2}
          isDisabled={isDisabled}
        />
      </View>
    );
  };

  private onAssetGroupListChanged = (selectedItem: number): void => {
    const { updateAssetFilter } = this.props;
    updateAssetFilter('asset_group', selectedItem);
    updateAssetFilter('asset_type', []);
  };

  private onAssetGroupChecked = (assetTypeId: number | string, isSelected: boolean): void => {
    const { updateAssetFilter, asset_type } = this.props;
    if (!isSelected) {
      remove(asset_type, (asset) => asset === assetTypeId);
      updateAssetFilter('asset_type', [...asset_type]);
    } else {
      updateAssetFilter('asset_type', [...asset_type, assetTypeId as number]);
    }
  };

  private assetGroupsListPickerData = (): ISelectionPicker<number>[] => {
    const {
      filterData: { assetGroupList },
    } = this.props;
    return assetGroupList.map((assetGroup: Unit) => ({
      title: assetGroup.title,
      value: assetGroup.id,
    }));
  };

  private assetGroupsTypesData = (): ICheckboxGroupData[] => {
    const {
      filterData: {
        filters: {
          assetGroup: { assetTypes },
        },
      },
      asset_type,
    } = this.props;
    return assetTypes.map((assetGroupType: Unit) => ({
      id: assetGroupType.id,
      label: assetGroupType.name,
      isSelected: asset_type.includes(assetGroupType.id),
    }));
  };
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.darkTint4,
    marginBottom: 16,
  },
  checkboxGroupContainer: {
    marginTop: 24,
  },
  checkboxLabel: {
    color: theme.colors.darkTint4,
  },
  containerStyle: {
    width: '90%',
  },
});

export default withTranslation()(AssetTypeFilter);
