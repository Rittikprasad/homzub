import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { remove } from "lodash";
// @ts-ignore
import Markdown from "react-native-easy-markdown";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";
import { IState } from "@homzhub/common/src/modules/interfaces";
import { SearchSelector } from "@homzhub/common/src/modules/search/selectors";
import { SearchActions } from "@homzhub/common/src/modules/search/actions";
import { UserSelector } from "@homzhub/common/src/modules/user/selectors";
import {
  AdvancedFilters,
  IAdvancedFilters,
  IFilterData,
} from "@homzhub/common/src/constants/AssetAdvancedFilters";
import { theme } from "@homzhub/common/src/styles/theme";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import {
  NavigationScreenProps,
  ScreensKeys,
} from "@homzhub/mobile/src/navigation/interfaces";
import { SearchStackParamList } from "@homzhub/mobile/src/navigation/SearchStack";
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
import { BottomSheet } from "@homzhub/common/src/components/molecules/BottomSheet";
import { MultipleButtonGroup } from "@homzhub/common/src/components/molecules/MultipleButtonGroup";
import { FilterDetail } from "@homzhub/common/src/domain/models/FilterDetail";
import { IFilter } from "@homzhub/common/src/domain/models/Search";
import { UserPreferences } from "@homzhub/common/src/domain/models/UserPreferences";
import { FurnishingTypes } from "@homzhub/common/src/constants/Terms";

interface IStateProps {
  filters: IFilter;
  filterDetails: FilterDetail | null;
  userPreference: UserPreferences;
}

interface IDispatchProps {
  setFilter: (payload: any) => void;
  setInitialState: () => void;
  getProperties: () => void;
  setInitialMiscellaneous: () => void;
  setInitialFilters: () => void;
}

interface IAssetFiltersState {
  isFacingToggled: boolean;
  isPropertyAmenitiesToggled: boolean;
  isShowVerifiedHelperToggled: boolean;
  isAgentListedHelperToggled: boolean;
  data: IAdvancedFilters;
}

type libraryProps = WithTranslation &
  NavigationScreenProps<SearchStackParamList, ScreensKeys.PropertyFilters>;
type Props = libraryProps & IStateProps & IDispatchProps;

const ShowInMvpRelease = false;

