import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { OnFocusCallback } from '@homzhub/common/src/components/atoms/OnFocusCallback';
import { ShieldGroup } from '@homzhub/mobile/src/components';
import { PropertyReviewCard } from '@homzhub/common/src/components/molecules/PropertyReviewCard';
import { Progress } from '@homzhub/common/src/components/atoms/Progress/Progress';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IActions, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';

const actionButtons: IActions[] = [
  { id: 1, title: 'Invite Tenant', type: TypeOfPlan.MANAGE },
  { id: 2, title: 'Rent', type: TypeOfPlan.RENT },
  { id: 3, title: 'Sell', type: TypeOfPlan.SELL },
];

interface IProps {
  data: Asset[];
  onPressComplete: (assetId: number) => void;
  onSelectAction: (payload: IActions, assetId: number) => void;
  onViewProperty: (data: ISetAssetPayload) => void;
}

interface IState {
  currentPropertyIndex: number;
  isActionsVisible: boolean;
}

type Props = IProps & WithTranslation;

export class PendingPropertyListCard extends Component<Props, IState> {
  public state = {
    currentPropertyIndex: 0,
    isActionsVisible: false,
  };

  public render(): React.ReactNode {
    const { currentPropertyIndex } = this.state;
    const { t, data } = this.props;
    const currentProperty = data[currentPropertyIndex];
    const total = data.length;

    return (
      <View style={styles.container}>
        <OnFocusCallback callback={this.resetIndex} />
        <View style={styles.headingView}>
          <Icon name={icons.warning} size={18} />
          <Text type="small" textType="semiBold" numberOfLines={1} style={styles.label}>
            {t('pendingProperties', { total })}
          </Text>
          {data.length > 1 && (
            <View style={styles.headingContent}>
              <TouchableOpacity
                style={styles.iconStyle}
                disabled={currentPropertyIndex === 0}
                onPress={this.handlePrevious}
              >
                <Icon
                  name={icons.leftArrow}
                  size={16}
                  color={currentPropertyIndex === 0 ? theme.colors.darkTint4 : theme.colors.primaryColor}
                  testID="icnPrevious"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconStyle}
                disabled={currentPropertyIndex === total - 1}
                onPress={this.handleNext}
              >
                <Icon
                  name={icons.rightArrow}
                  size={16}
                  color={currentPropertyIndex === total - 1 ? theme.colors.darkTint4 : theme.colors.primaryColor}
                  testID="icnNext"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {currentProperty && this.renderCardItem(currentProperty)}
      </View>
    );
  }

  private renderCardItem = (item: Asset): React.ReactElement => {
    const { onViewProperty } = this.props;
    const {
      id,
      spaces,
      assetType: { name },
      projectName,
      carpetArea,
      carpetAreaUnit,
      furnishing,
      lastVisitedStep,
      country: { flag },
      verifications: { description },
      listingInfo,
      formattedAddressWithCity,
    } = item;
    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      furnishing,
      item.assetGroup.code,
      carpetArea,
      carpetAreaUnit?.title ?? '',
      true
    );

    const viewPayload = PropertyUtils.getAssetPayload(listingInfo, id);

    return (
      <TouchableOpacity style={styles.cardContainer} onPress={(): void => onViewProperty(viewPayload)}>
        <ShieldGroup
          isShieldVisible={false}
          propertyType={name}
          propertyTypeStyle={styles.heading}
          text={description}
          isInfoRequired
        />
        <PropertyAddressCountry
          primaryAddress={projectName}
          countryFlag={flag}
          subAddress={formattedAddressWithCity}
          containerStyle={styles.addressStyle}
        />
        {amenitiesData.length > 0 && (
          <PropertyAmenities data={amenitiesData} direction="row" containerStyle={styles.amenitiesContainer} />
        )}
        {this.renderButtonsView(id, lastVisitedStep)}
      </TouchableOpacity>
    );
  };

