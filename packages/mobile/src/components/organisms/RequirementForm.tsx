import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import { AlertHelper } from "@homzhub/common/src/utils/AlertHelper";
import { DateUtils } from "@homzhub/common/src/utils/DateUtils";
import { ErrorUtils } from "@homzhub/common/src/utils/ErrorUtils";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import { SearchRepository } from "@homzhub/common/src/domain/repositories/SearchRepository";
import { SearchActions } from "@homzhub/common/src/modules/search/actions";
import { CommonSelectors } from "@homzhub/common/src/modules/common/selectors";
import { SearchSelector } from "@homzhub/common/src/modules/search/selectors";
import { SelectionPicker } from "@homzhub/common/src/components/atoms/SelectionPicker";
import { TextArea } from "@homzhub/common/src/components/atoms/TextArea";
import { Range } from "@homzhub/common/src/components/molecules/Range";
import { RoomsFilter } from "@homzhub/common/src/components/molecules/RoomsFilter";
import { FormCalendar } from "@homzhub/common/src/components/molecules/FormCalendar";
import LocalityCard from "@homzhub/mobile/src/components/molecules/LocalityCard";
import AssetTypeFilter from "@homzhub/common/src/components/organisms/AssetTypeFilter";
import { FilterDetail } from "@homzhub/common/src/domain/models/FilterDetail";
import { ISearchRequirementPayload } from "@homzhub/common/src/domain/repositories/interfaces";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";
import moment from "moment";

interface IProps {
  onAddLocation: () => void;
  onSubmit: () => void;
}

