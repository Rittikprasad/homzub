import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import VisitCard from '@homzhub/common/src/components/molecules/VisitCard';
import { AssetVisit } from '@homzhub/common/src/domain/models/AssetVisit';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import {
  IUpdateVisitPayload,
  IVisitActionParam,
  VisitStatus,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

const VisitListCard = (): React.ReactElement | null => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const [currentVisitIndex, setVisitIndex] = useState(0);
  const data = useSelector(AssetSelectors.getAssetVisits);

  const handleReschedule = (visit: AssetVisit): void => {
    const { id, leaseListing, saleListing } = visit;
    dispatch(AssetActions.setVisitIds([id]));
    const param = {
      ...(leaseListing && leaseListing > 0 && { lease_listing_id: leaseListing }),
      ...(saleListing && saleListing > 0 && { sale_listing_id: saleListing }),
    };
    navigate(ScreensKeys.BookVisit, {
      isReschedule: true,
      ...param,
    });
  };

  const handleVisitActions = async (param: IVisitActionParam): Promise<void> => {
    const { action, isValidVisit } = param;
    if (!action) return;

    if (!isValidVisit) {
      AlertHelper.error({ message: t('property:inValidVisit') });
      return;
    }

    const payload: IUpdateVisitPayload = {
      id: param.id,
      data: {
        status: action,
      },
    };

    try {
      await AssetRepository.updatePropertyVisit(payload);
      dispatch(
        AssetActions.getAssetVisit({
          start_date__gte: new Date().toISOString(),
          status__in: `${VisitStatus.APPROVED},${VisitStatus.PENDING}`,
        })
      );
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  const navigateToProperty = (listingId: number, id: number, isValidVisit: boolean): void => {
    if (isValidVisit) {
      navigate(ScreensKeys.PropertyAssetDescription, {
        propertyTermId: listingId,
        propertyId: id,
      });
    } else {
      AlertHelper.error({ message: t('property:inValidVisit') });
    }
  };

  if (data.length < 1) return null;
  const currentVisit = data[currentVisitIndex];

  return (
    <View style={styles.container}>
      <View style={styles.headingView}>
        <Icon name={icons.warning} size={18} />
        <Text type="small" textType="semiBold" numberOfLines={1} style={styles.label}>
          {t('property:siteVisits')}
        </Text>
        {data.length > 1 && (
          <View style={styles.headingContent}>
            <TouchableOpacity
              style={styles.iconStyle}
              disabled={currentVisitIndex === 0}
              onPress={(): void => setVisitIndex(currentVisitIndex - 1)}
            >
              <Icon
                name={icons.leftArrow}
                size={16}
                color={currentVisitIndex === 0 ? theme.colors.darkTint4 : theme.colors.primaryColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconStyle}
              disabled={currentVisitIndex === data.length - 1}
              onPress={(): void => setVisitIndex(currentVisitIndex + 1)}
            >
              <Icon
                name={icons.rightArrow}
                size={16}
                color={currentVisitIndex === data.length - 1 ? theme.colors.darkTint4 : theme.colors.primaryColor}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {currentVisit && (
        <VisitCard
          isFromVisitScreen={false}
          visit={currentVisit}
          isRightIcon={false}
          visitType={Tabs.UPCOMING}
          handleReschedule={handleReschedule}
          handleAction={handleVisitActions}
          navigateToAssetDetails={navigateToProperty}
        />
      )}
    </View>
  );
};

export default VisitListCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    marginTop: 12,
    paddingBottom: 16,
  },
  headingView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
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
});
