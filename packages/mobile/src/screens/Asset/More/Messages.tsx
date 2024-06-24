import React from 'react';
import { throttle } from 'lodash';
import { FlatList, StyleSheet, View } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import GroupChat from '@homzhub/common/src/components/molecules/GroupChat';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IChatPayload } from '@homzhub/common/src/modules/common/interfaces';

interface IScreenState {
  searchValue: string;
}

interface IStateToProps {
  groupMessages: GroupMessage[] | null;
  groupMessagesLoading: boolean;
  userProfile: UserProfile;
}

interface IDispatchToProps {
  getGroupMessage: () => void;
  clearMessages: () => void;
  setCurrentChatDetail: (payload: IChatPayload) => void;
}

type NavProps = NavigationScreenProps<CommonParamList, ScreensKeys.Messages>;

type MessageProps = NavProps & WithTranslation & IStateToProps & IDispatchToProps;

class Messages extends React.PureComponent<MessageProps, IScreenState> {
  public focusListener: any;

  constructor(props: MessageProps) {
    super(props);

    this.state = {
      searchValue: '',
    };
  }

  public componentDidMount(): void {
    const { getGroupMessage, navigation, clearMessages } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      getGroupMessage();
      clearMessages();
    });
  }

  public componentWillUnmount(): void {
    this.focusListener();
  }

  public render(): React.ReactNode {
    const { searchValue } = this.state;
    const {
      route,
      navigation: { goBack },
      t,
      groupMessages,
      groupMessagesLoading,
    } = this.props;

    const filteredMessages = this.getFilteredMessages(groupMessages);
    const sortedMessages = this.getLastSentSortedMessages(filteredMessages);

    const isMessagesPresent = groupMessages && groupMessages.length > 0;
    const isSearchFound = sortedMessages && sortedMessages.length > 0;

    const headerText = route?.params?.isFromDashboard ? t('assetDashboard:dashboard') : t('assetMore:more');

    if (groupMessagesLoading) {
      return <Loader visible />;
    }

    return (
      <UserScreen title={headerText} onBackPress={goBack} pageTitle={t('assetMore:messages')}>
        {isMessagesPresent ? (
          <View style={styles.container}>
            <SearchBar
              placeholder={t('assetMore:searchByNameOrProperty')}
              value={searchValue}
              updateValue={throttle(this.updateSearchValue)}
              containerStyle={styles.searchBar}
            />
            {isSearchFound ? (
              <>
                <Text type="small" textType="semiBold" style={styles.chat}>
                  {t('assetMore:chats')}
                </Text>
                <FlatList
                  data={filteredMessages}
                  renderItem={this.renderItem}
                  style={styles.chatList}
                  ItemSeparatorComponent={this.renderItemSeparator}
                  keyExtractor={this.keyExtractor}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.chatListContent}
                />
              </>
            ) : (
              this.renderEmptyState()
            )}
          </View>
        ) : (
          this.renderEmptyState()
        )}
      </UserScreen>
    );
  }

  private renderEmptyState = (): React.ReactElement => {
    const { t } = this.props;

    return <EmptyState title={t('assetMore:noChatsFound')} containerStyle={styles.noChat} />;
  };

  private renderItem = ({ item, index }: { item: GroupMessage; index: number }): React.ReactElement => {
    const {
      userProfile: { id },
    } = this.props;

    return <GroupChat chatData={item} onChatPress={this.handleChatPress} loggedInUserId={id} />;
  };

  private renderItemSeparator = (): React.ReactElement => {
    return <View style={styles.separator} />;
  };

  private keyExtractor = (item: GroupMessage, index: number): string => {
    return `${index}-${item.id}`;
  };

  private updateSearchValue = (value: string): void => {
    this.setState({ searchValue: value });
  };

  private getFilteredMessages = (groupMessages: GroupMessage[] | null): GroupMessage[] | null => {
    const { searchValue } = this.state;

    if (!groupMessages || !searchValue) {
      return groupMessages;
    }

    const filteredMessages = groupMessages.filter((groupMessage: GroupMessage) => {
      const { name, getAlphabeticalSortedUserNames } = groupMessage;
      const lowerCasedSearchValue = searchValue.toLowerCase();
      const isGroupNameIncluded = name.toLowerCase().includes(lowerCasedSearchValue);
      const isUserNameIncluded = getAlphabeticalSortedUserNames.toLowerCase().includes(lowerCasedSearchValue);

      return isGroupNameIncluded || isUserNameIncluded;
    });

    return filteredMessages ?? null;
  };

  private getLastSentSortedMessages = (filteredMessages: GroupMessage[] | null): GroupMessage[] | null => {
    if (!filteredMessages) {
      return filteredMessages;
    }

    const sortedGroupMessages = filteredMessages.sort((message1: GroupMessage, message2: GroupMessage) => {
      const { lastMessage: lastMessage1, createdAt: createdAtMessage1 } = message1;
      const { lastMessage: lastMessage2, createdAt: createdAtMessage2 } = message2;

      const firstMessageDate = lastMessage1 || createdAtMessage1;
      const secondMessageDate = lastMessage2 || createdAtMessage2;

      const value = new Date(firstMessageDate).getTime() - new Date(secondMessageDate).getTime();

      if (value > 0) {
        return -1;
      }
      if (value < 0) {
        return 1;
      }
      return 0;
    });

    return sortedGroupMessages;
  };

  private handleChatPress = (name: string, id: number): void => {
    const { navigation, setCurrentChatDetail } = this.props;
    setCurrentChatDetail({
      groupName: name,
      groupId: id,
    });
    // @ts-ignore
    navigation.navigate(ScreensKeys.ChatScreen, { groupId: id });
  };
}

const mapStateToProps = (state: IState): IStateToProps => {
  return {
    groupMessages: CommonSelectors.getGroupMessages(state),
    groupMessagesLoading: CommonSelectors.getGroupMessagesLoading(state),
    userProfile: UserSelector.getUserProfile(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  const { getGroupMessage, setCurrentChatDetail, clearMessages } = CommonActions;
  return bindActionCreators({ getGroupMessage, setCurrentChatDetail, clearMessages }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Messages));

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    flex: 1,
  },
  chatList: {
    marginTop: 12,
  },
  chatListContent: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  chat: {
    marginTop: 16,
    color: theme.colors.darkTint3,
  },
  noChat: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  searchBar: {
    marginTop: 16,
  },
});