  private renderButtonsView = (id: number, lastVisitedStep: LastVisitedStep): React.ReactElement => {
    const { t, onPressComplete, onSelectAction } = this.props;
    const { isActionsVisible } = this.state;
    const {
      assetCreation: { percentage },
      listing: { type },
      isVerificationRequired,
      isListingRequired,
      isPropertyReady,
      isCompleteDetailsRequired,
    } = lastVisitedStep;
    const plan = actionButtons.find((item) => item.type === type);
    let onVerifyProperty;
    if (plan) {
      onVerifyProperty = (): void => onSelectAction(plan, id);
    }
    return (
      <>
        {isCompleteDetailsRequired && (
          <>
            <Progress progress={percentage} />
            <Button
              type="primary"
              title={t('completeDetails')}
              containerStyle={styles.buttonStyle}
              onPress={(): void => onPressComplete(id)}
            />
          </>
        )}
        {isListingRequired && (
          <Button
            type="primary"
            title={t('common:next')}
            iconSize={24}
            iconColor={theme.colors.blue}
            icon={isActionsVisible ? icons.upArrow : icons.downArrow}
            containerStyle={styles.actionButton}
            titleStyle={styles.actionButtonTitle}
            onPress={this.handleActions}
          />
        )}
        {isListingRequired && isActionsVisible && (
          <>
            {actionButtons.map((item) => {
              return (
                <Button
                  key={item.id}
                  type="secondary"
                  title={item.title}
                  containerStyle={styles.buttonStyle}
                  onPress={(): void => onSelectAction(item, id)}
                />
              );
            })}
          </>
        )}
        {isVerificationRequired && (
          <Button
            type="primary"
            title={t('completeVerification')}
            containerStyle={styles.buttonStyle}
            onPress={onVerifyProperty}
          />
        )}
        {isPropertyReady && <PropertyReviewCard />}
        {isCompleteDetailsRequired && (
          <Label type="regular" style={styles.infoText}>
            {t('completeProperty')}
          </Label>
        )}
        {isListingRequired && (
          <Label type="regular" style={styles.infoText}>
            {t('property:vacantPropertyMsg')}
          </Label>
        )}
      </>
    );
  };

  private handleNext = (): void => {
    const { currentPropertyIndex } = this.state;
    const { data } = this.props;

    if (data.length !== currentPropertyIndex + 1) {
      this.setState({ currentPropertyIndex: currentPropertyIndex + 1 });
    }
  };

  private handlePrevious = (): void => {
    const { currentPropertyIndex } = this.state;
    if (currentPropertyIndex !== 0) {
      this.setState({ currentPropertyIndex: currentPropertyIndex - 1 });
    }
  };

  private resetIndex = (): void => {
    this.setState({ currentPropertyIndex: 0 });
  };

  private handleActions = (): void => {
    this.setState((prevState) => {
      return {
        isActionsVisible: !prevState.isActionsVisible,
      };
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(PendingPropertyListCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    marginTop: 12,
    padding: 16,
  },
  headingView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headingContent: {
    flexDirection: 'row',
  },
  label: {
    flex: 1,
    marginEnd: 4,
    color: theme.colors.darkTint1,
    marginLeft: 10,
  },
  iconStyle: {
    width: 32,
    height: 28,
    borderRadius: 4,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  cardContainer: {
    marginVertical: 12,
  },
  heading: {
    color: theme.colors.darkTint3,
  },
  amenitiesContainer: {
    marginBottom: 20,
  },
  buttonStyle: {
    flex: 0,
    marginBottom: 5,
    marginTop: 18,
  },
  actionButton: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 18,
    backgroundColor: theme.colors.blueOpacity,
  },
  actionButtonTitle: {
    color: theme.colors.blue,
    marginHorizontal: 6,
  },
  infoText: {
    color: theme.colors.darkTint7,
    textAlign: 'center',
  },
  addressStyle: {
    marginBottom: 6,
  },
});
