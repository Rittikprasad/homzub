import React, { Component, createRef, ReactElement, RefObject } from 'react';
import { groupBy, isEmpty } from 'lodash';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import MessageCard from '@homzhub/common/src/components/molecules/MessageCard';
import { IMessageKeyValue, IMessages, Message } from '@homzhub/common/src/domain/models/Message';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IGetMessageParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { IGetNegotiationComments } from '@homzhub/common/src/modules/offers/interfaces';
import { IChatPayload } from '@homzhub/common/src/modules/common/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IStateProps {
  messages: IMessages | null;
  currentChat: IChatPayload | null;
  isLoading: boolean;
  negotiationComments: IMessageKeyValue | null;
}

interface IDispatchProps {
  getMessages: (param: IGetMessageParam) => void;
  getNegotiationComments: (payload: IGetNegotiationComments) => void;
}

interface IScreenState {
  isRefreshing: boolean;
}

interface IProps {
  shouldEnableOuterScroll?: (enable: boolean) => void;
  shouldScrollToBottom?: () => void;
  isScrollToBottom?: boolean;
  isFromOffers: boolean;
  shouldReverseOrder?: boolean;
}

type Props = WithTranslation & IStateProps & IDispatchProps & IProps;

class MessagePreview extends Component<Props, IScreenState> {
  public scrollRef: RefObject<ScrollView> = createRef();

  public state = {
    isRefreshing: false,
  };

  public componentDidMount = (): void => {
    const { getMessages, currentChat, isFromOffers, getNegotiationComments } = this.props;
    if (currentChat) {
      getMessages({ groupId: currentChat.groupId });
      return;
    }
    if (isFromOffers) {
      getNegotiationComments({ isNew: false });
    }
  };

  public componentDidUpdate = (): void => {
    const { isScrollToBottom } = this.props;
    if (isScrollToBottom) {
      this.scrollToBottom();
    }
  };

  public render(): React.ReactNode {
    const {
      messages,
      shouldEnableOuterScroll,
      isLoading,
      isFromOffers,
      negotiationComments,
      shouldReverseOrder = true,
    } = this.props;
    const isEmptyState = isEmpty(isFromOffers ? negotiationComments : messages?.messageResult);
    if (isLoading && isEmptyState) return <Loader visible />;
    if (isEmptyState) return this.renderEmptyView();
    const messagesToShow = isFromOffers ? negotiationComments : messages?.messageResult;
    let messageKeys: string[] = [];
    if (messagesToShow) {
      messageKeys = shouldReverseOrder ? Object.keys(messagesToShow).reverse() : Object.keys(messagesToShow);
    }

    return (
      <ScrollView
        ref={this.scrollRef}
        refreshControl={this.renderRefreshControl()}
        showsVerticalScrollIndicator={false}
        onTouchStart={shouldEnableOuterScroll ? (): void => shouldEnableOuterScroll(false) : undefined}
        onMomentumScrollEnd={this.controlScroll}
        onScrollEndDrag={this.controlScroll}
        style={styles.container}
      >
        {messagesToShow &&
          messageKeys.map((key) => {
            const formattedByTime = this.getFormattedMessage(messagesToShow[key], 'h:mm:ss');
            const formattedTimeKeys = shouldReverseOrder
              ? Object.keys(formattedByTime).reverse()
              : Object.keys(formattedByTime);
            return (
              <>
                {this.renderSeparator(key)}
                {formattedTimeKeys.map((time) => {
                  const user = this.getMessageByUser(formattedByTime[time]);
                  return (
                    <>
                      {user.map((item, index) => {
                        return <MessageCard key={index} details={item} />;
                      })}
                    </>
                  );
                })}
              </>
            );
          })}
      </ScrollView>
    );
  }

  private renderSeparator = (key: string): ReactElement => {
    return (
      <View style={styles.separator}>
        <View style={styles.dividerView} />
        <Label type="large">{key}</Label>
        <View style={styles.dividerView} />
      </View>
    );
  };

  private renderEmptyView = (): ReactElement => {
    const { t, isFromOffers } = this.props;
    return (
      <View style={styles.flexOne}>
        {this.renderSeparator(t('common:today'))}
        <View style={styles.emptyViewContent}>
          <Label type="large" style={styles.emptyText}>
            {t(isFromOffers ? 'noCommentsYet' : 'noMessageYet')}
          </Label>
        </View>
      </View>
    );
  };

  private renderRefreshControl = (): ReactElement => {
    const { isRefreshing } = this.state;
    return <RefreshControl refreshing={isRefreshing} onRefresh={this.onLoad} />;
  };

  private onLoad = (): void => {
    const { getMessages, messages, shouldScrollToBottom, currentChat } = this.props;
    const link = messages && !!messages.links.next ? messages.links.next : '';
    if (shouldScrollToBottom) {
      shouldScrollToBottom();
    }

    if (!link || !currentChat) return;
    getMessages({
      groupId: currentChat.groupId,
      cursor: link,
    });
  };

  private controlScroll = (): void => {
    const { shouldEnableOuterScroll } = this.props;
    if (shouldEnableOuterScroll) {
      shouldEnableOuterScroll(true);
    }
  };

  private getFormattedMessage = (data: Message[], format: string): IMessageKeyValue => {
    return groupBy(data, (results: Message) => {
      return DateUtils.getUtcDisplayDate(results.createdAt, format);
    });
  };

  private getMessageByUser = (data: Message[]): Message[][] => {
    const dataObj = groupBy(data, (results: Message) => {
      return results.user.id;
    });
    return Object.keys(dataObj).map((id) => {
      return dataObj[id];
    });
  };

  private scrollToBottom = (): void => {
    setTimeout(() => {
      this.scrollRef.current?.scrollToEnd({ animated: false });
    }, 100);
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getMessages, getCurrentChatDetail, getMessagesLoading } = CommonSelectors;
  const { getNegotiationComments } = OfferSelectors;
  return {
    messages: getMessages(state),
    currentChat: getCurrentChatDetail(state),
    isLoading: getMessagesLoading(state),
    negotiationComments: getNegotiationComments(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getMessages } = CommonActions;
  const { getNegotiationComments } = OfferActions;
  return bindActionCreators({ getMessages, getNegotiationComments }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetMore)(MessagePreview));

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  flexOne: {
    flex: 1,
  },
  height: {
    maxHeight: 500,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  dividerView: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    width: 100,
  },
  emptyViewContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: theme.colors.darkTint8,
  },
});