const RequirementForm = ({
  onAddLocation,
  onSubmit,
}: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertySearch);
  const dispatch = useDispatch();
  const filterData = useSelector(SearchSelector.getFilterDetail);
  const filters = useSelector(SearchSelector.getFilters);
  const priceRange = useSelector(SearchSelector.getPriceRange);
  const localities = useSelector(SearchSelector.getLocalities);
  const countryData = useSelector(CommonSelectors.getCountryList);

  // TODO: (Shikha) Remove after commercial integration
  const [filterDetails, setFilterDetails] = useState<FilterDetail>();
  // REMOVE END

  const [transactionType, setTransactionType] = useState(
    filters.asset_transaction_type
  );
  const [assetGroup, setAssetGroup] = useState(1);
  const [comment, setComment] = useState("");
  const [assetType, setAssetType] = useState<number[]>(
    filters.asset_type ?? []
  );
  const [bedCount, setBedCount] = useState<number[]>(
    filters.room_count && filters.room_count.length > 0
      ? filters.room_count
      : [-1]
  );

  const [isRangeUpdate, setRangeUpdate] = useState(false);
  const [price, setPriceRange] = useState({
    min: filters.min_price ?? 0,
    max: filters.max_price ?? 0,
  });
  const [minPrice, setMinPrice] = useState<number>(filters.min_price ?? 0);
  const [maxPrice, setMaxPrice] = useState<number>(filters.max_price ?? 0);
  const [moveInDate, setMoveInDate] = useState(
    DateUtils.getDisplayDate(moment().format("MMM DD,YYYY"), "MMM DD, YYYY")
  );

  const transactionData = [
    { title: t("rent"), value: 0 },
    { title: t("buy"), value: 1 },
  ];

  const country = countryData.find(
    (item) => item.currencies[0].currencyCode === filters.currency_code
  );
  // @ts-ignore
  const currencySymbol =
    country?.currencies[0].currencySymbol ??
    filterData?.currency[0].currency_symbol;

  useEffect(() => {
    // TODO: (Shikha) Remove after commercial integration
    SearchRepository.getFilterDetails({ asset_group: 1 })
      .then((res) => {
        setFilterDetails(res);
      })
      .catch((err) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      });
    // REMOVE END

    if (filters.search_address) {
      dispatch(
        SearchActions.setLocalities([
          {
            latitude: filters.search_latitude ?? 0,
            longitude: filters.search_longitude ?? 0,
            name: filters.search_address,
          },
        ])
      );
    }
  }, []);

  useEffect(() => {
    if (isRangeUpdate) {
      setPriceRange({ min: -1, max: -1 });
    }
  }, [filters]);

  const onSaveDetails = async (): Promise<void> => {
    const payload: ISearchRequirementPayload = {
      min_budget: minPrice,
      max_budget: maxPrice,
      asset_types: assetType,
      search_txn_type: transactionType === 0 ? "RENT" : "BUY",
      preferred_location: localities,
      bhk: isEqual(bedCount, [-1]) ? [] : bedCount,
      available_from_date: DateUtils.getUtcFormatted(
        moveInDate,
        "MMM DD, YYYY"
      ),
      user_location_latitude: filters.user_location_latitude,
      user_location_longitude: filters.user_location_longitude,
      comments: comment,
    };
    try {
      await SearchRepository.addSearchRequirement(payload);
      onSubmit();
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  const updateFilter = (type: string, value: number | number[]): void => {
    switch (type) {
      case "asset_group":
        dispatch(
          SearchActions.getFilterDetails({ asset_group: value as number })
        );
        setAssetGroup(value as number);
        break;
      case "asset_type":
        setAssetType(value as number[]);
        break;
      case "room_count":
        setBedCount(value as number[]);
        break;
      case "min_price":
        // alert(value)
        setMinPrice(value as number);
        // setPriceRange({ ...price, min: value as number });
        break;
      case "max_price":
        setMaxPrice(value as number);
        // setPriceRange({ ...price, max: value as number });
        break;
      default:
        break;
    }
  };

  const onUpdateDate = (day: string): void => {
    console.log("IN ONUPDATE DATE", day);
    setMoveInDate(DateUtils.getDisplayDate(day, "MMM DD, YYYY"));
  };

  const onUpdateTransaction = (value: number): void => {
    dispatch(
      SearchActions.setFilter({
        asset_transaction_type: value,
        max_price: -1,
        min_price: -1,
      })
    );
    setRangeUpdate(!isRangeUpdate);
    setTransactionType(value);
  };

  return (
    <View style={styles.verticalStyle}>
      <LocalityCard />
      {localities.length < 5 && (
        <Button
          type="primary"
          title={t("common:addLocation")}
          containerStyle={styles.verticalStyle}
          onPress={onAddLocation}
        />
      )}
      <SelectionPicker
        data={transactionData}
        selectedItem={[transactionType || 0]}
        onValueChange={onUpdateTransaction}
        containerStyles={styles.verticalStyle}
      />
      {filterDetails && ( // TODO: (Shikha) Use filterData after commercial integration
        <AssetTypeFilter
          filterData={filterDetails}
          asset_group={assetGroup}
          asset_type={assetType}
          isDisabled // TODO: (Shikha) Remove while commercial flow
          updateAssetFilter={updateFilter}
        />
      )}
      <RoomsFilter
        bedCount={bedCount}
        bedTitle={t("bhk")}
        isBathRequired={false}
        onSelection={updateFilter}
        containerStyle={styles.roomContainer}
        textStyle={styles.roomText}
      />
      <Range
        selectedUnit={filters.currency_code}
        isPriceRange
        range={priceRange}
        title={t("budget")}
        currencySymbol={currencySymbol}
        minChangedValue={price.min}
        maxChangedValue={price.max}
        onChangeSlide={updateFilter}
        isRangeUpdate={isRangeUpdate}
      />
      <FormCalendar
        label={t("moveInDate")}
        textSize="small"
        selectedValue={moveInDate}
        bubbleSelectedDate={onUpdateDate}
      />
      <TextArea
        value={comment}
        placeholder={t("common:typeYourMessage")}
        label={t("common:comments")}
        helpText={t("assetMore:optional")}
        onMessageChange={setComment}
        wordCountLimit={500}
        containerStyle={styles.verticalStyle}
      />
      <Button
        type="primary"
        title={t("submitDetails")}
        disabled={assetType.length < 1 || localities.length < 1}
        containerStyle={styles.saveButton}
        onPress={onSaveDetails}
      />
    </View>
  );
};

export default RequirementForm;

const styles = StyleSheet.create({
  verticalStyle: {
    marginVertical: 16,
  },
  roomContainer: {
    marginVertical: 30,
  },
  roomText: {
    marginBottom: 12,
  },
  saveButton: {
    marginVertical: 24,
  },
});
