import React, { Component } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { OfferUtils } from '@homzhub/common/src/utils/OfferUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import TextWithIcon from '@homzhub/common/src/components/atoms/TextWithIcon';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import IconWithCount from '@homzhub/common/src/components/molecules/IconWithCount';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer, OfferAction, Status } from '@homzhub/common/src/domain/models/Offer';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { ICounterParam, NegotiationType } from '@homzhub/common/src/domain/repositories/interfaces';
import { IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';

interface IProps {
  offer: Offer;
  compareData: IOfferCompare;
  pastOffer?: Offer[];
  asset?: Asset;
  isDetailView?: boolean;
  isOfferDashboard?: boolean;
  isFromAccept?: boolean;
  onPressAction?: (action: OfferAction) => void;
  onMoreInfo?: (payload: ICounterParam) => void;
  onCreateLease: () => void;
  onSelectOffer?: (count: number) => void;
  selectedOffers?: number[];
  containerStyle?: StyleProp<ViewStyle>;
  onPressMessages: () => void;
  onViewReasonWeb: (action: OfferAction) => void;
}

interface IOwnState {
  hasMore: boolean;
}

type Props = IProps & WithTranslation & IWithMediaQuery;

class OffersCard extends Component<Props, IOwnState> {
  public state = {
    hasMore: false,
  };

  public render(): React.ReactElement {
    const { offer, containerStyle, pastOffer } = this.props;
    const { hasMore } = this.state;
    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderCardContent(offer, false)}
        {hasMore &&
          pastOffer &&
          pastOffer.length > 0 &&
          pastOffer.map((item, index) => (
            <>
              {this.renderCardContent(item, true)}
              {index < pastOffer.length && <Divider />}
            </>
          ))}
      </View>
    );
  }

  private renderCardContent = (offer: Offer, isMoreInfo: boolean): React.ReactElement => {
    const { hasMore } = this.state;
    const {
      minLockInPeriod,
      leasePeriod,
      price,
      role,
      createdAt,
      validDays,
      validCount,
      status,
      user,
      counterOffersCount,
    } = offer;
    const { t, isFromAccept = false, asset, isTablet, isDetailView = true, compareData } = this.props;
    const isOfferValid = validCount > 6;
    const isOfferExpired = validCount < 0;
    const currency = asset && asset.country ? asset.country.currencies[0].currencySymbol : 'INR';

    // For highlighting active offer
    const isHighlighted = hasMore && !isMoreInfo;
    const offerValues = OfferUtils.getOfferValues(offer, compareData, currency, isMoreInfo);

    return (
      <View style={[styles.cardContainer, isHighlighted && styles.highlighted]}>
        <View
          style={[
            isTablet && styles.detailsCard,
            !isTablet && styles.detailsCardDeskTop,
            isMoreInfo && styles.cardAlignment,
          ]}
        >
          <View style={styles.offerCards}>
            <TouchableOpacity>
              <Avatar fullName={user.name} designation={StringUtils.toTitleCase(role)} image={user.profilePicture} />
            </TouchableOpacity>
            <View>
              {isMoreInfo && (
                <Label type="regular" style={styles.date}>
                  {t('createdDate', { date: DateUtils.getDisplayDate(createdAt, DateFormats.DoMMM_YYYY) })}
                </Label>
              )}
              {isFromAccept && asset ? (
                <PropertyAddressCountry
                  isIcon
                  primaryAddress={asset.projectName}
                  subAddress={asset.address}
                  countryFlag={asset.country.flag}
                  containerStyle={styles.addressView}
                />
              ) : (
                <View style={styles.dateView}>
                  {!isOfferExpired && status === Status.PENDING && (
                    <TextWithIcon
                      icon={icons.timeValid}
                      text={t('validFor')}
                      value={validDays}
                      variant="label"
                      textSize="regular"
                      iconSize={16}
                      iconColor={isOfferValid ? theme.colors.darkTint5 : theme.colors.red}
                      textStyle={[styles.time, isOfferValid && styles.validTime]}
                      containerStyle={[styles.timeView, isOfferValid && styles.validOffer]}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
          <View style={[styles.actionButton, styles.flexRow, styles.spacing]}>
            {offerValues.map((item, index) => {
              return (
                <TextWithIcon
                  key={index}
                  icon={!isMoreInfo ? item.icon : ''}
                  iconColor={item.iconColor}
                  text={`${item.key}: `}
                  value={item.value}
                  variant="label"
                  textSize="large"
                  containerStyle={[styles.textContainer, { marginRight: 10 }]}
                />
              );
            })}
            {price < 1 && (
              <View style={styles.flexRow}>
                <TextWithIcon
                  text={t('common:minMonth')}
                  variant="label"
                  textSize="large"
                  value={`${minLockInPeriod} Months`}
                  containerStyle={[styles.textContainer, { marginRight: 10 }]}
                />
                <TextWithIcon
                  text={t('common:totalMonth')}
                  variant="label"
                  textSize="large"
                  value={`${leasePeriod} Months`}
                  containerStyle={styles.textContainer}
                />
              </View>
            )}
            {!isMoreInfo && this.renderPreferences()}
          </View>
          <View style={styles.headerIconsContainer}>
            <View>
              {!isMoreInfo && isDetailView && counterOffersCount > 0 && (
                <Button
                  iconSize={20}
                  type="primary"
                  title={hasMore ? t('lessInfo') : t('moreInfo')}
                  icon={hasMore ? icons.upArrow : icons.downArrow}
                  containerStyle={styles.infoButton}
                  titleStyle={styles.infoTitle}
                  iconColor={theme.colors.primaryColor}
                  onPress={this.onInfoToggle}
                />
              )}
            </View>
            {!isMoreInfo && (
              <Label type="regular" style={styles.date}>
                {t('createdDate', { date: DateUtils.getDisplayDate(createdAt, DateFormats.DoMMM_YYYY) })}
              </Label>
            )}
          </View>
        </View>

        {!isMoreInfo && <Divider containerStyles={styles.divider} />}
        {!isMoreInfo && (
          <View style={[styles.actionSection, isTablet && styles.actionSectionTab]}>
            {this.renderOfferHeader(currency)}
            {!isFromAccept && this.renderActionView()}
          </View>
        )}
      </View>
    );
  };

  private renderOfferHeader = (currency: string): React.ReactElement => {
    const { offer, compareData, isDetailView, selectedOffers, onPressMessages, isOfferDashboard = false } = this.props;
    const selectedValues: number[] = selectedOffers ?? [];
    const isSelected = selectedValues.includes(offer.id);
    const isOfferExpired = offer.validCount < 0;
    const offerHeader = OfferUtils.getOfferHeader(offer, compareData, currency);
    return (
      <View style={styles.headerView}>
        <View style={styles.flexOne}>
          <TextWithIcon
            icon={icons.circularFilledInfo}
            text={offerHeader.key}
            variant="label"
            textSize="large"
            iconColor={theme.colors.darkTint4}
            textStyle={styles.headerKey}
          />
          <View style={styles.headerIconsContainer}>
            <TextWithIcon
              icon={offerHeader.icon}
              text={offerHeader.value}
              variant="text"
              textSize="large"
              fontWeight="semiBold"
              iconColor={offerHeader.iconColor}
              textStyle={styles.offerValue}
              containerStyle={styles.headerValue}
            />
            {isDetailView && (
              <View style={styles.iconContainer}>
                <IconWithCount
                  iconName={icons.message}
                  count={offer.commentsCount}
                  onPress={onPressMessages}
                  containerStyle={!isOfferDashboard && !isOfferExpired ? styles.messageIcon : undefined}
                />
                {!isOfferDashboard && !isOfferExpired && (
                  <Icon
                    name={isSelected ? icons.checkboxOn : icons.circularCompare}
                    color={theme.colors.primaryColor}
                    size={24}
                    onPress={(): void => this.handleOfferCompare(offer.id)}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  private renderActionView = (): React.ReactElement => {
    const {
      t,
      offer: { status, actions, canCounter, canCreateLease, validCount },
      onPressAction,
      onCreateLease,
      isTablet,
      onViewReasonWeb,
    } = this.props;
    const buttonData = OfferUtils.getButtonStatus(status);
    const isOfferExpired = validCount < 0;
    const onPressCounter = (): void | undefined => (onPressAction ? onPressAction(OfferAction.COUNTER) : undefined);
    if (isOfferExpired) {
      const { title, icon, iconColor, textStyle, container } = OfferUtils.getButtonStatus();
      return (
        <Button
          type="primary"
          title={title}
          containerStyle={[container, styles.containerWeb, isTablet && styles.containerTab]}
          titleStyle={textStyle}
          icon={icon}
          iconColor={iconColor}
          iconSize={16}
          iconStyle={styles.containerWeb}
          disabled
        />
      );
    }
    return (
      <>
        {actions.length < 2 && (
          <Button
            type="primary"
            title={buttonData.title}
            icon={buttonData.icon}
            iconColor={buttonData.iconColor}
            iconSize={16}
            titleStyle={buttonData.textStyle}
            iconStyle={styles.iconContainerWeb}
            containerStyle={[buttonData.container, styles.containerWeb]}
            disabled
          />
        )}
        <View style={styles.actionView}>
          {actions.map((item, index) => {
            const { title, icon, iconColor, container, textStyle, onAction } = OfferUtils.getActionData({
              item,
              initialButtonStyle: styles.actionButton,
              initialTextStyle: styles.titleStyle,
              onAction: onPressAction,
            });
            return (
              <Button
                key={index}
                type="primary"
                title={title}
                icon={icon}
                iconSize={20}
                textType="label"
                textSize="large"
                iconColor={iconColor}
                containerStyle={[
                  container,
                  styles.buttonContainer,
                  item === OfferAction.CANCEL && styles.cancelOffer,
                  isTablet && styles.containerTablet,
                ]}
                titleStyle={textStyle}
                onPress={onAction}
                iconStyle={styles.iconButton}
              />
            );
          })}
        </View>
        {canCounter && (
          <Button
            type="primary"
            title={t('common:counter')}
            onPress={onPressCounter}
            containerStyle={styles.counterButton}
          />
        )}
        {(status === Status.CANCELLED || status === Status.REJECTED) && (
          <Button
            type="primary"
            title={t(status === Status.CANCELLED ? 'seeCancelReason' : 'seeRejectReason')}
            containerStyle={styles.rejectionButton}
            titleStyle={styles.rejectionTitle}
            onPress={(): void => onViewReasonWeb(OfferAction.REASON)}
          />
        )}
        {canCreateLease && status === Status.ACCEPTED && (
          <Button
            type="primary"
            title={t('createLease')}
            containerStyle={styles.leaseButton}
            titleStyle={styles.buttonTitle}
            onPress={onCreateLease}
          />
        )}
      </>
    );
  };

  private renderPreferences = (): React.ReactElement => {
    const {
      offer: { tenantPreferences },
      isTablet,
    } = this.props;
    return (
      <View style={styles.preferenceView}>
        {!!tenantPreferences.length &&
          tenantPreferences.map((item, index) => {
            return (
              <TextWithIcon
                key={index}
                icon={item.isSelected ? icons.check : icons.close}
                text={item.name}
                variant="label"
                textSize="large"
                iconColor={item.isSelected ? theme.colors.green : theme.colors.error}
                containerStyle={[styles.preferenceContent, isTablet && styles.preferenceContentTab]}
              />
            );
          })}
      </View>
    );
  };

  private onInfoToggle = (): void => {
    const { hasMore } = this.state;
    const { onMoreInfo, offer, asset } = this.props;
    this.setState({ hasMore: !hasMore }, () => {
      const { hasMore: more } = this.state;
      if (onMoreInfo && asset && more) {
        onMoreInfo({
          negotiationId: offer.id,
          negotiationType: asset.leaseTerm ? NegotiationType.LEASE_NEGOTIATIONS : NegotiationType.SALE_NEGOTIATIONS,
        });
      }
    });
  };

  private handleOfferCompare = (id: number): void => {
    const { onSelectOffer } = this.props;
    if (onSelectOffer) {
      onSelectOffer(id);
    }
  };
}

const HOC = withTranslation(LocaleConstants.namespacesKey.offers)(OffersCard);

const offersCard = withMediaQuery<any>(HOC);

export { offersCard as OffersCard };

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    marginBottom: 16,
  },
  textContainer: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  infoButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoTitle: {
    color: theme.colors.primaryColor,
  },
  cardContainer: {
    padding: 16,
    flexDirection: 'row',
  },
  addressView: {
    marginTop: 16,
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  date: {
    color: theme.colors.darkTint5,
  },
  timeView: {
    flexDirection: 'row-reverse',
    backgroundColor: theme.colors.redOpacity,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  validOffer: {
    backgroundColor: theme.colors.background,
  },
  time: {
    color: theme.colors.red,
  },
  validTime: {
    color: theme.colors.darkTint1,
  },
  headerView: {
    paddingVertical: 10,
    borderTopColor: theme.colors.background,
    borderBottomColor: theme.colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerValue: {
    color: theme.colors.darkTint1,
  },
  valuesView: {
    marginTop: 16,
  },
  flexRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row-reverse',
    flex: 0.45,
  },

  titleStyle: {
    marginHorizontal: 6,
  },
  actionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerValue: {
    marginVertical: 10,
  },
  headerKey: {
    marginRight: 6,
  },
  preferenceContent: {
    flexDirection: 'row-reverse',
    marginLeft: 20,
  },
  preferenceContentTab: {
    marginLeft: 0,
    marginRight: 20,
  },
  preferenceView: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  rejectionButton: {
    backgroundColor: theme.colors.transparent,
    flex: 0,
    top: 10,
  },
  rejectionTitle: {
    color: theme.colors.primaryColor,
  },
  textStyle: {
    marginTop: 4,
  },
  verticalStyle: {
    marginVertical: 16,
  },
  divider: {
    marginHorizontal: 20,
  },
  counterButton: {
    width: '100%',
  },
  leaseButton: {
    marginTop: 20,
  },
  buttonTitle: {
    color: theme.colors.white,
  },
  highlighted: {
    backgroundColor: theme.colors.moreSeparator,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexOne: {
    flex: 1,
  },
  headerIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageIcon: {
    marginEnd: 12,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    width: '47%',
    height: 44,
  },
  cancelOffer: {
    marginTop: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSection: {
    width: '25%',
    marginRight: 20,
  },
  actionSectionTab: {
    width: '39%',
  },
  detailsCard: {
    width: '55%',
  },
  detailsCardDeskTop: {
    width: '70%',
  },
  containerWeb: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 10,
  },
  containerTab: {
    top: '33%',
  },
  iconContainerWeb: {
    position: 'absolute',
    left: 15,
  },
  offerCards: { flexDirection: 'row', justifyContent: 'space-between' },
  iconButton: { position: 'absolute', justifyContent: 'center', left: 15, top: 14 },
  actionButtons: { marginVertical: 32, flexDirection: 'row', flexWrap: 'wrap' },
  cardAlignment: { width: '100%' },
  textAlignment: {
    paddingRight: 12,
  },
  spacing: { marginTop: 32 },
  containerTablet: {
    marginTop: 30,
  },
});
