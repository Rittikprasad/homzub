import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { remove, find, cloneDeep } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { LeadService } from '@homzhub/common/src/services/LeadService';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { RadioButtonGroup } from '@homzhub/common/src/components/molecules/RadioButtonGroup';
import { Header } from '@homzhub/mobile/src/components';
import { MultipleButtonGroup } from '@homzhub/common/src/components/molecules/MultipleButtonGroup';
import { TimeSlotGroup } from '@homzhub/common/src/components/molecules/TimeSlotGroup';
import HandleBack from '@homzhub/mobile/src/navigation/HandleBack';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { BedroomType, TimeSlot, UserType } from '@homzhub/common/src/constants/ContactFormData';

interface ISlot {
  from_time: number;
  to_time: number;
}

interface IStateProps {
  filters: IFilter;
  isLoggedIn: boolean;
}

interface IContactState {
  selectedTime: number[];
  selectedSpaces: string[];
  userType: number;
  message: string;
}

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.ContactForm>;
type Props = libraryProps & IStateProps;

export class ContactForm extends React.PureComponent<Props, IContactState> {
  public state = {
    selectedTime: [],
    selectedSpaces: [],
    userType: 1,
    message: '',
  };

  public render = (): React.ReactElement => {
    const { selectedTime, selectedSpaces, userType, message } = this.state;
    const { t, navigation } = this.props;
    return (
      <HandleBack onBack={this.goBack} navigation={navigation}>
        <Header
          icon={icons.close}
          barVisible={false}
          title={t('contact')}
          type="secondary"
          onIconPress={this.goBack}
          testID="header"
        />
        <KeyboardAwareScrollView style={styles.scrollView}>
          {this.renderContactDetail()}
          <Divider containerStyles={styles.divider} />
          <Text type="small" textType="semiBold" style={styles.userType}>
            {t('iAm')}
          </Text>
          <RadioButtonGroup
            data={UserType as Unit[]}
            onToggle={this.onUserToggle}
            containerStyle={styles.radioGroup}
            selectedValue={userType}
          />
          <Label type="large" textType="semiBold" style={styles.label}>
            {t('lookingFor')}
          </Label>
          <MultipleButtonGroup<string>
            data={BedroomType}
            onItemSelect={this.onSelectLookingType}
            selectedItem={selectedSpaces}
            containerStyle={styles.buttonGroup}
          />
          <Label type="large" textType="semiBold" style={styles.label}>
            {t('preferredTime')}
          </Label>
          <TimeSlotGroup data={TimeSlot} selectedItem={selectedTime} onItemSelect={this.onTimeSelect} />
          <TextArea
            label={t('message')}
            placeholder={t('typeYourMessage')}
            value={message}
            containerStyle={styles.textArea}
            onMessageChange={this.handleMessageChange}
          />
          <Button
            type="primary"
            title={t('sendMessage')}
            disabled={selectedTime.length === 0 || selectedSpaces.length === 0}
            icon={icons.envelope}
            iconColor={theme.colors.white}
            iconSize={22}
            titleStyle={styles.buttonTitleStyle}
            containerStyle={styles.buttonStyle}
            onPress={this.handleSubmit}
          />
        </KeyboardAwareScrollView>
      </HandleBack>
    );
  };

  private renderContactDetail = (): React.ReactElement => {
    const {
      t,
      route: {
        params: { contactDetail },
      },
    } = this.props;

    const number = `${contactDetail?.countryCode}${contactDetail?.phoneNumber}`;
    return (
      <>
        <Label type="large" textType="semiBold" style={styles.userType}>
          {t('youContacting')}
        </Label>
        <Avatar
          fullName={contactDetail?.fullName ?? ''}
          designation="Owner"
          phoneNumber={number}
          containerStyle={styles.avatarStyle}
        />
      </>
    );
  };

  private onTimeSelect = (id: number): void => {
    const { selectedTime } = this.state;
    const newTime: number[] = cloneDeep(selectedTime);
    let value;
    if (newTime.includes(id)) {
      remove(newTime, (item: number) => item === id);
      value = newTime;
    } else {
      value = newTime.concat(id);
    }

    this.setState({ selectedTime: value });
  };

  private onUserToggle = (id: number): void => {
    this.setState({
      userType: id,
    });
  };

  private onSelectLookingType = (type: string): void => {
    const { selectedSpaces } = this.state;
    const newSpaces: string[] = cloneDeep(selectedSpaces);
    let value;
    if (newSpaces.includes(type)) {
      remove(newSpaces, (item: string) => item === type);
      value = newSpaces;
    } else {
      value = newSpaces.concat(type);
    }
    this.setState({ selectedSpaces: value });
  };

  private handleMessageChange = (value: string): void => {
    this.setState({ message: value });
  };

  private handleSubmit = async (): Promise<void> => {
    const {
      isLoggedIn,
      filters: { asset_transaction_type },
      route: {
        params: { contactDetail, propertyTermId },
      },
      t,
      navigation,
    } = this.props;
    if (!contactDetail) return;
    const { userType, selectedTime, selectedSpaces, message } = this.state;
    const personType = UserType.find((item) => item.id === userType);
    const timeSlot: ISlot[] = [];

    selectedTime.forEach((id): any => {
      TimeSlot.forEach((item) => {
        if (item.id === id) {
          const slot = {
            from_time: item.from,
            to_time: item.to,
          };
          const slotObject = find(timeSlot, slot);
          if (!slotObject) {
            timeSlot.push(slot);
          }
        }
      });
    });

    if (personType && timeSlot.length > 0) {
      const payload = {
        propertyTermId,
        data: {
          spaces: selectedSpaces,
          contact_person_type: personType.value,
          lead_type: 'MAIL',
          ...(message && { message }),
          person_contacted: contactDetail.id,
          preferred_contact_time: timeSlot,
        },
      };

      if (isLoggedIn && (asset_transaction_type ?? 0) > -1) {
        await LeadService.postLeadDetail(asset_transaction_type ?? 0, payload);
        AlertHelper.success({ message: t('assetDescription:messageSent') });
        navigation.navigate(ScreensKeys.PropertyAssetDescription, { propertyTermId });
      } else {
        AlertHelper.error({ message: t('pleaseSignup') });
      }
    }
  };

  private goBack = (): void => {
    const {
      navigation,
      route: {
        params: { propertyTermId },
      },
    } = this.props;
    navigation.navigate(ScreensKeys.PropertyAssetDescription, { propertyTermId });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    filters: SearchSelector.getFilters(state),
    isLoggedIn: UserSelector.isLoggedIn(state),
  };
};

export default connect(mapStateToProps, null)(withTranslation()(ContactForm));

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.colors.white,
  },
  divider: {
    borderColor: theme.colors.darkTint10,
    marginBottom: 24,
  },
  userType: {
    color: theme.colors.darkTint3,
  },
  radioGroup: {
    marginVertical: 16,
  },
  label: {
    marginVertical: 12,
    color: theme.colors.darkTint3,
  },
  buttonGroup: {
    marginBottom: 18,
  },
  textArea: {
    marginVertical: 20,
  },
  buttonTitleStyle: {
    marginHorizontal: 12,
  },
  buttonStyle: {
    flex: 0,
    flexDirection: 'row-reverse',
    margin: 16,
  },
  avatarStyle: {
    paddingVertical: 18,
  },
});
