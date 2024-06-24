import React, { PureComponent } from 'react';
// import { StyleSheet, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
// import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
// import { theme } from '@homzhub/common/src/styles/theme';
// import Coin from '@homzhub/common/src/assets/images/coin.svg';
// import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
// import { RNSwitch } from '@homzhub/common/src/components/atoms/Switch';
// import { Coins } from '@homzhub/common/src/domain/models/OrderSummary';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IOwnProps {
  // onToggle: () => void;
  // selected: boolean;
  // coins: Coins;
  // disabled?: boolean;
  // hasBalanceInNewLine?: boolean;
  // containerStyle?: ViewStyle;
  // showCoinCount: boolean;
}

type Props = IOwnProps & WithTranslation;

class HomzhubCoins extends PureComponent<Props> {
  public render(): React.ReactNode {
    // const {
    //   t,
    //   onToggle,
    //   selected,
    //   coins,
    //   disabled,
    //   hasBalanceInNewLine = false,
    //   containerStyle,
    //   showCoinCount,
    // } = this.props;
    // const amount = `₹${coins?.savedAmount ?? 0}`;
    // const coinUsed = coins?.coinsUsed ?? 0;

    // const ShowCoinIcon = ({ iconStyle = styles.image }: { iconStyle?: ViewStyle }): React.ReactElement => {
    //   return PlatformUtils.isWeb() ? <Coin /> : <Coin style={iconStyle} />;
    // };

    return (
      <>
        {/* <View style={[styles.container, containerStyle && containerStyle]}> */}
        {/* <View style={styles.switchView}>
          <View style={styles.coinBalanceContainer}>
            {hasBalanceInNewLine && <ShowCoinIcon iconStyle={styles.inlineCoin} />}
            <Text type="small" textType="semiBold" style={[styles.title, disabled && styles.disabled]}>
              {showCoinCount ? t('useFromCoinsWithCount', { count: coins.currentBalance }) : t('useCoins')}
            </Text>
          </View>
          <RNSwitch disabled={disabled} selected={selected} onToggle={onToggle} />
        </View> */}
        {/* {!hasBalanceInNewLine && (
          <View style={styles.balanceView}>
            <Text type="small" style={[styles.title, disabled && styles.disabled]}>
              {t('balance')}
            </Text>
            <ShowCoinIcon />
            <Text type="small" style={[styles.title, disabled && styles.disabled]}>
              {coins?.currentBalance ?? 0}
            </Text>
          </View>
        )} */}
        {/* {selected && (
          <Label type="regular" textType="semiBold" style={styles.message}>
            {t('property:usedCoins', { amount, coin: coinUsed })}
          </Label>
        )} */}
        {/* </View> */}
      </>
    );
  }
}

export default withTranslation(LocaleConstants.namespacesKey.property)(HomzhubCoins);

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: theme.colors.moreSeparator,
//     padding: 16,
//   },
//   title: {
//     color: theme.colors.darkTint3,
//   },
//   disabled: {
//     color: theme.colors.disabled,
//   },
//   message: {
//     marginTop: 12,
//     color: theme.colors.green,
//   },
//   switchView: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   balanceView: {
//     flexDirection: 'row',
//     marginTop: 8,
//     alignItems: 'center',
//   },
//   image: {
//     marginHorizontal: 6,
//   },
//   inlineCoin: {
//     marginEnd: 8,
//   },
//   coinBalanceContainer: {
//     flex: 1,
//     flexDirection: 'row',
//   },
// });
