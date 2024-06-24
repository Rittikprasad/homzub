import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import RNIap, {
  IAPErrorCode,
  ProductPurchase,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  Subscription,
} from 'react-native-iap';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/MoreStack';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PurchaseTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSubscription } from '@homzhub/common/src/domain/models/UserSubscription';

// TODO: (Shikha) - remove after API integration
const serviceData: any = {
  Homzhub_Pro: [
    'Everything in Homzhub Premium and',
    'Special Discount on Value Added Service',
    'Digital Property Management',
  ],
  Homzhub_Premium: ['List Properties and Receive Enquiries', 'Schedule and Manage Property Visits', 'Document Vault'],
};

interface IStateProps {
  userSubscription: UserSubscription | null;
}

interface IScreenState {
  subscriptions: Subscription[];
  loading: boolean;
}

type libProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.SubscriptionPayment>;
type Props = WithTranslation & libProps & IStateProps;

class SubscriptionPayment extends Component<Props, IScreenState> {
  private purchaseUpdateSubscription: any;
  private purchaseErrorSubscription: any;
  public state = {
    subscriptions: [],
    loading: false,
  };

  public componentDidMount = async (): Promise<void> => {
    this.setState({ loading: true });
    try {
      await RNIap.initConnection();
      await this.getItems();
    } catch (err) {
      this.setState({ loading: false });
      AlertHelper.error({ message: err.message });
    }
  };

  public componentWillUnmount(): void {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  public render(): React.ReactNode {
    const { subscriptions, loading } = this.state;
    const { t, navigation, userSubscription } = this.props;
    const currentSubscription = userSubscription ? userSubscription.userServicePlan.appleProductId : '';
    return (
      <UserScreen
        title={t('assetMore:more')}
        pageTitle={t('assetMore:subscriptionPayment')}
        loading={loading}
        onBackPress={navigation.goBack}
      >
        {subscriptions.length > 0 ? (
          subscriptions.map((item: Subscription, index) => {
            const isSubscribed = (currentSubscription && currentSubscription === item.productId) || false;
            return (
              <View style={styles.container} key={index}>
                <Text type="regular" textType="semiBold" style={styles.margin}>
                  {item.title}
                </Text>
                <Label type="large" style={[styles.description, styles.margin]}>
                  {item.description}
                </Label>
                <View style={styles.priceSection}>
                  <Label type="large" style={styles.priceLabel}>
                    {t('common:totalPrice')}
                  </Label>
                  <Text type="small">{`${item.localizedPrice} / ${t('common:annually')}`}</Text>
                </View>
                <View style={styles.list}>
                  {Object.keys(serviceData).map((key): React.ReactElement | null => {
                    if (key === item.productId) {
                      const data = serviceData[key];
                      return (
                        <>
                          {data.map((value: string, indexKey: number) => {
                            return (
                              <View key={indexKey} style={styles.listItem}>
                                <Icon
                                  name={icons.roundFilled}
                                  style={styles.icon}
                                  size={14}
                                  color={theme.colors.darkTint3}
                                />
                                <Label type="large" style={styles.listValue}>
                                  {value}
                                </Label>
                              </View>
                            );
                          })}
                        </>
                      );
                    }
                    return null;
                  })}
                </View>
                <Button
                  type="primary"
                  title={isSubscribed ? t('assetMore:activePlan') : t('propertySearch:buy')}
                  containerStyle={[styles.buttonContainer, styles.margin, isSubscribed && styles.subscribed]}
                  titleStyle={[styles.buttonTitle, isSubscribed && styles.subscribedTitle]}
                  disabled={isSubscribed}
                  onPress={(): Promise<void> => this.requestSubscription(item.productId)}
                />
              </View>
            );
          })
        ) : (
          <EmptyState title={t('assetMore:noSubscriptions')} />
        )}
      </UserScreen>
    );
  }

  private getItems = async (): Promise<void> => {
    try {
      const plans = await ServiceRepository.getPlatformPlans();

      if (plans.length) {
        const products = plans.filter((item) => item.appleProductId);
        const productIds = products.map((item) => item.appleProductId as string);
        const subscriptions = await RNIap.getSubscriptions(productIds);
        this.setState({ subscriptions, loading: false });
      }
    } catch (err) {
      this.setState({ loading: false });
      AlertHelper.error({ message: err.message });
    }
  };

  private requestSubscription = async (product: string): Promise<void> => {
    const { t } = this.props;
    this.setState({ loading: true });
    try {
      await RNIap.requestPurchase(product);
      this.purchaseUpdateSubscription = purchaseUpdatedListener((purchase: ProductPurchase) => {
        if (purchase) {
          this.purchaseConfirmed(purchase);
        }
      });
      this.setState({ loading: false });
    } catch (err) {
      this.purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
        if (error.code === IAPErrorCode.E_USER_CANCELLED) {
          AlertHelper.error({ message: t('userCancelled') });
        } else {
          AlertHelper.error({ message: error.message ?? '' });
        }
      });
      this.setState({ loading: false });
    }
  };

  private purchaseConfirmed = async (purchase: ProductPurchase): Promise<void> => {
    const { transactionReceipt, productId } = purchase;
    const { subscriptions } = this.state;
    const purchasedProduct: Subscription | undefined = subscriptions.find(
      (item: Subscription) => item.productId === productId
    );
    if (!purchasedProduct) return;
    const item = purchasedProduct as Subscription;
    try {
      await UserRepository.updateUserServicePlan({
        action: PurchaseTypes.APPLE_PURCHASE,
        payload: {
          receipt_data: transactionReceipt,
          currency: item.currency,
        },
      });
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ loading: false });
      AlertHelper.error({ message: e.message });
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserSubscription } = UserSelector;
  return {
    userSubscription: getUserSubscription(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(SubscriptionPayment));

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderWidth: 0.5,
    paddingVertical: 16,
    borderRadius: 5,
    borderColor: theme.colors.disabled,
  },
  description: {
    marginVertical: 6,
    color: theme.colors.darkTint5,
  },
  buttonContainer: {
    flex: 0,
    marginTop: 16,
  },
  buttonTitle: {
    marginVertical: 8,
  },
  margin: {
    marginHorizontal: 16,
  },
  subscribed: {
    backgroundColor: theme.colors.greenOpacity,
  },
  subscribedTitle: {
    color: theme.colors.green,
  },
  list: {
    margin: 20,
  },
  priceSection: {
    backgroundColor: theme.colors.lightGrayishBlue,
    padding: 16,
    marginTop: 10,
  },
  priceLabel: {
    marginBottom: 8,
    color: theme.colors.darkTint5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  icon: {
    marginTop: 6,
  },
  listValue: {
    color: theme.colors.darkTint5,
    marginHorizontal: 8,
  },
});
