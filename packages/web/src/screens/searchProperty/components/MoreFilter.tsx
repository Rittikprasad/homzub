import React from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { History } from "history";
import { bindActionCreators, Dispatch } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { remove } from "lodash";
// @ts-ignore
import Markdown from "react-native-easy-markdown";
import Popup from "reactjs-popup";
import {
  IWithMediaQuery,
  withMediaQuery,
} from "@homzhub/common/src/utils/MediaQueryUtils";
import { RouteNames } from "@homzhub/web/src/router/RouteNames";
import { SearchSelector } from "@homzhub/common/src/modules/search/selectors";
import { SearchActions } from "@homzhub/common/src/modules/search/actions";
import { UserSelector } from "@homzhub/common/src/modules/user/selectors";
import { theme } from "@homzhub/common/src/styles/theme";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import { Dropdown } from "@homzhub/common/src/components/atoms/Dropdown";
import { RNSwitch } from "@homzhub/common/src/components/atoms/Switch";
import { SelectionPicker } from "@homzhub/common/src/components/atoms/SelectionPicker";
import { Text } from "@homzhub/common/src/components/atoms/Text";
import {
  CheckboxGroup,
  ICheckboxGroupData,
} from "@homzhub/common/src/components/molecules/CheckboxGroup";
import { FormCalendar } from "@homzhub/common/src/components/molecules/FormCalendar";
import { MultipleButtonGroup } from "@homzhub/common/src/components/molecules/MultipleButtonGroup";
import { FilterDetail } from "@homzhub/common/src/domain/models/FilterDetail";
import { IFilter } from "@homzhub/common/src/domain/models/Search";
import { UserPreferences } from "@homzhub/common/src/domain/models/UserPreferences";
import { IUnit } from "@homzhub/common/src/domain/models/Unit";
import {
  AdvancedFilters,
  IAdvancedFilters,
  IFilterData,
} from "@homzhub/common/src/constants/AssetAdvancedFilters";
import { FurnishingTypes } from "@homzhub/common/src/constants/Terms";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";
import { IState } from "@homzhub/common/src/modules/interfaces";

interface IStateProps {
  filters: IFilter;
  filterDetails: FilterDetail | null;
  userPreference: UserPreferences;
}

interface IDispatchProps {
  getFilterDetails: (payload: IFilter) => void;
  setFilter: (payload: any) => void;
  setInitialState: () => void;
  getProperties: () => void;
  setInitialMiscellaneous: () => void;
}

interface IAssetFiltersState {
  isPropertyAmenitiesToggled: boolean;
  isShowVerifiedHelperToggled: boolean;
  isAgentListedHelperToggled: boolean;
  data: IAdvancedFilters;
}

interface IFilerProps {
  closePopover: () => void;
  history: History;
}

interface IMiscellaneousFilters {
  show_verified: boolean;
  agent_listed: boolean;
  search_radius: IUnit;
  date_added: IUnit;
  property_age: IUnit;
  rent_free_period: IUnit;
  expected_move_in_date: string;
  facing: string[];
  furnishing: FurnishingTypes[];
  propertyAmenity: number[];
  search_radius_unit: string;
}

type Props = IStateProps &
  IDispatchProps &
  WithTranslation &
  IWithMediaQuery &
  IFilerProps;

const ShowInMvpRelease = false;

export class MoreFilters extends React.PureComponent<
  Props,
  IAssetFiltersState
