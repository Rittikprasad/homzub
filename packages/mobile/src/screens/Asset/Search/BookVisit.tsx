import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { CollapsibleSection } from '@homzhub/mobile/src/components';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import ScheduleVisitForm from '@homzhub/common/src/components/organisms/ScheduleVisitForm';
import { IReviewRefer } from '@homzhub/common/src/modules/common/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IVisitState {
  isCollapsed: boolean;
  isLoading: boolean;
}

interface IDispatchProps {
  setReviewReferData: (payload: IReviewRefer) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<CommonParamList, ScreensKeys.BookVisit>;
type Props = libraryProps & IDispatchProps;

export class BookVisit extends Component<Props, IVisitState> {
  public state = {
    isCollapsed: true,
    isLoading: false,
  };

  public render(): React.ReactNode {
    const { isCollapsed, isLoading } = this.state;
    const {
      t,
      route: { params },
      navigation,
    } = this.props;
    return (
      <Screen
        backgroundColor={theme.colors.white}
        isLoading={isLoading}
        headerProps={{
          onIconPress: navigation.goBack,
          type: 'secondary',
          title: t('assetDescription:BookVisit'),
          icon: icons.close,
        }}
      >
        {/* @ts-ignore */}
        <ScheduleVisitForm
          isCollapsed={isCollapsed}
          isReschedule={params ? params.isReschedule : false}
          leaseListingId={params.lease_listing_id}
          saleListingId={params.sale_listing_id}
          userId={params.userId}
          renderCollapseSection={this.renderCollapsibleSection}
          setLoading={this.setLoading}
          onSubmitSuccess={this.onSuccess}
        />
      </Screen>
    );
  }

  private renderCollapsibleSection = (children: React.ReactElement, title: string): React.ReactElement => {
    const { isCollapsed } = this.state;
    return (
      <CollapsibleSection
        title={title}
        icon={icons.watch}
        titleStyle={styles.upcomingTitle}
        initialCollapsedValue={isCollapsed}
        onCollapse={this.handleSlotView}
      >
        {children}
      </CollapsibleSection>
    );
  };

  private onSuccess = (): void => {
    const { navigation, setReviewReferData } = this.props;
    navigation.goBack();
    setReviewReferData({ isReview: true });
  };

  private handleSlotView = (isCollapsed: boolean): void => {
    this.setState({ isCollapsed });
  };

  private setLoading = (isLoading: boolean): void => {
    this.setState({ isLoading });
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setReviewReferData } = CommonActions;
  return bindActionCreators({ setReviewReferData }, dispatch);
};

const reduxComp = connect(null, mapDispatchToProps)(BookVisit);
export default withTranslation()(reduxComp);

const styles = StyleSheet.create({
  upcomingTitle: {
    marginLeft: 12,
  },
});
