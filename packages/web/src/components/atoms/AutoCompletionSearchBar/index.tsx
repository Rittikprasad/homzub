import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, LayoutChangeEvent } from "react-native";
import { useHistory } from "react-router-dom";
import { PopupActions } from "reactjs-popup/dist/types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { includes } from "lodash";
import { getDataFromPlaceID } from "@homzhub/web/src/utils/MapsUtils";
import { GeolocationService } from "@homzhub/common/src/services/Geolocation/GeolocationService";
import { GooglePlacesService } from "@homzhub/common/src/services/GooglePlaces/GooglePlacesService";
import { RouteNames } from "@homzhub/web/src/router/RouteNames";
import { SearchSelector } from "@homzhub/common/src/modules/search/selectors";
import { SearchField } from "@homzhub/web/src/components/atoms/SearchField";
import Popover from "@homzhub/web/src/components/atoms/Popover";
import PopupMenuOptions, {
  IPopupOptions,
} from "@homzhub/web/src/components/molecules/PopupMenuOptions";
import { AddPropertyStack } from "@homzhub/web/src/screens/addProperty";
import {
  GeolocationError,
  GeolocationResponse,
} from "@homzhub/common/src/services/Geolocation/interfaces";
import {
  ILatLng,
  IProjectDetails,
} from "@homzhub/common/src/modules/search/interface";
import { Any } from "json2typescript";

export interface IAddressComponent {
  long_name: string;
  short_name: string;
  types: Array<string>;
}
// TODO Lakshit / Mohak - To resolve state persistent bug

// interface IDispatchProps {
//   setInitialFilters: () => void;
//   setInitialState: () => void;
// }

interface ISearchBarProps {
  setUpdatedLatLng?: (latLng: ILatLng) => void;
  hasScriptLoaded?: boolean;
  navigateAddProperty?: (screen: AddPropertyStack) => void;
  onSuggestionPress?: (
    place: IAddressComponent[],
    address: string,
    latLng: ILatLng
  ) => void;
  setProjectDetails?: (projectDetails: IProjectDetails) => void;
}
type IProps = ISearchBarProps;

const AutoCompletionSearchBar: FC<IProps> = (props: IProps) => {
  // TODO - To resolve state persistent bug
  // const { setInitialFilters, setInitialState } = props;
  const history = useHistory();
  const address = useSelector(SearchSelector.getSearchAddress);
  const [searchText, setSearchText] = useState("");
  const {
    setUpdatedLatLng,
    hasScriptLoaded,
    navigateAddProperty,
    onSuggestionPress,
    setProjectDetails,
  } = props;
  const { t } = useTranslation();
  const [popOverWidth, setPopoverWidth] = useState<string | number>("100%");
  const popupRef = useRef<PopupActions>(null);
  const searchInputRef = useRef<TextInput>(null);
  const [suggestions, setSuggestions] = useState<
    google.maps.places.QueryAutocompletePrediction[]
  >([]);
  const updateSearchValue = (value: string): void => setSearchText(value);
  const popupOptionStyle = {
    marginTop: "4px",
    alignItems: "stretch",
    width: popOverWidth,
  };
  const getAutocompleteSuggestions = (query: string): void => {
    if (hasScriptLoaded) {
      const service = new google.maps.places.AutocompleteService();
      service.getQueryPredictions({ input: query }, (result, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          // handle error here
        }
        setSuggestions(result ?? []);
      });
    }
  };
  useEffect(() => {
    if (searchText.length > 0) {
      getAutocompleteSuggestions(searchText);
      if (
        popupRef &&
        popupRef.current &&
        searchInputRef &&
        searchInputRef.current &&
        suggestions.length > 0
      ) {
        popupRef.current.open();
      }
    } else if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  }, [searchText]);

  useEffect(() => {
    setSearchText(address);
  }, [address]);
  const handleSuggestionSelection = (selectedOption: IPopupOptions): void => {
    setSearchText(selectedOption.label);
    if (selectedOption && selectedOption.value) {
      getDataFromPlaceID((selectedOption?.value as string) ?? "", (result) => {
        if (setUpdatedLatLng && setProjectDetails) {
          setProjectDetails({
            projectName: selectedOption.label.split(",")[0],
          });
          const lat = result.geometry.location.lat();
          const lng = result.geometry.location.lng();
          setUpdatedLatLng({ lat, lng } as ILatLng);
        }
        if (onSuggestionPress) {
          onSuggestionPress(
            result.address_components,
            result.formatted_address,
            {
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng(),
            } as ILatLng
          );
        }
        if (
          navigateAddProperty &&
          includes(
            [
              RouteNames.protectedRoutes.ADD_PROPERTY,
              RouteNames.protectedRoutes.PORTFOLIO_ADD_PROPERTY,
            ],
            history.location.pathname
          )
        ) {
          navigateAddProperty(AddPropertyStack.PropertyDetailsMapScreen);
        }
      });
    }
    updateSearchValue("");
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  const getAutoCompletionOptions = useCallback(
    (): IPopupOptions[] =>
      suggestions?.map((item) => {
        return {
          label: item.description,
          value: item.place_id,
        };
      }) ?? [],
    [suggestions]
  );

  const onPressAutoDetect = (): void => {
    GeolocationService.getCurrentPosition(onFetchSuccess, onFetchError);
  };
  const onFetchSuccess = (response: GeolocationResponse): void => {
    const { latitude, longitude } = response.coords;

    GooglePlacesService.getLocationData({
      lat: latitude,
      lng: longitude,
    } as ILatLng).then((result) => {
      setSearchText(result.formatted_address);

      if (onSuggestionPress) {
        onSuggestionPress(result.address_components, result.formatted_address, {
          lat: latitude,
          lng: longitude,
        } as ILatLng);
      }
    });
  };
  const onFetchError = (error: GeolocationError): void => {
    // empty
  };
  const onOpenPopover = (): any => {
    if (searchInputRef && searchInputRef.current && suggestions.length > 0) {
      searchInputRef.current.focus();
    }
  };
  const onLayoutChange = (e: LayoutChangeEvent): void => {
    setPopoverWidth(e.nativeEvent.layout.width);
  };
  const popoverContent = (): React.ReactElement<Any> => {
    return (
      <PopupMenuOptions
        options={getAutoCompletionOptions()}
        onMenuOptionPress={handleSuggestionSelection}
        from="Search"
        autoDetect={onPressAutoDetect}
      />
    );
  };
  return (
    <Popover
      forwardedRef={popupRef}
      content={popoverContent}
      popupProps={{
        position: "bottom left",
        on: [],
        arrow: false,
        contentStyle: popupOptionStyle,
        closeOnDocumentClick: true,
        children: undefined,
        onOpen: onOpenPopover,
      }}
    >
      <SearchField
        forwardRef={searchInputRef}
        placeholder={t("property:searchProject")}
        value={searchText}
        updateValue={updateSearchValue}
        containerStyle={[styles.searchBar]}
        onLayoutChange={onLayoutChange}
      />
    </Popover>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    alignSelf: "stretch",
    width: "100%",
  },
});
// TODO - To resolve state persistent bug

// const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
//   const { setInitialFilters, setInitialState } = SearchActions;
//   return bindActionCreators(
//     {
//       setInitialFilters,
//       setInitialState,
//     },
//     dispatch
//   );
// };

// export default connect(mapStateToProps, mapDispatchToProps)(AutoCompletionSearchBar);
export default AutoCompletionSearchBar;