> {
  /*eslint-disable */
  private FURNISHING = [
    {
      title: this.props.t("property:fullyFurnished"),
      value: FurnishingTypes.FULL,
    },
    {
      title: this.props.t("property:semiFurnished"),
      value: FurnishingTypes.SEMI,
    },
    { title: this.props.t("property:none"), value: FurnishingTypes.NONE },
  ];

  public searchParams = "";

  /* eslint-enable */
  constructor(props: Props) {
    super(props);

    this.state = {
      isPropertyAmenitiesToggled: false,
      isShowVerifiedHelperToggled: false,
      isAgentListedHelperToggled: false,
      data: AdvancedFilters,
    };
  }

  public componentDidMount = (): void => {
    const { getFilterDetails, filters, history } = this.props;
    this.searchParams = history.location.search;
    getFilterDetails({ asset_group: filters.asset_group });
  };

  public render(): React.ReactElement {
    const {
      t,
      filters: { asset_group },
      isTablet,
      isOnlyTablet,
      isMobile,
      closePopover,
    } = this.props;
    return (
      <>
        <View>
          <Icon
            name={icons.close}
            style={styles.iconStyle}
            onPress={closePopover}
          />
        </View>
        <View style={styles.screen}>
          <View style={styles.mainContainer}>
            {this.renderSearchRadius()}
            {this.renderDateAdded()}
            {this.renderPropertyAge()}
            {asset_group === 2 && this.renderRentFreePeriod()}
            {this.renderMoveInDate()}
            <View
              style={[
                styles.facingViewContainer,
                isTablet && styles.facingTabView,
              ]}
            >
              {this.renderFacing()}
            </View>
            <View
              style={[
                styles.container,
                isOnlyTablet && styles.furnishingTabView,
              ]}
            >
              {this.renderFurnishing()}
            </View>
            <View
              style={[styles.verifiedContainer, isMobile && styles.container]}
            >
              {ShowInMvpRelease && this.renderShowVerified()}
              {ShowInMvpRelease && this.renderAgentListed()}
            </View>
            <View
              style={[
                styles.propertyAmenityContainer,
                isTablet && styles.facingTabView,
              ]}
            >
              {this.renderPropertyAmenities()}
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Text
            type="small"
            textType="semiBold"
            style={styles.reset}
            onPress={this.clearForm}
          >
            {t("reset")}
          </Text>
          <View style={styles.submitButton}>
            <Button
              type="primary"
              title={t("showProperties")}
              containerStyle={styles.buttonStyle}
              onPress={this.handleSubmit}
              titleStyle={styles.buttonTitleStyle}
            />
          </View>
        </View>
      </>
    );
  }

  public renderTransactionType = (): React.ReactElement => {
    const {
      t,
      filters: { asset_transaction_type },
    } = this.props;
    const transactionData = [
      { title: t("rent"), value: 0 },
      { title: t("buy"), value: 1 },
    ];
    return (
      <SelectionPicker
        data={transactionData}
        selectedItem={[asset_transaction_type || 0]}
        onValueChange={this.onToggleTransactionType}
      />
    );
  };

  public renderSearchRadius = (): React.ReactNode => {
    const {
      t,
      filters: { miscellaneous },
      isMobile,
    } = this.props;
    const {
      data: { searchRadius },
    } = this.state;
    const translatedSearchRadius = this.translateData(searchRadius);
    const onSelectSearchRadius = (value: string | number): void => {
      this.updateFilter(
        translatedSearchRadius,
        value as number,
        "search_radius"
      );
    };

    return (
      <View style={styles.dropdownContainer}>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t("searchRadius")}
        </Text>
        <Dropdown
          data={translatedSearchRadius}
          value={miscellaneous?.search_radius.id || 0}
          listTitle={t("selectSearchRadius")}
          placeholder={t("selectRadius")}
          listHeight={theme.viewport.height / 2}
          onDonePress={onSelectSearchRadius}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={[styles.dropdown, isMobile && styles.dropdownMobile]}
          numColumns={2}
        />
      </View>
    );
  };

  public renderDateAdded = (): React.ReactElement => {
    const {
      t,
      filters: { miscellaneous },
      isMobile,
    } = this.props;
    const {
      data: { dateAdded },
    } = this.state;
    const translatedDateAdded = this.translateData(dateAdded);

    const onSelectDateAdded = (value: string | number): void => {
      this.updateFilter(translatedDateAdded, value as number, "date_added");
    };

    return (
      <View style={styles.dropdownContainer}>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t("dateAdded")}
        </Text>
        <Dropdown
          data={translatedDateAdded}
          value={miscellaneous?.date_added.id || 0}
          listTitle={t("selectDateAdded")}
          placeholder={t("selectDateAdded")}
          listHeight={theme.viewport.height / 2}
          onDonePress={onSelectDateAdded}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={[styles.dropdown, isMobile && styles.dropdownMobile]}
          numColumns={2}
        />
      </View>
    );
  };

  public renderPropertyAge = (): React.ReactElement => {
    const {
      t,
      filters: { miscellaneous },
      isMobile,
    } = this.props;
    const {
      data: { propertyAge },
    } = this.state;
    const translatedPropertyAge = this.translateData(propertyAge);

    const onSelectPropertyAge = (value: string | number): void => {
      this.updateFilter(translatedPropertyAge, value as number, "property_age");
    };

    return (
      <View style={styles.dropdownContainer}>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t("propertyAge")}
        </Text>
        <Dropdown
          data={translatedPropertyAge}
          value={miscellaneous?.property_age.id || 0}
          listTitle={t("selectPropertyAge")}
          placeholder={t("selectPropertyAge")}
          listHeight={theme.viewport.height / 2}
          onDonePress={onSelectPropertyAge}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={[styles.dropdown, isMobile && styles.dropdownMobile]}
          numColumns={2}
        />
      </View>
    );
  };

  public renderRentFreePeriod = (): React.ReactElement => {
    const {
      t,
      filters: { miscellaneous },
      isMobile,
    } = this.props;
    const {
      data: { rentFreePeriod },
    } = this.state;
    const translatedRentFreePeriod = this.translateData(rentFreePeriod);
    const onSelectRentFreePeriod = (value: string | number): void => {
      this.updateFilter(
        translatedRentFreePeriod,
        value as number,
        "rent_free_period"
      );
    };

    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t("rentFreePeriod")}
        </Text>
        <Dropdown
          data={translatedRentFreePeriod}
          value={miscellaneous?.rent_free_period.id || 0}
          listTitle={t("selectRentFreePeriod")}
          placeholder={t("selectRentFreePeriod")}
          listHeight={theme.viewport.height / 2}
          onDonePress={onSelectRentFreePeriod}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={[styles.dropdown, isMobile && styles.dropdownMobile]}
          numColumns={2}
        />
      </>
    );
  };

  public renderMoveInDate = (): React.ReactElement => {
    const {
      t,
      setFilter,
      filters,
      filters: { miscellaneous },
      isMobile,
      isTablet,
    } = this.props;
    const updateSelectedDate = (day: string): void => {
      setFilter({
        miscellaneous: { ...filters.miscellaneous, expected_move_in_date: day },
      });
    };
    console.log("this is coming from here");
    return (
      <View
        style={[
          styles.calendarDropdown,
          isTablet && styles.calendarDropdownTablet,
        ]}
      >
        <FormCalendar
          selectedValue={miscellaneous?.expected_move_in_date}
          name="expected_move_in_date"
          label={t("expectedMoveInDate")}
          calendarTitle={t("expectedMoveInDate")}
          placeHolder={t("selectMoveInDate")}
          textType="text"
          textSize="small"
          fontType="semiBold"
          bubbleSelectedDate={updateSelectedDate}
          containerStyle={isMobile && styles.dropdownMobile}
          dateContainerStyle={styles.dateStyle}
        />
      </View>
    );
  };

  public renderFacing = (): React.ReactElement | null => {
    const {
      t,
      filters: { miscellaneous },
      isTablet,
    } = this.props;
    if (!miscellaneous) {
      return null;
    }
    const { facing } = miscellaneous;
    const transformedFacing = this.facingCheckboxGroupData(facing);
    return (
      <View
        style={[
          styles.facingViewSubContainer,
          isTablet && styles.facingTabView,
        ]}
      >
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t("facing", { totalFacing: facing.length })}
        </Text>
        <View>
          <CheckboxGroup
            data={transformedFacing}
            onToggle={this.handleFacingSelection}
            containerStyle={[
              styles.checkboxGroupContainer,
              isTablet && styles.checkboxGroupContainerTabView,
            ]}
          />
        </View>
      </View>
    );
  };

  public renderFurnishing = (): React.ReactElement | null => {
    const {
      t,
      setFilter,
      filters,
      filters: { miscellaneous },
    } = this.props;
    if (!miscellaneous) {
      return null;
    }
    const { furnishing } = miscellaneous;

    const handleFurnishingSelection = (value: FurnishingTypes): void => {
      if (furnishing.includes(value)) {
        remove(furnishing, (type: FurnishingTypes) => type === value);
        setFilter({ miscellaneous: { ...filters.miscellaneous, furnishing } });
      } else {
        const newFurnishing = furnishing.concat(value);
        setFilter({
          miscellaneous: {
            ...filters.miscellaneous,
            furnishing: newFurnishing,
          },
        });
      }
    };
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t("furnishing", { totalFurnishing: furnishing.length })}
        </Text>
        <View style={styles.moreRow}>
          <MultipleButtonGroup<FurnishingTypes>
            data={this.FURNISHING}
            onItemSelect={handleFurnishingSelection}
            selectedItem={furnishing}
          />
        </View>
      </>
    );
  };

  public renderPropertyAmenities = (): React.ReactElement | null => {
    const {
      t,
      filters: { miscellaneous },
      isTablet,
    } = this.props;
    if (!miscellaneous) {
      return null;
    }
    const { propertyAmenity } = miscellaneous;
    return (
      <View
        style={[
          styles.propertyAmenitySubContainer,
          isTablet && styles.facingTabView,
        ]}
      >
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t("propertyAmenities", { totalAmenities: propertyAmenity.length })}
        </Text>
        <View style={styles.propertyAmenity}>
          {this.renderAmenitiesData(propertyAmenity)}
        </View>
      </View>
    );
  };

  public renderPropertyAmenitiesGroupData = (): React.ReactNode => {
    const {
      filterDetails,
      setFilter,
      filters,
      filters: { miscellaneous },
    } = this.props;
    if (!miscellaneous) {
      return null;
    }

    const { propertyAmenity } = miscellaneous;

    const propertyAmenities =
      filterDetails?.filters?.additionalFilters?.propertyAmenities ?? [];
    const findSelectedAmenities = (): { title: string; value: number }[] => {
      const selectedAmenities: { title: string; value: number }[] = [];
      const filteredArray = propertyAmenities.filter((amenity) =>
        propertyAmenity.includes(amenity.id)
      );
      filteredArray.forEach((obj) => {
        selectedAmenities.push({
          title: obj.name,
          value: obj.id,
        });
      });
      return selectedAmenities;
    };

    const handleDeselectAmenities = (value: number): void => {
      const amenityIndex = propertyAmenity.indexOf(value);
      if (amenityIndex !== -1) {
        const updatedAmenities = propertyAmenity.splice(0, amenityIndex);
        setFilter({
          miscellaneous: {
            ...filters.miscellaneous,
            propertyAmenity: updatedAmenities,
          },
        });
      }
    };
    if (propertyAmenity.length === 0) {
      return null;
    }
    return (
      <MultipleButtonGroup<number>
        data={propertyAmenity.length > 0 ? findSelectedAmenities() : []}
        onItemSelect={handleDeselectAmenities}
        selectedItem={propertyAmenity}
        buttonItemStyle={styles.buttonItemStyle}
      />
    );
  };

  public renderAmenitiesData = (
    propertyAmenity: number[]
  ): React.ReactElement => {
    const { setFilter, filters, t, isTablet, isMobile, isIpadPro } = this.props;
    const { isPropertyAmenitiesToggled } = this.state;
    const toggleAmenities = (): void =>
      this.setState({
        isPropertyAmenitiesToggled: !isPropertyAmenitiesToggled,
      });
    const onSelectedAmenities = (value: number | string): void => {
      const existingAmenity: number[] = propertyAmenity;
      if (existingAmenity.includes(value as number)) {
        remove(existingAmenity, (count: number) => count === value);
        setFilter({
          miscellaneous: {
            ...filters.miscellaneous,
            propertyAmenity: existingAmenity,
          },
        });
      } else {
        const newAmenity = existingAmenity.concat(value as number);
        setFilter({
          miscellaneous: {
            ...filters.miscellaneous,
            propertyAmenity: newAmenity,
          },
        });
      }
    };
    return (
      <View style={styles.amenitieCheckboxContainer}>
        <CheckboxGroup
          data={
            isPropertyAmenitiesToggled
              ? this.amenityCheckboxGroupData()
              : this.amenityCheckboxGroupData().slice(0, 11)
          }
          onToggle={onSelectedAmenities}
          containerStyle={[
            styles.checkboxGroupContainer,
            isTablet && styles.checkboxGroupContainerTabView,
          ]}
        />
        {!isPropertyAmenitiesToggled && (
          <View
            style={[
              styles.moreButton,
              isMobile && styles.moreButtonMobile,
              isIpadPro && styles.moreButtonIPad,
            ]}
          >
            <Text
              type="small"
              textType="semiBold"
              style={styles.selectAmenity}
              onPress={toggleAmenities}
            >
              {t("common:more")}
            </Text>
          </View>
        )}
      </View>
    );
  };

  public renderShowVerified = (): React.ReactElement | null => {
    const {
      t,
      setFilter,
      filters,
      filters: { miscellaneous },
    } = this.props;
    if (!miscellaneous) {
      return null;
    }
    const { show_verified: showVerified } = miscellaneous;
    const { isShowVerifiedHelperToggled } = this.state;
    const updateVerified = (): void =>
      setFilter({
        miscellaneous: {
          ...filters.miscellaneous,
          show_verified: !showVerified,
        },
      });
    const toggleHelper = (): void =>
      this.setState({
        isShowVerifiedHelperToggled: !isShowVerifiedHelperToggled,
      });
    return (
      <>
        <View style={styles.toggleButton}>
          <View style={styles.moreRow}>
            <View style={styles.verified}>
              <Text type="small" textType="semiBold" style={styles.agentListed}>
                {t("showVerified")}
              </Text>
              <Icon
                name={icons.tooltip}
                color={theme.colors.blue}
                size={22}
                style={styles.helperIcon}
                onPress={toggleHelper}
              />
            </View>
          </View>
          <View style={styles.switchContainer}>
            <RNSwitch selected={showVerified} onToggle={updateVerified} />
          </View>
        </View>
        {isShowVerifiedHelperToggled && (
          <Popup
            position="right center"
            closeOnDocumentClick
            open={isShowVerifiedHelperToggled}
          >
            <Markdown
              markdownStyles={customStyles}
              style={{ margin: theme.layout.screenPadding }}
            >
              Show Verified helper text
            </Markdown>
          </Popup>
        )}
      </>
    );
  };

  public renderAgentListed = (): React.ReactElement | null => {
    const {
      t,
      setFilter,
      filters,
      filters: { miscellaneous },
    } = this.props;
    if (!miscellaneous) {
      return null;
    }
    const { agent_listed: agentListed } = miscellaneous;
    const { isAgentListedHelperToggled } = this.state;
    const updateAgentListed = (): void =>
      setFilter({
        miscellaneous: { ...filters.miscellaneous, agent_listed: !agentListed },
      });
    const toggleHelper = (): void =>
      this.setState({
        isAgentListedHelperToggled: !isAgentListedHelperToggled,
      });
    return (
      <>
        <View style={styles.toggleButton}>
          <View style={styles.moreRow}>
            <View style={styles.verified}>
              <Text type="small" textType="semiBold" style={styles.agentListed}>
                {t("agentListed")}
              </Text>
              <Icon
                name={icons.tooltip}
                color={theme.colors.blue}
                size={22}
                style={styles.helperIcon}
                onPress={toggleHelper}
              />
            </View>
          </View>
          <RNSwitch selected={agentListed} onToggle={updateAgentListed} />
        </View>
        {isAgentListedHelperToggled && (
          <Popup
            position="right center"
            closeOnDocumentClick
            open={isAgentListedHelperToggled}
          >
            <Markdown
              markdownStyles={customStyles}
              style={{ margin: theme.layout.screenPadding }}
            >
              Agent Listed helper text
            </Markdown>
          </Popup>
        )}
      </>
    );
  };

  public onToggleTransactionType = (value: number): void => {
    const { setFilter } = this.props;
    setFilter({ asset_transaction_type: value });
  };

  private handleSubmit = (): void => {
    const { getProperties, setFilter, closePopover, filters, history } =
      this.props;
    setFilter({ offset: 0 });
    const searchParams = new URLSearchParams(history.location.search);
    if (filters.miscellaneous) {
      const searchFilters: IMiscellaneousFilters = filters.miscellaneous;
      const objectEntries = Object.entries(searchFilters);
      for (let i = 0; i < objectEntries.length; i++) {
        searchParams.set(objectEntries[i][0], objectEntries[i][1].toString());
      }
    }
    const updatedSearchParams = searchParams.toString();

    history.push(
      `${RouteNames.protectedRoutes.SEARCH_PROPERTY}?${updatedSearchParams}`
    );
    getProperties();

    closePopover();
  };

  public translateData = (data: IFilterData[]): IFilterData[] => {
    const { t, userPreference } = this.props;
    return data.map((currentData: IFilterData) => {
      return {
        value: currentData.value,
        label: t(currentData.label, {
          metric: userPreference ? userPreference.metricUnit : "km",
        }),
      };
    });
  };

  public updateFilter = (
    data: IFilterData[],
    value: number,
    key: string
  ): void => {
    const { setFilter, filters } = this.props;
    const selectedData = data.find((item) => item.value === value);
    if (selectedData) {
      setFilter({
        miscellaneous: {
          ...filters.miscellaneous,
          [key]: { id: selectedData.value, label: selectedData.label },
        },
      });
    }
  };

  public transformFacingData = (): { title: string; value: string }[] => {
    const { filterDetails } = this.props;
    const facingData = filterDetails?.filters?.additionalFilters?.facing ?? [];
    const transformedFacing: { title: string; value: string }[] = [];
    facingData.forEach((data) => {
      transformedFacing.push({
        title: data.label,
        value: data.name,
      });
    });
    return transformedFacing;
  };

  public facingCheckboxGroupData = (facing: string[]): ICheckboxGroupData[] => {
    const { filterDetails } = this.props;
    const facingData = filterDetails?.filters?.additionalFilters?.facing ?? [];
    return facingData.map(
      (facingType: { name: string; label: string; title: string }) => ({
        id: facingType.name,
        label: facingType.label,
        isSelected: facing.includes(facingType.name),
      })
    );
  };

  public handleFacingSelection = (value: string | number): void => {
    const {
      filters,
      setFilter,
      filters: { miscellaneous },
    } = this.props;
    if (!miscellaneous) {
      return;
    }

    const { facing: existingFacing } = miscellaneous;

    if (existingFacing.includes(value as string)) {
      remove(existingFacing, (facing: string) => facing === value);
      setFilter({
        miscellaneous: { ...filters.miscellaneous, facing: existingFacing },
      });
    } else {
      const newFacing = existingFacing.concat(value as string);
      setFilter({
        miscellaneous: { ...filters.miscellaneous, facing: newFacing },
      });
    }
  };

  public amenityCheckboxGroupData = (): ICheckboxGroupData[] => {
    const {
      filterDetails,
      filters: { miscellaneous },
    } = this.props;
    const propertyAmenitiesData =
      filterDetails?.filters?.additionalFilters?.propertyAmenities ?? [];
    return propertyAmenitiesData.map(
      (amenityType: { name: string; id: number }) => ({
        id: amenityType.id,
        label: amenityType.name,
        isSelected:
          miscellaneous?.propertyAmenity.includes(amenityType.id) || false,
      })
    );
  };

  public clearForm = (): void => {
    const { setInitialMiscellaneous } = this.props;
    setInitialMiscellaneous();
  };

  public goBack = (): void => {};
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getFilters, getFilterDetail } = SearchSelector;
  return {
    filters: getFilters(state),
    filterDetails: getFilterDetail(state),
    userPreference: UserSelector.getUserPreferences(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const {
    getFilterDetails,
    setFilter,
    setInitialState,
    getProperties,
    setInitialMiscellaneous,
  } = SearchActions;
  return bindActionCreators(
    {
      getFilterDetails,
      setFilter,
      setInitialState,
      getProperties,
      setInitialMiscellaneous,
    },
    dispatch
  );
};

const translatedMoreFilters = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.propertySearch)(MoreFilters));

