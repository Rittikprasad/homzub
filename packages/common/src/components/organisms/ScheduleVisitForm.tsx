import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { AnalyticsHelper } from '@homzhub/common/src/utils/AnalyticsHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { RadioButtonGroup } from '@homzhub/common/src/components/molecules/RadioButtonGroup';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { TimeSlotGroup } from '@homzhub/common/src/components/molecules/TimeSlotGroup';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetVisit, ISlotItem } from '@homzhub/common/src/domain/models/AssetVisit';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { UpcomingSlot } from '@homzhub/common/src/domain/models/UpcomingSlot';
import {
  IRescheduleVisitPayload,
  IScheduleVisitPayload,
  IUpcomingVisitPayload,
  VisitType,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { TimeSlot } from '@homzhub/common/src/constants/ContactFormData';
import { VisitTypeData } from '@homzhub/common/src/mocks/BookVisit';

interface IStateProps {
  assetDetails: Asset | null;
  visitDetail: AssetVisit;
  visitIds: number[];
}

interface IVisitProp {
  leaseListingId?: number;
  saleListingId?: number;
  isReschedule?: boolean;
  isCollapsed?: boolean;
  userId?: number;
  startDate?: string;
  comment?: string;
  isFromFFM?: boolean;
  setLoading: (isLoading: boolean) => void;
  onSubmitSuccess: () => void;
  renderCollapseSection?: (children: React.ReactElement, title: string) => React.ReactElement;
  pickerStyle?: ViewStyle;
}

interface IVisitState {
  visitType: string[];
  userType: number;
  visitors: Unit[];
  upcomingVisits: UpcomingSlot[];
  selectedUpcomingSlot: number;
  isUpcomingSlotSelected: boolean;
  selectedDate: string;
  message: string;
  selectedTimeSlot: number;
  leaseId: number | null;
  saleId: number | null;
}

type Props = IVisitProp & IStateProps & WithTranslation;

class ScheduleVisitForm extends Component<Props, IVisitState> {
  public state = {
    userType: 1,
    visitors: [],
    selectedDate: '',
    message: '',
    upcomingVisits: [],
    selectedTimeSlot: 0,
    leaseId: null,
    saleId: null,
    selectedUpcomingSlot: 0,
    isUpcomingSlotSelected: false,
    visitType: [VisitType.PHYSICAL],
  };

  public componentDidMount = async (): Promise<void> => {
    this.getExistingData();
    await this.getVisitorType();
    await this.getUpcomingVisits();
  };

  public render(): React.ReactNode {
    const { t, isReschedule, renderCollapseSection, isCollapsed } = this.props;
    const { upcomingVisits, isUpcomingSlotSelected, message, selectedDate, selectedTimeSlot } = this.state;

    const upcomingVisitTitle = PropertyUtils.getUpcomingSlotMessage(upcomingVisits[0]);
    const isPastDate = DateUtils.isPastDate(selectedDate);
    const isButtonDisabled = (selectedDate === '' || selectedTimeSlot === 0) && !isUpcomingSlotSelected;
    return (
      <View style={styles.container}>
        {this.renderVisitType()}
        {!isReschedule && this.renderVisitorType()}
        <Divider containerStyles={styles.divider} />
        {upcomingVisits.length > 0 &&
          renderCollapseSection &&
          renderCollapseSection(this.renderUpcomingSlotList(), upcomingVisitTitle)}
        {isCollapsed && !isUpcomingSlotSelected && this.renderDateTimeSection()}
        <TextArea
          label={t('message')}
          placeholder={t('typeYourMessage')}
          value={message}
          containerStyle={styles.textArea}
          onMessageChange={this.handleMessageChange}
        />
        <Button
          type="primary"
          title={t('confirm')}
          disabled={isButtonDisabled || isPastDate}
          titleStyle={styles.buttonTitleStyle}
          containerStyle={styles.buttonStyle}
          onPress={this.handleSubmit}
        />
      </View>
    );
  }

  private renderVisitType = (): React.ReactElement => {
    const { visitType } = this.state;
    const { pickerStyle } = this.props;
    return (
      <SelectionPicker
        data={VisitTypeData}
        selectedItem={visitType}
        onValueChange={this.onChangeVisitType}
        containerStyles={pickerStyle}
      />
    );
  };

  private renderVisitorType = (): React.ReactElement => {
    const { userType, visitors } = this.state;
    const { t } = this.props;
    return (
      <View style={styles.userContainer}>
        <Text type="small" textType="semiBold" style={styles.userType}>
          {t('iAm')}
        </Text>
        <RadioButtonGroup
          data={visitors}
          onToggle={this.handleUserType}
          containerStyle={styles.radioGroup}
          selectedValue={userType}
        />
      </View>
    );
  };

  private renderUpcomingSlotList = (): React.ReactElement => {
    const { upcomingVisits, isUpcomingSlotSelected } = this.state;
    return (
      <FlatList
        data={upcomingVisits}
        renderItem={this.renderUpcomingSlot}
        horizontal
        showsHorizontalScrollIndicator={false}
        extraData={isUpcomingSlotSelected}
      />
    );
  };

  private renderUpcomingSlot = ({ item }: { item: UpcomingSlot }): React.ReactElement | null => {
    const { selectedUpcomingSlot, isUpcomingSlotSelected } = this.state;
    const handleSelection = (): void => this.onSelectUpcomingSlot(item.id);
    const selected = isUpcomingSlotSelected && selectedUpcomingSlot === item.id;
    const slot = PropertyUtils.getUpcomingSlotsData(item);
    if (!slot) {
      return null;
    }
    return (
      <TouchableOpacity
        key={item.id}
        testID="selectSlot"
        style={[styles.buttonContainer, selected && styles.selectedContainer]}
        onPress={handleSelection}
      >
        <Text type="small" style={[styles.slotTitle, selected && styles.selectedTitle]}>
          {slot.date}
        </Text>
        <View style={styles.upcomingView}>
          <Icon
            name={slot.time.icon}
            size={20}
            color={selected ? theme.colors.white : theme.colors.darkTint2}
            style={styles.iconStyle}
          />
          <Label type="large" style={[styles.slotTitle, selected && styles.selectedTitle]}>
            {slot.time.formatted}
          </Label>
        </View>
      </TouchableOpacity>
    );
  };

  private renderDateTimeSection = (): React.ReactElement => {
    const { selectedTimeSlot, selectedDate } = this.state;
    const { t } = this.props;
    const maxDate = DateUtils.getFutureDate(10);
    return (
      <View style={styles.dateTimeView}>
        <FormCalendar
          label={t('selectDate')}
          name="selectDate"
          textSize="small"
          fontType="semiBold"
          calendarTitle={t('selectDate')}
          placeHolder={t('datePlaceholder')}
          maxDate={maxDate}
          isCurrentDateEnable
          selectedValue={selectedDate}
          iconColor={theme.colors.darkTint8}
          placeHolderStyle={styles.placeholderStyle}
          bubbleSelectedDate={this.onSelectDate}
        />
        <Text type="small" textType="semiBold" style={styles.timeHeading}>
          {t('selectTimings')}
        </Text>
        <TimeSlotGroup
          data={TimeSlot}
          onItemSelect={this.onSelectTime}
          selectedItem={selectedTimeSlot}
          selectedDate={selectedDate}
        />
      </View>
    );
  };

  private onChangeVisitType = (value: string): void => {
    this.setState({ visitType: [value] }, () => {
      this.getUpcomingVisits().then();
    });
  };

  private onSelectUpcomingSlot = (slotId: number): void => {
    const { isUpcomingSlotSelected } = this.state;
    this.setState({ selectedUpcomingSlot: slotId, isUpcomingSlotSelected: !isUpcomingSlotSelected });
  };

  private onSelectDate = (day: string): void => {
    const selectedDate = DateUtils.getDisplayDate(day, 'll');
    this.setState({ selectedDate });
  };

  private onSelectTime = (slotId: number): void => {
    this.setState({ selectedTimeSlot: slotId });
  };

  private handleUserType = (id: number): void => {
    this.setState({ userType: id });
  };

  private handleMessageChange = (value: string): void => {
    this.setState({ message: value });
  };

  private getVisitorType = async (): Promise<void> => {
    const { setLoading } = this.props;
    setLoading(true);

    try {
      const response = await AssetRepository.getVisitLeadType();
      this.setState({ visitors: response, userType: response[0].id });
      setLoading(false);
    }catch (e: any) {      setLoading(false);
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getUpcomingVisits = async (): Promise<void> => {
    const { visitType, leaseId, saleId } = this.state;
    const { setLoading, leaseListingId, saleListingId } = this.props;
    setLoading(true);

    const payload: IUpcomingVisitPayload = {
      visit_type: visitType[0],
      start_date__gte: DateUtils.getCurrentDate24Format(),
      lease_listing_id: leaseListingId ?? leaseId,
      sale_listing_id: saleListingId ?? saleId,
    };

    try {
      const response = await AssetRepository.getUpcomingVisits(payload);
      this.setState({ upcomingVisits: response });
      setLoading(false);
    }catch (e: any) {      setLoading(false);
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getExistingData = (): void => {
    const { visitDetail, isReschedule, leaseListingId, saleListingId, isFromFFM, startDate, comment } = this.props;
    if (isFromFFM && startDate) {
      const dateTime = DateUtils.convertTimeFormat(startDate, 'YYYY-MM-DD HH');
      const time = TimeSlot.find((item) => item.from === Number(dateTime[1]));

      if (isReschedule) {
        this.setState({
          selectedDate: startDate ? DateUtils.getDisplayDate(dateTime[0], 'll') : '',
          selectedTimeSlot: time ? time.id : 0,
          message: comment ?? '',
        });
      }
      return;
    }
    if (!visitDetail) return;

    const dateTime = DateUtils.convertTimeFormat(visitDetail.startDate, 'YYYY-MM-DD HH');
    const time = TimeSlot.find((item) => item.from === Number(dateTime[1]));

    if (isReschedule) {
      this.setState({
        selectedDate: visitDetail.startDate ? DateUtils.getDisplayDate(dateTime[0], 'll') : '',
        selectedTimeSlot: time ? time.id : 0,
        message: visitDetail.comments,
      });
    }
    if (saleListingId && leaseListingId) {
      this.setState({
        leaseId: visitDetail.leaseListing && visitDetail.leaseListing > 0 ? visitDetail.leaseListing : null,
        saleId: visitDetail.saleListing && visitDetail.saleListing > 0 ? visitDetail.saleListing : null,
      });
    }
  };

  private handleSubmit = async (): Promise<void> => {
    const {
      visitType,
      userType,
      message,
      selectedUpcomingSlot,
      upcomingVisits,
      selectedDate,
      selectedTimeSlot,
      isUpcomingSlotSelected,
      saleId,
      leaseId,
    } = this.state;
    const {
      t,
      leaseListingId,
      saleListingId,
      visitIds,
      assetDetails,
      isReschedule,
      userId,
      setLoading,
      onSubmitSuccess,
    } = this.props;
    let trackData;

    let start_date = '';
    let end_date = '';

    setLoading(true);

    if (isUpcomingSlotSelected) {
      upcomingVisits.forEach((item: UpcomingSlot) => {
        if (item.id === selectedUpcomingSlot) {
          start_date = item.start_date;
          end_date = item.end_date;
        }
      });
    } else {
      TimeSlot.forEach((item: ISlotItem) => {
        if (item.id === selectedTimeSlot) {
          start_date = DateUtils.getISOFormat(selectedDate, item.from);
          end_date = DateUtils.getISOFormat(selectedDate, item.to);
        }
      });
    }

    const payload: IScheduleVisitPayload = {
      visit_type: visitType[0],
      lead_type: userType,
      start_date,
      end_date,
      ...(message && { comments: message }),
      lease_listing: leaseListingId && leaseListingId > 0 ? leaseListingId : leaseId,
      sale_listing: saleListingId && saleListingId > 0 ? saleListingId : saleId,
      ...(userId && userId > 0 && { scheduled_for: userId }),
    };

    const reschedulePayload: IRescheduleVisitPayload = {
      ids: visitIds,
      visit_type: visitType[0],
      start_date,
      end_date,
      ...(message && { comments: message }),
    };
    if (assetDetails) {
      trackData = {
        start_date,
        end_date,
        ...AnalyticsHelper.getPropertyTrackData(assetDetails),
      };
    }

    try {
      if (isReschedule) {
        await AssetRepository.reschedulePropertyVisit(reschedulePayload);
        if (trackData) {
          AnalyticsService.track(EventType.VisitRescheduleSuccess, trackData);
        }
      } else {
        await AssetRepository.propertyVisit(payload);
        AlertHelper.success({ message: t('property:scheduleVisit') });
        if (trackData) {
          AnalyticsService.track(EventType.VisitCreatedSuccess, trackData);
        }
      }
      setLoading(false);
      onSubmitSuccess();
    }catch (e: any) {      if (isReschedule && trackData) {
        AnalyticsService.track(EventType.VisitRescheduleFailure, trackData);
      } else if (trackData) {
        AnalyticsService.track(EventType.VisitCreatedFailure, trackData);
      }
      setLoading(false);
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    assetDetails: AssetSelectors.getAsset(state),
    visitDetail: AssetSelectors.getVisitById(state),
    visitIds: AssetSelectors.getVisitIds(state),
  };
};

export default connect(mapStateToProps, null)(withTranslation()(ScheduleVisitForm));

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  userContainer: {
    paddingVertical: 24,
  },
  userType: {
    color: theme.colors.darkTint3,
  },
  divider: {
    borderColor: theme.colors.darkTint10,
  },
  radioGroup: {
    marginVertical: 16,
  },
  buttonContainer: {
    marginVertical: 16,
    paddingHorizontal: 28,
    marginHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  selectedContainer: {
    backgroundColor: theme.colors.blue,
  },
  slotTitle: {
    color: theme.colors.darkTint2,
  },
  selectedTitle: {
    color: theme.colors.white,
  },
  iconStyle: {
    marginRight: 6,
  },
  textArea: {
    marginTop: 18,
    marginBottom: 24,
  },
  buttonStyle: {
    marginVertical: 12,
  },
  buttonTitleStyle: {
    marginHorizontal: 12,
  },
  dateTimeView: {
    marginTop: 12,
  },
  placeholderStyle: {
    color: theme.colors.darkTint8,
  },
  timeHeading: {
    color: theme.colors.darkTint3,
    marginTop: 22,
    marginBottom: 8,
  },
  upcomingView: {
    flexDirection: 'row',
  },
});