export class AssetFilters extends React.PureComponent<
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

  /* eslint-enable */
  constructor(props: Props) {
    super(props);

    this.state = {
      isFacingToggled: false,
      isPropertyAmenitiesToggled: false,
      isShowVerifiedHelperToggled: false,
      isAgentListedHelperToggled: false,
      data: AdvancedFilters,
    };
  }

  public render(): React.ReactElement {
    const {
      t,
      filters: { asset_group },
    } = this.props;
    return (
      <>
        <StatusBar
          translucent
          backgroundColor={theme.colors.white}
          barStyle="dark-content"
        />
        <SafeAreaView style={styles.container}>
          {this.renderHeader()}
          <ScrollView style={styles.flexOne}>
            <View style={styles.screen}>
              {this.renderTransactionType()}
              {ShowInMvpRelease && this.renderShowVerified()}
              {ShowInMvpRelease && this.renderAgentListed()}
              {this.renderSearchRadius()}
              {this.renderDateAdded()}
              {this.renderPropertyAge()}
              {asset_group === 2 && this.renderRentFreePeriod()}
              {this.renderMoveInDate()}
              {this.renderFacing()}
              {this.renderFurnishing()}
              {this.renderPropertyAmenities()}
              <Button
                type="primary"
                title={t("showProperties")}
                containerStyle={styles.buttonStyle}
                onPress={this.handleSubmit}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }

  public renderHeader = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <View style={styles.header}>
        <Icon
          name={icons.leftArrow}
          size={18}
          color={theme.colors.darkTint3}
          onPress={this.goBack}
        />
        <Text type="small" textType="semiBold">
          {t("filters")}
        </Text>
        <Text
          type="small"
          textType="semiBold"
          style={styles.reset}
          onPress={this.clearForm}
        >
          {t("reset")}
        </Text>
      </View>
    );
  };

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
      <>
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
          containerStyle={styles.dropdownContainer}
          numColumns={2}
        />
      </>
    );
  };

  public renderDateAdded = (): React.ReactElement => {
    const {
      t,
      filters: { miscellaneous },
    } = this.props;
    const {
      data: { dateAdded },
    } = this.state;
    const translatedDateAdded = this.translateData(dateAdded);

    const onSelectDateAdded = (value: string | number): void => {
      this.updateFilter(translatedDateAdded, value as number, "date_added");
    };

    return (
      <>
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
          containerStyle={styles.dropdownContainer}
          numColumns={2}
        />
      </>
    );
  };

  public renderPropertyAge = (): React.ReactElement => {
    const {
      t,
      filters: { miscellaneous },
    } = this.props;
    const {
      data: { propertyAge },
    } = this.state;
    const translatedPropertyAge = this.translateData(propertyAge);

    const onSelectPropertyAge = (value: string | number): void => {
      this.updateFilter(translatedPropertyAge, value as number, "property_age");
    };

    return (
      <>
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
          containerStyle={styles.dropdownContainer}
          numColumns={2}
        />
      </>
    );
  };

  public renderRentFreePeriod = (): React.ReactElement => {
    const {
      t,
      filters: { miscellaneous },
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
          containerStyle={styles.dropdownContainer}
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
    } = this.props;
    console.log("filters", miscellaneous);
    const updateSelectedDate = (day: string): void => {
      setFilter({
        miscellaneous: { ...filters.miscellaneous, expected_move_in_date: day },
      });
    };
    return (
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
      />
    );
  };

  public renderFacing = (): React.ReactElement | null => {
    const {
      t,
      filters: { miscellaneous },
    } = this.props;
    if (!miscellaneous) {
      return null;
    }
    const { facing } = miscellaneous;
    const { isFacingToggled } = this.state;
    const transformedFacing = this.transformFacingData();
    const toggleFacing = (): void =>
      this.setState({ isFacingToggled: !isFacingToggled });
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t("facing", { totalFacing: facing.length })}
        </Text>
        <View style={styles.moreRow}>
          <MultipleButtonGroup<string>
            data={transformedFacing.slice(0, 4) ?? []}
            onItemSelect={this.handleFacingSelection}
            selectedItem={facing}
          />
          {transformedFacing.length > 4 && (
            <Text
              type="small"
              textType="semiBold"
              style={styles.selectAmenity}
              onPress={toggleFacing}
            >
              {t("common:more")}
            </Text>
          )}
        </View>
        {isFacingToggled && (
          <BottomSheet
            isShadowView
            sheetHeight={theme.viewport.height * 0.6}
            headerTitle={t("selectFacing")}
            visible={isFacingToggled}
            onCloseSheet={toggleFacing}
          >
            <ScrollView style={styles.flexOne}>
              <CheckboxGroup
                data={this.facingCheckboxGroupData(facing)}
                onToggle={this.handleFacingSelection}
                containerStyle={styles.checkboxGroupContainer}
              />
            </ScrollView>
          </BottomSheet>
        )}
      </>
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
    } = this.props;
    if (!miscellaneous) {
      return null;
    }
    const { propertyAmenity } = miscellaneous;
    const { isPropertyAmenitiesToggled } = this.state;
    const toggleAmenities = (): void =>
      this.setState({
        isPropertyAmenitiesToggled: !isPropertyAmenitiesToggled,
      });
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t("propertyAmenities", { totalAmenities: propertyAmenity.length })}
        </Text>
        {this.renderPropertyAmenitiesGroupData()}
        <Text
          type="small"
          textType="semiBold"
          style={styles.selectAmenity}
          onPress={toggleAmenities}
        >
          {propertyAmenity.length > 0 ? t("common:more") : t("common:select")}
        </Text>
        {isPropertyAmenitiesToggled && (
          <BottomSheet
            isShadowView
            sheetHeight={theme.viewport.height * 0.6}
            headerTitle={t("selectAmenities")}
            visible={isPropertyAmenitiesToggled}
            onCloseSheet={toggleAmenities}
          >
            <ScrollView style={styles.flexOne}>
              {this.renderAmenitiesData(propertyAmenity)}
            </ScrollView>
          </BottomSheet>
        )}
      </>
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
    const { setFilter, filters } = this.props;
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
      <CheckboxGroup
        data={this.amenityCheckboxGroupData()}
        onToggle={onSelectedAmenities}
        containerStyle={styles.checkboxGroupContainer}
      />
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
          <RNSwitch selected={showVerified} onToggle={updateVerified} />
        </View>
        {isShowVerifiedHelperToggled && (
          <BottomSheet
            visible={isShowVerifiedHelperToggled}
            onCloseSheet={toggleHelper}
            headerTitle="Show Verified"
            sheetHeight={500}
            isShadowView
          >
            <Markdown
              markdownStyles={{
                h2: { fontWeight: "600", fontSize: 20, marginVertical: 10 },
                h4: {
                  fontWeight: "300",
                  fontSize: 24,
                  color: theme.colors.darkTint2,
                },
                strong: { fontWeight: "600", fontSize: 16 },
                text: { fontWeight: "normal", fontSize: 14 },
              }}
              style={{ margin: theme.layout.screenPadding }}
            >
              Show Verified helper text
            </Markdown>
          </BottomSheet>
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
          <RNSwitch selected={agentListed} onToggle={updateAgentListed} />
        </View>
        {isAgentListedHelperToggled && (
          <BottomSheet
            visible={isAgentListedHelperToggled}
            onCloseSheet={toggleHelper}
            headerTitle="Agent Listed"
            sheetHeight={500}
            isShadowView
          >
            <Markdown
              markdownStyles={{
                h2: { fontWeight: "600", fontSize: 20, marginVertical: 10 },
                h4: {
                  fontWeight: "300",
                  fontSize: 24,
                  color: theme.colors.darkTint2,
                },
                strong: { fontWeight: "600", fontSize: 16 },
                text: { fontWeight: "normal", fontSize: 14 },
              }}
              style={{ margin: theme.layout.screenPadding }}
            >
              Agent Listed helper text
            </Markdown>
          </BottomSheet>
        )}
      </>
    );
  };

  public onToggleTransactionType = (value: number): void => {
    const { setFilter, setInitialFilters } = this.props;
    setInitialFilters();
    setFilter({ asset_transaction_type: value });
  };

  private handleSubmit = (): void => {
    const { getProperties, navigation, setFilter } = this.props;
    setFilter({ offset: 0 });
    getProperties();
    navigation.goBack();
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
    return facingData.map((facingType: { name: string; label: string }) => ({
      id: facingType.name,
      label: facingType.label,
      isSelected: facing.includes(facingType.name),
    }));
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

  public goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
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
    setFilter,
    setInitialState,
    getProperties,
    setInitialMiscellaneous,
    setInitialFilters,
  } = SearchActions;
  return bindActionCreators(
    {
      setFilter,
      setInitialState,
      getProperties,
      setInitialMiscellaneous,
      setInitialFilters,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.propertySearch)(AssetFilters));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  flexOne: {
    flex: 1,
  },
  screen: {
    flex: 1,
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: theme.layout.screenPadding,
  },
  header: {
    margin: theme.layout.screenPadding,
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  reset: {
    flex: 0,
    borderWidth: 0,
    color: theme.colors.primaryColor,
  },
  filterHeader: {
    paddingVertical: 10,
    color: theme.colors.darkTint3,
  },
  agentListed: {
    color: theme.colors.darkTint3,
  },
  buttonStyle: {
    flex: 0,
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
  },
  checkboxGroupContainer: {
    margin: theme.layout.screenPadding,
  },
  dropdownContainer: {
    marginVertical: 10,
  },
  helperIcon: {
    marginStart: 8,
  },
  buttonItemStyle: {
    marginEnd: 4,
  },
});
