import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle, View } from 'react-native';
import { useSelector } from 'react-redux';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';

interface IProps {
  header: string;
  colorCode: string;
  selectedAssetType?: string;
  value: string | number;
  isCurrency: boolean;
  cardStyle?: StyleProp<ViewStyle>;
  testID?: string;
  onPressMetrics?: () => void;
  maxLength?: number;
}

const AssetMetrics = (props: IProps): React.ReactElement => {
  const { header, value, cardStyle, testID, onPressMetrics, isCurrency, selectedAssetType, colorCode, maxLength } =
    props;

  const currency = useSelector(UserSelector.getCurrency);

  const handlePress = (): void => {
    if (onPressMetrics) {
      onPressMetrics();
    }
  };

  const renderItem = (): React.ReactElement => {
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.metricName} maxLength={maxLength}>
          {header}
        </Text>
        {isCurrency ? (
          <PricePerUnit
            textStyle={styles.metricName}
            currency={currency}
            priceTransformation={false}
            price={value as number}
          />
        ) : (
          <Text type="large" textType="semiBold" style={styles.metricName}>
            {value}
          </Text>
        )}
      </>
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} testID={testID}>
      <View
        style={[
          styles.container,
          cardStyle,
          { backgroundColor: colorCode },
          header === selectedAssetType && styles.selectedItem,
        ]}
      >
        {renderItem()}
      </View>
    </TouchableOpacity>
  );
};

const memoizedComponent = React.memo(AssetMetrics);
export { memoizedComponent as AssetMetrics };

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingVertical: 8,
    marginVertical: 12,
    marginStart: 12,
  },
  metricName: {
    textAlign: 'center',
    marginVertical: 4,
    color: theme.colors.white,
  },
  selectedItem: {
    borderWidth: 1.25,
    borderColor: theme.colors.white,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
});
