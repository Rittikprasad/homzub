import React, { Component, ReactElement } from 'react';
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { TabBar, TabView } from 'react-native-tab-view';
import { theme } from '@homzhub/common/src/styles/theme';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { TicketCard } from '@homzhub/common/src/components/organisms/TicketCard';
import { PillarTypes } from '@homzhub/common/src/domain/models/Pillar';
import { Ticket, TicketPriority, TicketStatus } from '@homzhub/common/src/domain/models/Ticket';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IRoutes, Tabs, TicketRoutes } from '@homzhub/common/src/constants/Tabs';
import { IGetTicketParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IProps {
  onAddTicket: () => void;
  navigateToDetail: (payload: ICurrentTicket) => void;
  isFromMore?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  isDesktop?: boolean;
  isTablet?: boolean;
  renderWebRating?: (children: React.ReactElement, onClose: () => void, isOpen: boolean) => React.ReactElement;
}

interface IDispatchProps {
  getTickets: (param?: IGetTicketParam) => void;
  setCurrentTicket: (payload: ICurrentTicket) => void;
  getPillars: (payload: PillarTypes) => void;
}

interface IStateProps {
  tickets: Ticket[];
}

interface IScreenState {
  selectedListType: TicketStatus;
  currentIndex: number;
}

type Props = WithTranslation & IProps & IDispatchProps & IStateProps;

class ServiceTicketList extends Component<Props, IScreenState> {
  public state = {
    selectedListType: TicketStatus.OPEN,
    currentIndex: 0,
  };

  public componentDidMount = (): void => {
    const { getPillars } = this.props;
    getPillars(PillarTypes.SERVICE_TICKET_REVIEW);
  };

  public render(): React.ReactNode {
    const { selectedListType } = this.state;
    const { t, onAddTicket, containerStyle, isFromMore, isDesktop, isTablet } = this.props;
    const isWeb = PlatformUtils.isWeb();
    const isMultiCol = (isWeb && isDesktop) || isTablet;
    return (
      <View style={containerStyle}>
        <View style={[styles.container, !isFromMore && { marginTop: 0 }, isMultiCol && styles.containerWeb]}>
          {isFromMore && (
            <Button
              type="secondary"
              title={t('addNewTicket')}
              containerStyle={[styles.addButton, isWeb && styles.buttonWeb, isMultiCol && styles.addButtonWeb]}
              onPress={onAddTicket}
            />
          )}
          <SelectionPicker
            data={[
              { title: t('common:open'), value: TicketStatus.OPEN },
              { title: t('common:closed'), value: TicketStatus.CLOSED },
            ]}
            selectedItem={[selectedListType]}
            onValueChange={this.onTypeChange}
            containerStyles={[styles.picker, isMultiCol && styles.pickerWeb]}
          />
          {isDesktop && <View style={styles.emptyView} />}
        </View>
        {this.renderTabView()}
      </View>
    );
  }

  private renderTabView = (): React.ReactElement => {
    const { currentIndex } = this.state;
    return (
      <TabView
        initialLayout={theme.viewport}
        renderScene={this.renderScene}
        onIndexChange={this.handleIndexChange}
        renderTabBar={(props): React.ReactElement => {
          const {
            navigationState: { index, routes },
          } = props;
          const currentRoute = routes[index];
          return (
            <TabBar
              {...props}
              style={styles.tabBar}
              indicatorStyle={{ backgroundColor: currentRoute.color }}
              renderLabel={({ route }): React.ReactElement => {
                return (
                  <Text type="small" style={styles.tabTitle} numberOfLines={1}>
                    {route.title}
                  </Text>
                );
              }}
            />
          );
        }}
        swipeEnabled={false}
        navigationState={{
          index: currentIndex,
          routes: TicketRoutes,
        }}
      />
    );
  };

  private renderScene = ({ route }: { route: IRoutes }): ReactElement => {
    switch (route.key) {
      case Tabs.ALL:
        return this.renderContent(TicketPriority.ALL);
      case Tabs.HIGH:
        return this.renderContent(TicketPriority.HIGH);
      case Tabs.MEDIUM:
        return this.renderContent(TicketPriority.MEDIUM);
      case Tabs.LOW:
        return this.renderContent(TicketPriority.LOW);
      default:
        return <EmptyState icon={icons.serviceRequest} />;
    }
  };

  private renderContent = (priority: TicketPriority): ReactElement => {
    const { t, isDesktop, isTablet } = this.props;
    const data = this.getFormattedData(priority);
    const isMultiCol = isDesktop || isTablet;
    return (
      <View style={styles.listContainer}>
        {data.length > 0 && (
          <Label type="large" textType="regular" style={styles.count}>
            {data.length} {t('assetMore:tickets')}
          </Label>
        )}
        <FlatList
          data={data}
          ListEmptyComponent={this.renderEmptyComponent}
          renderItem={({ item }): ReactElement => this.renderItem(item, data.length)}
          extraData={data}
          key={isMultiCol ? 'service-tickets-desktop' : 'service-tickets-mobile'}
          numColumns={isMultiCol ? 2 : 1}
        />
      </View>
    );
  };

  private renderItem = (item: Ticket, totalItems: number): ReactElement => {
    const { isFromMore, getTickets, renderWebRating } = this.props;
    const isOdd = (num: number): boolean => {
      return num % 2 === 1;
    };
    const isOddElement = isOdd(totalItems);
    return (
      <TicketCard
        cardData={item}
        onCardPress={(): void => this.onTicketPress(item)}
        isFromMore={isFromMore}
        onSubmitReview={getTickets}
        isOddElement={isOddElement}
        renderWebRating={renderWebRating}
      />
    );
  };

  private renderEmptyComponent = (): ReactElement => {
    const { t } = this.props;
    return <EmptyState title={t('serviceTickets:noTickets')} icon={icons.serviceRequest} />;
  };

  // HANDLERS START
  private onTicketPress = ({ id, asset: { id: assetId }, assignedTo: { id: userId } }: Ticket): void => {
    const { navigateToDetail, setCurrentTicket } = this.props;
    setCurrentTicket({ ticketId: id, assetId, assignedUserId: userId });
    navigateToDetail({ ticketId: id, assetId, assignedUserId: userId });
  };

  private onTypeChange = (value: TicketStatus): void => {
    this.setState({ selectedListType: value });
  };

  private getFormattedData = (priority: TicketPriority): Ticket[] => {
    const { selectedListType } = this.state;
    const { tickets } = this.props;
    const formattedData = tickets.filter((item: Ticket): Ticket | null => {
      switch (selectedListType) {
        case TicketStatus.CLOSED:
          if (item.status === selectedListType) {
            return item;
          }
          return null;
        case TicketStatus.OPEN:
        default:
          if (item.status !== TicketStatus.CLOSED) {
            return item;
          }
          return null;
      }
    });
    return priority === TicketPriority.ALL
      ? formattedData
      : formattedData.filter((item: Ticket) => item.priority === priority);
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
  };
  // HANDLERS END
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getTickets } = TicketSelectors;
  return {
    tickets: getTickets(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTickets, setCurrentTicket } = TicketActions;
  const { getPillars } = CommonActions;
  return bindActionCreators(
    {
      getTickets,
      setCurrentTicket,
      getPillars,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.serviceTickets)(ServiceTicketList));

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  containerWeb: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    flex: 0,
    borderStyle: 'dashed',
  },
  buttonWeb: {
    flex: 1,
  },
  addButtonWeb: {
    maxWidth: 200,
  },
  picker: {
    marginTop: 20,
  },
  pickerWeb: {
    maxWidth: 250,
    justifyContent: 'center',
    marginTop: 0,
  },
  tabBar: {
    backgroundColor: theme.colors.white,
  },
  tabTitle: {
    color: theme.colors.darkTint3,
  },
  listContainer: {
    margin: 16,
  },
  count: {
    color: theme.colors.darkTint6,
  },
  buttonActionsWeb: {
    flexDirection: 'row',
  },
  emptyView: {
    width: 200,
  },
});
