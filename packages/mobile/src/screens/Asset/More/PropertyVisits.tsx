import React from 'react';
import { PickerItemProps, StyleSheet, TouchableOpacity } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { AssetService } from '@homzhub/common/src/services/AssetService';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { PropertyByCountryDropdown } from '@homzhub/common/src/components/molecules/PropertyByCountryDropdown';
import SiteVisitTab from '@homzhub/mobile/src/components/organisms/SiteVisitTab';
import SiteVisitCalendarView from '@homzhub/mobile/src/components/organisms/SiteVisitCalendarView';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IAssetVisitPayload, IBookVisitProps } from '@homzhub/common/src/domain/repositories/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

interface IDispatchProps {
  getAssetVisit: (payload: IAssetVisitPayload) => void;
  setVisitType: (payload: Tabs) => void;
  clearVisits: () => void;
}

interface IScreenState {
  isCalendarView: boolean;
  countryData: Country[];
  propertiesByCountry: PickerItemProps[];
  selectedAssetId: number;
  selectedCountry: number;
  visitPayload: IAssetVisitPayload;
}

type libraryProps = NavigationScreenProps<CommonParamList, ScreensKeys.PropertyVisits>;
type Props = WithTranslation & libraryProps & IDispatchProps;

export class PropertyVisits extends React.Component<Props, IScreenState> {
  public state = {
    isCalendarView: false,
    countryData: [],
    propertiesByCountry: [],
    selectedAssetId: 0,
    selectedCountry: 0,
    visitPayload: {} as IAssetVisitPayload,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAllAssetsByCountry();
  };

  public render(): React.ReactNode {
    const { t, route } = this.props;

    const title = route?.params?.screenTitle ? route?.params.screenTitle : t('assetMore:more');
    return (
      <UserScreen
        isOuterScrollEnabled
        title={title}
        pageTitle={t('assetMore:propertyVisits')}
        rightNode={this.renderRightNode()}
        onBackPress={this.handleBack}
      >
        {this.renderPropertyVisits()}
      </UserScreen>
    );
  }

  private renderRightNode = (): React.ReactElement | undefined => {
    const {
      route: { params },
    } = this.props;
    const { isCalendarView } = this.state;
    if (params?.isFromPortfolio) return undefined;
    return (
      <TouchableOpacity onPress={this.handleCalendarPress}>
        <Icon
          size={24}
          name={isCalendarView ? icons.doubleBar : icons.calendar}
          color={theme.colors.primaryColor}
          style={styles.calendarStyle}
        />
      </TouchableOpacity>
    );
  };

  private renderPropertyVisits = (): React.ReactElement => {
    const { isCalendarView, countryData, propertiesByCountry, selectedAssetId, selectedCountry } = this.state;
    const {
      navigation,
      route: { params },
    } = this.props;
    return (
      <>
        {!params?.isFromPortfolio && (
          <PropertyByCountryDropdown
            selectedCountry={selectedCountry}
            selectedProperty={selectedAssetId}
            countryList={countryData}
            propertyList={propertiesByCountry}
            onCountryChange={this.onCountryChange}
            onPropertyChange={this.handlePropertySelect}
            containerStyle={styles.dropdownStyle}
          />
        )}
        {isCalendarView ? (
          <SiteVisitCalendarView
            onReschedule={this.rescheduleVisit}
            selectedAssetId={selectedAssetId}
            navigateToAssetDetail={this.navigateToAssetDetails}
          />
        ) : (
          <SiteVisitTab
            onReschedule={this.rescheduleVisit}
            setVisitPayload={this.setVisitPayload}
            navigation={navigation}
            reviewVisitId={params && params.reviewVisitId} // When Navigated from Notifications
            visitId={params && params.visitId ? params.visitId : null} // When Navigated from Notifications
            selectedAssetId={selectedAssetId} // When Navigated from Portfolio View
            isFromProperty={params?.isFromPortfolio} // When Navigated from Portfolio View
          />
        )}
      </>
    );
  };

  private onCountryChange = (countryId: number): void => {
    this.setState({ selectedCountry: countryId });
  };

  private navigateToAssetDetails = (listingId: number | null, id: number, isValidVisit: boolean): void => {
    const { navigation, t } = this.props;
    if (isValidVisit && listingId) {
      navigation.navigate(ScreensKeys.PropertyAssetDescription, {
        propertyTermId: listingId,
        propertyId: id,
      });
    } else {
      AlertHelper.error({ message: t('property:inValidVisit') });
    }
  };

  private handleBack = (): void => {
    const { navigation, clearVisits } = this.props;
    navigation.goBack();
    clearVisits();
  };

  private handleCalendarPress = (): void => {
    const { isCalendarView } = this.state;
    const { setVisitType } = this.props;
    setVisitType(Tabs.UPCOMING);
    this.setState({
      isCalendarView: !isCalendarView,
    });
  };

  private handlePropertySelect = (value: number): void => {
    const { getAssetVisit } = this.props;
    const {
      visitPayload: { start_date__gte, status__in, start_date__lt },
      isCalendarView,
    } = this.state;
    this.setState({
      selectedAssetId: value,
    });

    const payload: IAssetVisitPayload = {
      ...(value > 0 && { asset_id: value }),
      ...(start_date__gte && isCalendarView && { start_datetime: start_date__gte }),
      ...(start_date__gte && !isCalendarView && { start_date__gte }),
      ...(start_date__lt && !isCalendarView && { start_date__lt }),
      ...(status__in && { status__in }),
    };

    getAssetVisit(payload);
  };

  private rescheduleVisit = (param: IBookVisitProps, isNew?: boolean): void => {
    const { navigation } = this.props;
    // @ts-ignore
    navigation.navigate(ScreensKeys.BookVisit, {
      isReschedule: !isNew,
      ...param,
    });
  };

  private setVisitPayload = (payload: IAssetVisitPayload): void => {
    this.setState({
      visitPayload: payload,
    });
  };

  private getAllAssetsByCountry = async (): Promise<void> => {
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

    this.setState({
      countryData,
      propertiesByCountry,
    });
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetVisit, setVisitType, clearVisits } = AssetActions;
  return bindActionCreators(
    {
      getAssetVisit,
      setVisitType,
      clearVisits,
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(withTranslation()(PropertyVisits));

const styles = StyleSheet.create({
  calendarStyle: {
    paddingRight: 12,
  },
  dropdownStyle: {
    paddingHorizontal: 16,
  },
});