export default withMediaQuery<any>(translatedMoreFilters);

const customStyles = {
  h2: { fontWeight: "600", fontSize: 20, marginVertical: 10 },
  h4: { fontWeight: "300", fontSize: 24, color: theme.colors.darkTint2 },
  strong: { fontWeight: "600", fontSize: 16 },
  text: { fontWeight: "normal", fontSize: 14 },
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  container: {
    width: "100%",
    marginLeft: 6,
  },
  flexOne: {
    flex: 1,
  },
  screen: {
    flex: 1,
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: theme.layout.screenPadding,
    flexWrap: "wrap",
    height: 380,
    overflowY: "scroll",
    overflowX: "hidden",
  },
  header: {
    margin: theme.layout.screenPadding,
    marginTop: 30,
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  reset: {
    flex: 0,
    borderWidth: 0,
    color: theme.colors.primaryColor,
    alignSelf: "center",
  },
  filterHeader: {
    marginTop: 10,
    color: theme.colors.darkTint3,
  },
  agentListed: {
    color: theme.colors.darkTint3,
  },
  buttonStyle: {
    flex: 0,
    width: 160,
    marginVertical: 16,
  },
  toggleButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  selectAmenity: {
    color: theme.colors.primaryColor,
  },
  moreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    flex: 1,
    marginTop: 12,
  },
  checkboxGroupContainer: {
    width: 152,
    marginRight: 16,
  },
  checkboxGroupContainerTabView: {
    width: 152,
    marginRight: 0,
  },
  dropdownContainer: {
    flexDirection: "column",
    marginLeft: 4,
  },
  dropdown: {
    width: 317,
    height: 48,
    marginVertical: 10,
    marginHorizontal: 2,
  },
  calendarDropdown: {
    width: 317,
    marginTop: 30,
    marginLeft: 4,
  },
  calendarDropdownTablet: {
    margin: 0,
  },
  dropdownMobile: {
    width: theme.viewport.width - 80,
  },
  helperIcon: {
    marginStart: 8,
  },
  buttonItemStyle: {
    marginEnd: 4,
  },
  amnetiesTabView: {
    flexDirection: "column",
  },
  facingViewContainer: {
    width: "65%",
    marginTop: 16,
  },
  facingViewSubContainer: {
    flexDirection: "column",
    flex: 1,
    marginTop: 24,
    marginLeft: 15,
  },
  facingTabView: {
    width: "100%",
    marginLeft: 0,
    marginTop: 30,
  },
  furnishingTabView: {
    width: "50%",
    marginTop: 30,
  },

  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
  },
  submitButton: {
    marginHorizontal: 30,
  },
  propertyAmenityContainer: { width: "65%", marginLeft: 50 },
  propertyAmenitySubContainer: {
    flexDirection: "column",
    marginLeft: 20,
  },
  propertyAmenity: { flexDirection: "row", flexWrap: "wrap" },
  amenitieCheckboxContainer: {
    overflow: "hidden",
    flexDirection: "row",
    flex: 1,
    width: "100%",
    marginTop: 16,
  },
  moreButton: {
    position: "absolute",
    right: 150,
    top: 105,
    justifyContent: "flex-end",
  },
  moreButtonMobile: {
    position: "absolute",
    right: "30%",
    top: "86%",
    justifyContent: "flex-end",
  },
  moreButtonIPad: {
    position: "absolute",
    right: 150,
    top: 150,
    justifyContent: "flex-end",
  },
  verifiedContainer: {
    flexDirection: "column",
    width: "28%",
  },
  verified: {
    flexDirection: "row",
  },
  switchContainer: {
    marginTop: 10,
  },
  iconStyle: {
    flex: 1,
    alignSelf: "flex-end",
    fontSize: 24,
    marginRight: 12,
    marginBottom: 12,
  },
  buttonTitleStyle: {
    marginHorizontal: 0,
  },
  dateStyle: {
    marginTop: 4,
  },
});
