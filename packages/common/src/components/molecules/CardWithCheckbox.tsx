import React, { ReactElement } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Image, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { ServiceBundleItems } from '@homzhub/common/src/domain/models/ServiceBundleItems';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IOwnProps extends WithTranslation {
  heading: string;
  image: string;
  price: number;
  discountedPrice: number;
  bundleItems: ServiceBundleItems[];
  selected: boolean;
  onToggle: (value: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  currency: Currency;
  isMobile?: boolean;
  priceLabel?: string;
}

interface IOwnState {
  showMore: boolean;
}

export class CardWithCheckbox extends React.PureComponent<IOwnProps, IOwnState> {
  public state = {
    showMore: false,
  };

  public render = (): React.ReactElement => {
    const { t, heading, image, containerStyle, selected, isMobile, bundleItems } = this.props;
    const { showMore } = this.state;
    const {
      colors: { moreSeparator, white },
    } = theme;
    const backgroundColor = selected ? moreSeparator : white;
    return (
      <View style={[styles.container, containerStyle]}>
        <TouchableOpacity onPress={PlatformUtils.isWeb() ? this.onToggle : FunctionUtils.noop} activeOpacity={1}>
          <View style={[{ backgroundColor }, styles.padding]}>
            <View style={[styles.rowStyle, styles.paddingStyle]}>
              {PlatformUtils.isMobile() ? (
                <SVGUri uri={image} width={40} height={40} />
              ) : (
                <Image source={{ uri: image }} style={styles.image} />
              )}
              <View style={styles.content}>
                <View style={styles.headingStyle}>
                  <Label
                    type="large"
                    textType="semiBold"
                    numberOfLines={3}
                    style={[styles.textStyle, PlatformUtils.isWeb() && isMobile && styles.mobileContainer]}
                  >
                    {heading}
                  </Label>
                  {PlatformUtils.isMobile() && <RNCheckbox selected={selected} onToggle={this.onToggle} />}
                </View>
              </View>
              {PlatformUtils.isWeb() && (
                <View style={styles.checkBoxWeb}>
                  <RNCheckbox selected={selected} onToggle={this.onToggle} />
                </View>
              )}
            </View>
            {this.renderFeesView()}
            {showMore && this.renderMoreContent()}
          </View>
        </TouchableOpacity>

        {bundleItems.length > 0 && (
          <Button
            type="secondary"
            textType="label"
            textSize="regular"
            title={showMore ? t('showLess') : t('showMore')}
            onPress={this.toggleSubsection}
            containerStyle={styles.moreBtn}
            titleStyle={styles.moreTextStyle}
          />
        )}
      </View>
    );
  };

  private renderFeesView = (): ReactElement => {
    const { t, priceLabel, price, discountedPrice, currency } = this.props;
    const label = !!priceLabel && priceLabel.split('or');
    const amount = `${currency.currencySymbol} ${price}`;
    return (
      <View style={styles.feeContainer}>
        <Label type="regular" style={styles.label}>
          {t('totalServiceFee')}
        </Label>
        {label && (
          <View style={styles.feeContent}>
            <View>
              <Text type="regular" style={styles.mainLabel}>
                {label[0]}
              </Text>
              {label[1] && (
                <Label type="regular" style={styles.subLabel}>
                  {t('orValue', { value: label[1] })}
                </Label>
              )}
            </View>
            <View style={styles.tokenValue}>
              <Label type="regular" style={styles.token}>
                {t('tokenAmount', { amount })}
              </Label>
            </View>
          </View>
        )}
        {!label && (
          <View style={styles.rowStyle}>
            <PricePerUnit
              price={discountedPrice || price}
              currency={currency}
              textSizeType="small"
              textStyle={[styles.price, styles.marginRight]}
            />
            {discountedPrice > 0 && (
              <PricePerUnit
                price={price}
                currency={currency}
                textSizeType="regular"
                textFieldType="label"
                textStyle={styles.originalPrice}
              />
            )}
          </View>
        )}
      </View>
    );
  };

  private renderMoreContent = (): ReactElement => {
    const { bundleItems } = this.props;
    return (
      <>
        <Divider containerStyles={styles.dividerStyles} />
        {bundleItems.map((item) => {
          return (
            <View key={item.id} style={[styles.rowStyle, styles.marginBottom]}>
              <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={10} style={styles.iconStyle} />
              <Label type="regular" style={styles.label}>
                {item.label}
              </Label>
            </View>
          );
        })}
      </>
    );
  };

  private onToggle = (): void => {
    const { onToggle, selected } = this.props;
    onToggle(!selected);
  };

  private toggleSubsection = (): void => {
    this.setState((prev) => ({
      showMore: !prev.showMore,
    }));
  };
}

export default withTranslation(LocaleConstants.namespacesKey.property)(CardWithCheckbox);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.moreSeparator,
    borderRadius: 4,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: PlatformUtils.isIOS() ? 0.2 : 0.8,
    elevation: 1,
  },
  content: {
    marginLeft: 10,
  },
  headingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textStyle: {
    width: PlatformUtils.isWeb() ? '100%' : '75%',
    color: theme.colors.darkTint2,
  },
  mobileContainer: {
    width: '65%',
  },
  price: {
    marginTop: 10,
    color: theme.colors.darkTint2,
  },
  originalPrice: {
    color: theme.colors.disabled,
    textDecorationLine: 'line-through',
    marginTop: 10,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreBtn: {
    backgroundColor: theme.colors.blueTint10,
    alignItems: 'center',
    borderWidth: 0,
    flex: 0,
  },
  padding: {
    paddingVertical: 12,
  },
  moreTextStyle: {
    color: theme.colors.blue,
    marginVertical: 6,
  },
  dividerStyles: {
    marginTop: 16,
    marginBottom: 12,
    borderColor: theme.colors.background,
  },
  marginRight: {
    marginRight: 8,
  },
  marginBottom: {
    marginBottom: 14,
  },
  iconStyle: {
    marginTop: 4,
    marginHorizontal: 6,
  },
  label: {
    color: theme.colors.darkTint5,
  },
  image: {
    width: 42,
    height: 42,
  },
  checkBoxWeb: {
    position: 'absolute',
    right: '24px',
    top: 0,
  },
  feeContainer: {
    marginTop: 16,
    backgroundColor: theme.colors.lightGrayishBlue,
    padding: 12,
  },
  feeContent: {
    flexDirection: PlatformUtils.isMobile() ? 'column' : 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  mainLabel: {
    marginVertical: 4,
    color: theme.colors.darkTint1,
  },
  subLabel: {
    color: theme.colors.darkTint2,
  },
  tokenValue: {
    backgroundColor: theme.colors.darkTint4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginVertical: 8,
    alignSelf: 'flex-start',
  },
  paddingStyle: {
    paddingHorizontal: 12,
  },
  token: {
    color: theme.colors.white,
  },
});
