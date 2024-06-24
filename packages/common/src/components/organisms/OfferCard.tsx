import React, { Component } from 'react';
import { FlatList, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { OfferUtils } from '@homzhub/common/src/utils/OfferUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import TextWithIcon from '@homzhub/common/src/components/atoms/TextWithIcon';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import IconWithCount from '@homzhub/common/src/components/molecules/IconWithCount';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import UserView from '@homzhub/common/src/components/organisms/UserView';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer, OfferAction, Status } from '@homzhub/common/src/domain/models/Offer';
import { ICounterParam, NegotiationType } from '@homzhub/common/src/domain/repositories/interfaces';
import { IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

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
  onCreateLease?: () => void;
  onSelectOffer?: (count: number) => void;
  selectedOffers?: number[];
  containerStyle?: StyleProp<ViewStyle>;
  onPressMessages?: () => void;
  onViewReasonWeb?: (action: OfferAction) => void;
}

interface IOwnState {
  hasMore: boolean;
  isReasonSheetVisible: boolean;
  isProfileSheetVisible: boolean;
}

type Props = IProps & WithTranslation;
class OfferCard extends Component<Props, IOwnState> {
  public state = {
    hasMore: false,
    isReasonSheetVisible: false,
    isProfileSheetVisible: false,
  };

  public render(): React.ReactElement {
    const { hasMore, isReasonSheetVisible } = this.state;
    const { t, offer, containerStyle, isDetailView = false, pastOffer } = this.props;
    const isOfferCancelled = offer.status === Status.CANCELLED;

    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderCardContent(offer, false)}
        {isDetailView && offer.counterOffersCount > 0 && (
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
        {hasMore && pastOffer && pastOffer.length > 0 && (
          <FlatList
            data={pastOffer}
            ItemSeparatorComponent={(): React.ReactElement => <Divider containerStyles={styles.divider} />}
            renderItem={({ item }): React.ReactElement => this.renderCardContent(item, true)}
          />
        )}
        {!PlatformUtils.isWeb() && (
          <BottomSheet
            sheetHeight={450}
            visible={isReasonSheetVisible}
            headerTitle={t(isOfferCancelled ? 'reasonForCancellation' : 'rejectionReason')}
            onCloseSheet={this.onCloseReason}
          >
            {this.renderReasonView()}
          </BottomSheet>
        )}
      </View>
    );
  }

  private renderCardContent = (offer: Offer, isMoreInfo?: boolean): React.ReactElement => {
    const { hasMore, isProfileSheetVisible } = this.state;
    const { minLockInPeriod, leasePeriod, price, role, createdAt, validDays, validCount, status, user } = offer;
    const { t, isFromAccept = false, compareData, asset } = this.props;

    const isOfferValid = validCount > 6;
    const isOfferExpired = validCount < 0;

    const currency = asset && asset.country ? asset.country.currencies[0].currencySymbol : 'INR';

    const offerValues = OfferUtils.getOfferValues(offer, compareData, currency, isMoreInfo);

    // For highlighting active offer
    const isHighlighted = hasMore && !isMoreInfo;

    return (
      <View style={[styles.cardContainer, isHighlighted && styles.highlighted]}>
        <TouchableOpacity onPress={this.onProfileSheet}>
          <Avatar fullName={user.name} designation={StringUtils.toTitleCase(role)} image={user.profilePicture} />
        </TouchableOpacity>
        {!PlatformUtils.isWeb() && (
          <UserView isVisible={isProfileSheetVisible} user={user} onClose={this.onCloseProfileSheet} />
        )}
        {isFromAccept && asset ? (
          <PropertyAddressCountry
            isIcon
            primaryAddress={asset.projectName}
            subAddress={asset.formattedAddressWithCity}
            countryFlag={asset.country.flag}
            containerStyle={styles.addressView}
          />
        ) : (
          <View style={styles.dateView}>
            <Label type="regular" style={styles.date}>
              {t('createdDate', { date: DateUtils.getDisplayDate(createdAt, DateFormats.DoMMM_YYYY) })}
            </Label>
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
        {!isMoreInfo && this.renderOfferHeader(currency)}
        <View style={styles.valuesView}>
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
                containerStyle={styles.textContainer}
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
        </View>
        {!isMoreInfo && this.renderPreferences()}
        {!isMoreInfo && !isFromAccept && this.renderActionView()}
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
          {/* Todo (Praharsh) : icons.circularFilledInfo has been hidden for now but may be used in future */}
          <TextWithIcon text={offerHeader.key} variant="label" textSize="large" textStyle={styles.headerKey} />
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
          containerStyle={[container, PlatformUtils.isWeb() && styles.containerWeb]}
          titleStyle={textStyle}
          icon={icon}
          iconColor={iconColor}
          iconSize={16}
          disabled
          iconStyle={PlatformUtils.isWeb() && styles.containerWeb}
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
            containerStyle={[buttonData.container, PlatformUtils.isWeb() && styles.containerWeb]}
            iconStyle={PlatformUtils.isWeb() && styles.containerWeb}
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
                containerStyle={[container, PlatformUtils.isWeb() && styles.buttonContainerWeb]}
                titleStyle={textStyle}
                onPress={onAction}
                iconStyle={PlatformUtils.isWeb() && styles.iconContainerWeb}
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
            onPress={onViewReasonWeb ? (): void => onViewReasonWeb(OfferAction.REASON) : this.onViewReason}
          />
        )}
        {canCreateLease && status === Status.ACCEPTED && (
          <Button
            type="primary"
            title={t('createLease')}
            containerStyle={!PlatformUtils.isWeb() && styles.leaseButton}
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
                containerStyle={styles.preferenceContent}
              />
            );
          })}
      </View>
    );
  };

  private renderReasonView = (): React.ReactElement => {
    const {
      t,
      offer: { statusUpdatedAt, statusUpdatedBy, statusChangeComment, statusChangeReason, status, statusUpdatedByRole },
    } = this.props;
    const isCancelled = status === Status.CANCELLED;
    return (
      <View style={styles.cardContainer}>
        <Label type="large">{t(isCancelled ? 'offerCancelledOn' : 'offerRejectOn')}</Label>
        {!!statusUpdatedAt && (
          <Label type="large" textType="semiBold" style={styles.textStyle}>
            {DateUtils.getDisplayDate(statusUpdatedAt, 'MMM DD, YYYY')}
          </Label>
        )}
        <Divider containerStyles={styles.verticalStyle} />
        <Avatar fullName={statusUpdatedBy?.name} designation={StringUtils.toTitleCase(statusUpdatedByRole || '')} />
        {statusChangeReason && (
          <View style={styles.valuesView}>
            <Label type="large" textType="semiBold">
              {t(isCancelled ? 'cancelReasonLabel' : 'rejectReasonLabel')}
            </Label>
            <Label type="large" style={styles.textStyle}>
              {statusChangeReason.title}
            </Label>
          </View>
        )}
        {!!statusChangeComment && (
          <View style={styles.verticalStyle}>
            <Label type="large" textType="semiBold">
              {t('additionalComment')}
            </Label>
            <Label type="large" style={styles.textStyle}>
              {statusChangeComment}
            </Label>
          </View>
        )}
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

  private onViewReason = (): void => {
    this.setState({ isReasonSheetVisible: true });
  };

  private onCloseReason = (): void => {
    this.setState({ isReasonSheetVisible: false });
  };

  private onProfileSheet = (): void => {
    this.setState({ isProfileSheetVisible: true });
  };

  private onCloseProfileSheet = (): void => {
    this.setState({ isProfileSheetVisible: false });
  };

  private handleOfferCompare = (id: number): void => {
    const { onSelectOffer } = this.props;
    if (onSelectOffer) {
      onSelectOffer(id);
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.offers)(OfferCard);

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
    flex: 0,
    backgroundColor: theme.colors.moreSeparator,
  },
  infoTitle: {
    color: theme.colors.primaryColor,
  },
  cardContainer: {
    padding: 16,
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
    marginVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
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
  preferenceView: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  rejectionButton: {
    backgroundColor: theme.colors.transparent,
    flex: 0,
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
    marginHorizontal: 16,
    borderColor: theme.colors.darkTint10,
  },
  counterButton: {
    flex: 0,
  },
  leaseButton: {
    flex: 0,
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
  containerWeb: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainerWeb: {
    width: '48%',
    height: 44,
  },
  iconContainerWeb: {
    position: 'absolute',
    left: 15,
    top: 12,
  },
});
