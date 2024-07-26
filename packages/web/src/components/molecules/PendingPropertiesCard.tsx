import React, { FC, useState } from "react";
import {
  StyleSheet,
  View,
  LayoutChangeEvent,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { PropertyUtils } from "@homzhub/common/src/utils/PropertyUtils";
import { FunctionUtils } from "@homzhub/common/src/utils/FunctionUtils";
import { useDown } from "@homzhub/common/src/utils/MediaQueryUtils";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import { theme } from "@homzhub/common/src/styles/theme";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import { Label } from "@homzhub/common/src/components/atoms/Text";
import Popover from "@homzhub/web/src/components/atoms/Popover";
import { Progress } from "@homzhub/common/src/components/atoms/Progress/Progress";
import {
  ITypographyProps,
  Typography,
} from "@homzhub/common/src/components/atoms/Typography";
import { AmenitiesShieldIconGroup } from "@homzhub/common/src/components/molecules/AmenitiesShieldIconGroup";
import PopupMenuOptions from "@homzhub/web/src/components/molecules/PopupMenuOptions";
import { PropertyAddressCountry } from "@homzhub/common/src/components/molecules/PropertyAddressCountry";
import { PropertyAmenities } from "@homzhub/common/src/components/molecules/PropertyAmenities";
import { PropertyReviewCard } from "@homzhub/common/src/components/molecules/PropertyReviewCard";
import { NextPrevBtn } from "@homzhub/web/src/components";
import { Asset, Data } from "@homzhub/common/src/domain/models/Asset";
import { TypeOfPlan } from "@homzhub/common/src/domain/models/AssetPlan";
import { IAmenitiesIcons } from "@homzhub/common/src/domain/models/Search";
import { deviceBreakpoint } from "@homzhub/common/src/constants/DeviceBreakpoints";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";

interface IProps {
  data: Asset[];
  onPressComplete: (assetId: number) => void;
  onSelectAction: (payload: IActions, assetId: number) => void;
  onViewProperty: (id: number) => void;
}

export interface IActions {
  id: number;
  title: string;
  type: TypeOfPlan;
  label: string;
}

const actionButtons: IActions[] = [
  {
    id: 1,
    title: "Invite Tenant",
    label: "Invite Tenant",
    type: TypeOfPlan.MANAGE,
  },
  { id: 2, title: "Rent", label: "Rent", type: TypeOfPlan.RENT },
  { id: 3, title: "Sell", label: "Sell", type: TypeOfPlan.SELL },
];

export const PendingPropertiesCard: FC<IProps> = ({
  data,
  onPressComplete,
  onSelectAction,
  onViewProperty,
}: IProps) => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDashboard);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [isActionsVisible, setActionsVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const total = data?.length ?? 0;
  if (total <= 0) {
    return null;
  }
  const {
    id,
    address,
    assetType,
    assetGroup,
    furnishing,
    spaces,
    projectName,
    carpetArea,
    carpetAreaUnit,
    country,
    unitNumber,
    blockNumber,
    lastVisitedStep,
  } = data[currentAssetIndex];
  const primaryAddress = projectName;
  const subAddress = address ?? `${unitNumber ?? ""} ${blockNumber ?? ""}`;
  const countryIconUrl = country?.flag;
  const propertyType = assetType?.name ?? "-";
  const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
    spaces ?? ([] as Data[]),
    furnishing,
    assetGroup.code,
    carpetArea,
    carpetAreaUnit?.title ?? "",
    true
  );
  const {
    assetCreation: { percentage },
    listing: { type },
    isVerificationRequired,
    isListingRequired,
    isPropertyReady,
    isCompleteDetailsRequired,
  } = lastVisitedStep;
  const addressTextStyle: ITypographyProps = {
    size: "small",
    fontWeight: "semiBold",
    variant: "text",
  };
  const subAddressTextStyle: ITypographyProps = {
    size: "regular",
    fontWeight: "regular",
    variant: "label",
  };
  const updateCurrentAssetIndex = (updateIndexBy: number): void => {
    const nextIndex = currentAssetIndex + updateIndexBy;
    if (nextIndex > data.length - 1 || nextIndex < 0) {
      setCurrentAssetIndex(0);
    } else {
      setCurrentAssetIndex(nextIndex);
    }
  };
  const badgeInfo = [
    { color: theme.colors.warning },
    { color: theme.colors.warning },
    { color: theme.colors.disabledPreference },
  ];

  const handleActions = (): void => {
    setActionsVisible(!isActionsVisible);
  };

  const selectSort = (item: IActions): void => {
    onSelectAction(item, id);
  };

  const renderPopOverContent = (): React.ReactElement => {
    return (
      <View style={styles.popupMenu}>
        <PopupMenuOptions
          options={actionButtons}
          onMenuOptionPress={selectSort}
          labelType="regular"
          itemStyle={!isMobile && styles.itemStyleMobile}
        />
      </View>
    );
  };

  const plan = actionButtons.find((item) => item.type === type);
  const onLayout = (e: LayoutChangeEvent): void => {
    setWidth(e.nativeEvent.layout.width);
  };

  const onPressProperty = (): void => {
    onViewProperty(id);
  };

  let onVerifyProperty;
  if (plan) {
    onVerifyProperty = (): void => onSelectAction(plan, id);
  }

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <View style={styles.headerInfo}>
        <Icon
          name={icons.warning}
          color={theme.colors.darkTint3}
          size={16}
          style={styles.cardIcon}
        />
        <Typography
          variant="text"
          size="small"
          fontWeight="semiBold"
          style={[styles.title, styles.textColor1]}
        >
          {t("pendingProperties", { total })}
        </Typography>
        {data.length > 1 && (
          <NextPrevBtn onBtnClick={updateCurrentAssetIndex} />
        )}
      </View>
      <TouchableOpacity onPress={onPressProperty}>
        <View style={styles.mainBody}>
          <View style={styles.propertyDetails}>
            <View style={styles.propertyRating}>
              <Typography
                variant="label"
                size="regular"
                fontWeight="regular"
                style={styles.propertyType}
              >
                {propertyType}
              </Typography>
              <AmenitiesShieldIconGroup
                onBadgePress={FunctionUtils.noop}
                iconSize={21}
                badgesInfo={badgeInfo}
              />
            </View>
            <PropertyAddressCountry
              primaryAddress={primaryAddress}
              countryFlag={countryIconUrl}
              primaryAddressTextStyles={addressTextStyle}
              subAddressTextStyles={subAddressTextStyle}
              subAddress={subAddress}
              containerStyle={styles.addressCountry}
            />
            {amenitiesData.length > 0 && (
              <PropertyAmenities
                data={amenitiesData}
                direction="row"
                containerStyle={styles.propertyInfoBox}
                contentContainerStyle={styles.cardIcon}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
      <>
        {isCompleteDetailsRequired && (
          <>
            <Progress progress={percentage} containerStyles={styles.progress} />

            <Button
              type="primary"
              title={t("completeDetails")}
              containerStyle={[
                styles.buttonStyle,
                isMobile && styles.buttonStyleMobile,
              ]}
              onPress={(): void => onPressComplete(id)}
            />
            <Label type="regular" style={styles.infoText}>
              {t("completeProperty")}
            </Label>
          </>
        )}
        {isListingRequired && (
          <View style={styles.takeActionContainer} onLayout={onLayout}>
            <Popover
              content={renderPopOverContent()}
              popupProps={{
                position: "bottom left",
                arrow: false,
                contentStyle: { width },
                closeOnDocumentClick: true,
                children: undefined,
                on: "click",
              }}
            >
              <Button
                type="primary"
                title={t("takeActions")}
                iconSize={24}
                iconColor={theme.colors.blue}
                icon={isActionsVisible ? icons.upArrow : icons.downArrow}
                containerStyle={styles.actionButton}
                titleStyle={styles.actionButtonTitle}
                onPress={handleActions}
              />
            </Popover>
          </View>
        )}

        {isVerificationRequired && (
          <Button
            type="primary"
            title={t("completeVerification")}
            containerStyle={[
              styles.buttonStyle,
              isMobile && styles.buttonStyleMobile,
            ]}
            onPress={onVerifyProperty}
          />
        )}
        {isPropertyReady && (
          <View style={styles.propertyReadyContainer}>
            <PropertyReviewCard
              containerStyle={!isMobile && styles.propertyReviewCard}
            />
          </View>
        )}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    marginTop: 24,
    paddingBottom: 16,
  },
  containerMobile: {
    marginRight: 0,
    flex: undefined,
  },
  headerInfo: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  addressCountry: {
    marginTop: 8,
    marginBottom: 16,
  },
  mainBody: {
    flexDirection: "row",
    marginTop: 16,
    marginHorizontal: 20,
    marginBottom: 0,
  },
  propertyDetails: {
    flex: 1,
    width: "100%",
  },
  propertyType: {
    flex: 1,
    color: theme.colors.primaryColor,
  },
  propertyRating: {
    flexDirection: "row",
  },
  propertyNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  propertyReadyContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  propertyInfo: {
    marginRight: 16,
    color: theme.colors.darkTint3,
  },
  propertyInfoBox: {
    justifyContent: undefined,
    marginRight: 16,
  },
  progressBar: {
    marginBottom: 20,
  },
  actionBox: {
    marginHorizontal: 20,
    marginVertical: 24,
  },
  actionMsg: {
    alignSelf: "center",
    marginBottom: 8,
  },
  actionBtn: {
    alignItems: "center",
  },
  cardIcon: {
    marginRight: 8,
  },
  title: {
    flex: 1,
  },
  textColor1: {
    color: theme.colors.dark,
  },
  textColor2: {
    color: theme.colors.darkTint2,
  },
  textColor3: {
    color: theme.colors.darkTint3,
  },
  buttonStyle: {
    height: 44,
    borderRadius: 2,
    marginBottom: 18,
    marginHorizontal: 20,
    marginTop: 24,
    justifyContent: "center",
  },
  buttonStyleMobile: {
    marginTop: 8,
  },
  actionButton: {
    flex: 0.4,
    height: 44,
    borderRadius: 2,
    backgroundColor: theme.colors.greenLightOpacity,
    marginBottom: 12,
    marginHorizontal: 20,
    marginTop: "auto",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  actionButtonTitle: {
    color: theme.colors.blue,
    marginHorizontal: 6,
    marginVertical: 0,
  },
  infoText: {
    color: theme.colors.darkTint7,
    textAlign: "center",
  },

  propertyReviewCard: {
    flexDirection: "row",
  },
  progress: {
    marginHorizontal: 16,
  },
  takeActionContainer: {
    marginTop: "auto",
  },
  itemStyleMobile: {
    width: 550,
    justifyContent: "center",
  },
  popupMenu: {
    alignItems: "center",
    justifyContent: "center",
  },
});
