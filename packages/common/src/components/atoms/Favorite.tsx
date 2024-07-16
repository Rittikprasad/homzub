import React, { useEffect, useState } from 'react';
import { ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { LeadRepository } from '@homzhub/common/src/domain/repositories/LeadRepository';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { ILeadPayload } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  fromScreen?: ScreensKeys;
  isDisable?: boolean;
  leaseId?: number;
  saleId?: number;
  iconColor?: string;
  iconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

const Favorite = (props: IProps): React.ReactElement => {
  const {
    iconColor = theme.colors.darkTint6,
    containerStyle,
    iconSize = 32,
    saleId,
    leaseId,
    fromScreen,
    isDisable = false,
  } = props;
  const [isFavourite, setFavourite] = useState(false);

  // HOOKS START
  const properties = useSelector(UserSelector.getFavouritePropertyIds);
  const filters = useSelector(SearchSelector.getFilters);
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // HOOKS END

  useEffect(() => {
    if (properties.length === 0) {
      setFavourite(false);
      return;
    }

    for (let i = 0; i < properties.length; i++) {
      const item = properties[i];
      if (item.leaseListingId && leaseId) {
        if (item.leaseListingId === leaseId) {
          setFavourite(true);
          break;
        }
      } else if (item.saleListingId && saleId) {
        if (item.saleListingId === saleId) {
          setFavourite(true);
          break;
        }
      }

      setFavourite(false);
    }
  }, [properties]);

  const onFavoritePress = async (): Promise<void> => {
    if (!isLoggedIn) {
      dispatch(UserActions.setChangeStack(false));
      navigation.navigate(ScreensKeys.AuthStack, {
        screen: ScreensKeys.SignUp,
        params: { onCallback: (): Promise<void> => handleFavourite(true) },
      });
    } else {
      await handleFavourite();
    }
  };

  const handleFavourite = async (isFromLogin?: boolean): Promise<void> => {
    const { asset_transaction_type } = filters;
    if (isFromLogin) {
      if (fromScreen && fromScreen === ScreensKeys.PropertyAssetDescription) {
        navigation.navigate(ScreensKeys.PropertyAssetDescription, { propertyTermId: leaseId ?? saleId });
        return;
      }
      navigation.navigate(ScreensKeys.PropertySearchScreen);
      return;
    }

    const payload: ILeadPayload = {
      // @ts-ignore
      propertyTermId: leaseId ?? saleId,
      data: {
        lead_type: 'WISHLIST',
        is_wishlisted: !isFavourite,
        user_search: null,
      },
    };

    try {
      if (asset_transaction_type === 0) {
        // RENT FLOW
        await LeadRepository.postLeaseLeadDetail(payload);
      } else {
        // SALE FLOW
        await LeadRepository.postSaleLeadDetail(payload);
      }
      dispatch(UserActions.getFavouriteProperties());
    }catch (e: any) {      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  return (
    <TouchableOpacity style={containerStyle} disabled={isDisable} onPress={onFavoritePress}>
      <Icon
        name={isFavourite ? icons.filledHeart : icons.heartOutline}
        size={iconSize}
        color={isFavourite ? theme.colors.favourite : iconColor}
        testID="icon"
      />
    </TouchableOpacity>
  );
};

export { Favorite };
