import React, { useState, useEffect, createRef } from 'react';
import { View, StyleSheet, PickerItemProps } from 'react-native';
import { useDispatch } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { AssetService } from '@homzhub/common/src/services/AssetService';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { PropertyByCountryDropdown } from '@homzhub/common/src/components/molecules/PropertyByCountryDropdown';
import SiteVisitsCalendarView from '@homzhub/web/src/screens/siteVisits/components/SiteVisitsCalendarView';
import SiteVisitsGridView from '@homzhub/web/src/screens/siteVisits/components/SiteVisitsGridView';
import SiteVisitsActionsPopover, {
  SiteVisitAction,
} from '@homzhub/web/src/screens/siteVisits/components/SiteVisitsActionsPopover';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import { IAssetVisitPayload, IBookVisitProps } from '@homzhub/common/src/domain/repositories/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

interface ICustomState {
  isCalendarView: boolean;
  countryData: Country[];
  propertiesByCountry: PickerItemProps[];
  selectedAssetId: number;
  selectedCountry: number;
  visitPayload: IAssetVisitPayload;
}

const PropertyVisits: React.FC = () => {
  useEffect(() => {
    getAllAssetsByCountry();
    return (): void => {
      dispatch(clearVisits());
    };
  }, []);
  const dispatch = useDispatch();
  const { getAssetVisit, setVisitType, clearVisits } = AssetActions;
  const [customState, setCustomState] = useState<ICustomState>({
    isCalendarView: false,
    countryData: [],
    propertiesByCountry: [],
    selectedAssetId: 0,
    selectedCountry: 0,
    visitPayload: {} as IAssetVisitPayload,
  });
  const onCountryChange = (countryId: number): void => {
    setCustomState((state) => {
      return {
        ...state,
        selectedCountry: countryId,
      };
    });
  };
  const handleCalendarPress = (): void => {
    setVisitType(Tabs.UPCOMING);
    setCustomState((state) => {
      return {
        ...state,
        isCalendarView: !state.isCalendarView,
      };
    });
  };
  const onPropertyChange = (value: number): void => {
    const {
      visitPayload: { start_date__gte, status__in, start_date__lt },
      isCalendarView,
    } = customState;
    setCustomState((state) => {
      return {
        ...state,
        selectedAssetId: value,
      };
    });

    const payload: IAssetVisitPayload = {
      ...(value > 0 && { asset_id: value }),
      ...(start_date__gte && isCalendarView && { start_datetime: start_date__gte }),
      ...(start_date__gte && !isCalendarView && { start_date__gte }),
      ...(start_date__lt && !isCalendarView && { start_date__lt }),
      ...(status__in && { status__in }),
    };

    dispatch(getAssetVisit(payload));
  };

  const getAllAssetsByCountry = async (): Promise<void> => {
    const response = await AssetService.getVisitAssetByCountry();
    const countryData = response.map((item) => {
      const result: VisitAssetDetail = item.results[0] as VisitAssetDetail;
      return result.country;
    });

    const propertiesByCountry: PickerItemProps[] = [];

    response.forEach((item) => {
      const results = item.results as VisitAssetDetail[];
      results.forEach((asset: VisitAssetDetail) => {
        propertiesByCountry.push({ label: asset.projectName, value: asset.id.toString() });
      });
    });

    setCustomState((state) => {
      return {
        ...state,
        countryData,
        propertiesByCountry,
      };
    });
  };

  const setVisitPayload = (payload: IAssetVisitPayload): void => {
    setCustomState((state) => {
      return {
        ...state,
        visitPayload: payload,
      };
    });
  };

  const [visitParams, setVisitParams] = useState({} as IBookVisitProps);
  const [isReschedule, setIsReschedule] = useState(false);

  const rescheduleVisit = (paramsArg: IBookVisitProps, isNew?: boolean): void => {
    setVisitParams(paramsArg);
    setIsReschedule(true);
  };

  const getAllVisits = (): void => {
    const { visitPayload } = customState;
    dispatch(getAssetVisit(visitPayload));
  };

  const popupRef = createRef<PopupActions>();
  const onOpenModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  const onCloseModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
      setIsReschedule(false);
      getAllVisits();
    }
  };

  useEffect(() => {
    if (isReschedule) {
      onOpenModal();
    }
  }, [isReschedule]);

  const { isCalendarView, countryData, propertiesByCountry, selectedAssetId, selectedCountry } = customState;

  return (
    <View style={styles.container}>
      <View style={styles.containerFilters}>
        {propertiesByCountry.length ? (
          <PropertyByCountryDropdown
            selectedCountry={selectedCountry}
            selectedProperty={selectedAssetId}
            countryList={countryData}
            propertyList={propertiesByCountry}
            onPropertyChange={onPropertyChange}
            onCountryChange={onCountryChange}
            containerStyle={styles.dropdownStyle}
          />
        ) : (
          <View />
        )}
        <View style={styles.containerIcon}>
          <Icon
            size={24}
            name={isCalendarView ? icons.doubleBar : icons.calendar}
            color={theme.colors.primaryColor}
            onPress={handleCalendarPress}
          />
        </View>
      </View>
      <View style={styles.contentContainer}>
        {isCalendarView ? (
          <View>
            <SiteVisitsCalendarView
              onReschedule={rescheduleVisit}
              selectedAssetId={selectedAssetId}
              setVisitPayload={setVisitPayload}
            />
          </View>
        ) : (
          <View>
            <SiteVisitsGridView onReschedule={rescheduleVisit} setVisitPayload={setVisitPayload} />
          </View>
        )}
        <SiteVisitsActionsPopover
          popupRef={popupRef}
          onCloseModal={onCloseModal}
          siteVisitActionType={SiteVisitAction.RESCHEDULE_VISIT}
          paramsBookVisit={visitParams}
        />
      </View>
    </View>
  );
};

export default PropertyVisits;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 4,
    marginTop: 24,
  },
  containerFilters: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    paddingBottom: 20,
    minHeight: 40,
    justifyContent: 'space-between',
  },
  containerIcon: {
    height: 45,
    width: 45,
    backgroundColor: theme.colors.lightGrayishBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginTop: 20,
    marginRight: 20,
  },
  dropdownContainerStyle: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  propertyContainerStyle: {
    flex: 0.2,
    marginLeft: 16,
    minWidth: 180,
  },
  dropdownStyle: {
    paddingHorizontal: 16,
  },
});
