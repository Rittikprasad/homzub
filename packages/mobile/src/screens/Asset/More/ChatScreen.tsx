import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { MessageRepository } from '@homzhub/common/src/domain/repositories/MessageRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { NotificationService } from '@homzhub/mobile/src/services/NotificationService';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { IApiClientError } from '@homzhub/common/src/network/ApiClientError';
import { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import ChatInputBox from '@homzhub/common/src/components/molecules/ChatInputBox';
import Menu, { IMenu } from '@homzhub/common/src/components/molecules/Menu';
import MessagePreview from '@homzhub/common/src/components/organisms/MessagePreview';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { IGetMessageParam, IMessagePayload, MessageAction } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IChatPayload } from '@homzhub/common/src/modules/common/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IAttachmentResponse } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { ICurrentOffer, IGetNegotiationComments } from '@homzhub/common/src/modules/offers/interfaces';

enum MenuItems {
  VIEW_INFO = 'VIEW_INFO',
}

interface IDispatchProps {
  getMessages: (param: IGetMessageParam) => void;
  setAttachment: (payload: string) => void;
  clearAttachment: () => void;
  clearChatDetail: () => void;
  getNegotiationComments: (payload: IGetNegotiationComments) => void;
}

interface IStateProps {
  currentChat: IChatPayload | null;
  currentOfferPayload: ICurrentOffer | null;
}

interface IScreenState {
  isScrollToBottom: boolean;
  isMenuVisible: boolean;
  attachment: ImagePickerResponse;
  users: string;
  assetName: string;
  isLoading: boolean;
}

type libraryProps = WithTranslation & NavigationScreenProps<CommonParamList, ScreensKeys.ChatScreen>;
type Props = libraryProps & IDispatchProps & IStateProps;

class ChatScreen extends Component<Props, IScreenState> {
  public state = {
    isScrollToBottom: true,
    isMenuVisible: false,
    attachment: {} as ImagePickerResponse,
    users: '',
    isLoading: false,
    assetName: '',
  };

  public async componentDidMount(): Promise<void> {
    const {
      route: { params },
    } = this.props;
    if (!(await NotificationService.checkIsPermissionGranted())) {
      await NotificationService.requestPermisson();
    }

    if (params && params.isFromOffers) {
      this.getUsersInOfferChat().then();
    }
  }

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    const {
      route: { params: currentParams },
      navigation,
    } = this.props;
    if (currentParams?.isFromNotifications && currentParams?.isFromOffers) {
      this.getUsersInOfferChat().then();
      navigation.setParams({ ...currentParams, isFromNotifications: false });
    }
  }

  public render(): React.ReactNode {
    const { t, currentChat, route } = this.props;
    const { isScrollToBottom, isLoading, assetName, users } = this.state;
    const isFromOffers = Boolean(route?.params?.isFromOffers);

    const getPageTitle = (): string => {
      if (isFromOffers) return assetName;
      if (currentChat) return currentChat.groupName;

      return t('common:message');
    };

    const isPreview = (isFromOffers && !currentChat) || (!isFromOffers && currentChat);

    return (
      <>
        <UserScreen
          title={this.getTitle()}
          subTitle={isFromOffers ? users : undefined}
          pageTitle={getPageTitle()}
          onBackPress={this.onGoBack}
          scrollEnabled={false}
          rightNode={!isFromOffers && currentChat ? this.renderRightNode() : undefined}
          onNavigateCallback={this.handleNavigationCallback}
          loading={isLoading}
        >
          {isPreview ? (
            <MessagePreview
              isFromOffers={isFromOffers}
              isScrollToBottom={isScrollToBottom}
              shouldScrollToBottom={this.updateScroll}
              shouldReverseOrder={!isFromOffers}
            />
          ) : (
            <EmptyState
              isIconRequired={false}
              title={t('assetMore:noActiveThread')}
              subTitle={t('assetMore:accessOldMessage')}
            />
          )}
        </UserScreen>
        {isPreview && this.renderInputView()}
      </>
    );
  }

  private renderInputView = (): React.ReactElement => {
    const { route } = this.props;
    const isFromOffers = Boolean(route?.params?.isFromOffers);
    return (
      <KeyboardAvoidingView behavior={PlatformUtils.isIOS() ? 'padding' : undefined}>
        <ChatInputBox
          containerStyle={styles.inputBox}
          onInputFocus={this.onInputFocus}
          onFocusOut={this.onInputFocusOut}
          onSubmit={this.onSendMessage}
          onUploadImage={this.onUploadAttachment}
          onPressCamera={this.onClickImage}
          hasAttachments={!isFromOffers}
        />
      </KeyboardAvoidingView>
    );
  };

  private renderRightNode = (): React.ReactElement => {
    const { t } = this.props;
    const menuItems = this.getMenuItems();
    return (
      <Menu
        data={menuItems}
        onSelect={this.onSelectMenuItem}
        sheetHeight={200}
        optionTitle={t('assetMore:chatOptions')}
      />
    );
  };

  private onGoBack = (): void => {
    const { navigation, clearChatDetail } = this.props;
    this.setState({ isMenuVisible: false });
    this.handleNavigationCallback().then(() => {
      clearChatDetail();
      navigation.goBack();
    });
  };

  private onInputFocus = (): void => {
    this.setState({ isScrollToBottom: true });
  };

  private onInputFocusOut = (): void => {
    this.setState({ isScrollToBottom: false });
  };

  private onSelectMenuItem = (value: string): void => {
    const { navigation, currentChat, route, t } = this.props;
    if (value === MenuItems.VIEW_INFO && currentChat) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.GroupChatInfo, {
        groupId: currentChat.groupId,
        screenTitle: route?.params?.isFromPortfolio ? t('assetPortfolio:portfolio') : this.getTitle(),
      });
      this.handleMenu();
    }
  };

  private onClickImage = (): void => {
    const { setAttachment } = this.props;
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      compressImageMaxWidth: 400,
      compressImageMaxHeight: 400,
      compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
      useFrontCamera: true,
      cropping: true,
    })
      .then((response: ImagePickerResponse | ImagePickerResponse[]) => {
        const image = response as ImagePickerResponse;
        this.setState({ attachment: image });
        setAttachment(image.path);
      })
      .catch((err) => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          AlertHelper.error({ message: err.message });
        }
      });
  };

  private onUploadAttachment = async (): Promise<void> => {
    const { setAttachment } = this.props;
    try {
      const response: ImagePickerResponse | ImagePickerResponse[] = await ImagePicker.openPicker({
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
        includeBase64: true,
        mediaType: 'photo',
      });
      const image = response as ImagePickerResponse;
      this.setState({ attachment: image });
      setAttachment(image.path);
    }catch (e: any) {      if (e.code !== 'E_PICKER_CANCELLED') {
        AlertHelper.error({ message: e.message });
      }
    }
  };

  private onSendMessage = (text: string, isAttachment?: boolean): void => {
    const { currentChat, route } = this.props;
    const { attachment } = this.state;
    if (route?.params?.isFromOffers) {
      this.postComment(text);
      return;
    }
    if (!currentChat) return;

    let payload: IMessagePayload = {
      groupId: currentChat.groupId,
      message: text,
      attachments: [],
    };

    if (isAttachment) {
      const formData = new FormData();
      formData.append('files[]', {
        // @ts-ignore
        name: PlatformUtils.isIOS()
          ? attachment.filename ?? attachment.path.substring(attachment.path.lastIndexOf('/') + 1)
          : attachment.path.substring(attachment.path.lastIndexOf('/') + 1),
        uri: attachment.path,
        type: attachment.mime,
      });

      AttachmentService.uploadImage(formData, AttachmentType.CHAT_DOCUMENT)
        .then((res: IAttachmentResponse) => {
          const { data } = res;
          const attachmentId: number = data[0].id;
          payload = {
            ...payload,
            attachments: [attachmentId],
          };
          this.handleSend(payload);
        })
        .catch((e: IApiClientError) => {
          AlertHelper.error({ message: e.message });
        });
    }

    if (!isAttachment && !!payload.message) {
      this.handleSend(payload);
    }
  };

  private getTitle = (): string => {
    const { t, route } = this.props;
    const isFromOffers = Boolean(route?.params?.isFromOffers);
    const isFromProperty = Boolean(route?.params?.isFromPortfolio);

    if (isFromProperty && isFromOffers) return t('assetPortfolio:portfolio');
    if (isFromProperty) return route?.params?.screenTitle ?? '';

    return t('assetMore:more');
  };

  private postComment = async (comment: string): Promise<void> => {
    const { currentOfferPayload, getNegotiationComments } = this.props;
    if (currentOfferPayload) {
      try {
        const payload: ICurrentOffer = { ...currentOfferPayload, threadId: currentOfferPayload.threadId ?? '' };
        await OffersRepository.postNegotiationComments(payload, comment);
        getNegotiationComments({ isNew: true });
      }catch (e: any) {        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
  };

  private getUsersInOfferChat = async (): Promise<void> => {
    const { currentOfferPayload } = this.props;
    if (currentOfferPayload) {
      const payload: ICurrentOffer = { ...currentOfferPayload, threadId: currentOfferPayload.threadId ?? '' };
      try {
        this.setState({ isLoading: true });
        const response = await OffersRepository.getUsersInOfferThread(payload);
        const userNames = response.users.map((user) => user.fullName).join(', ');
        this.setState({
          users: userNames,
          assetName: response.name.split(',')[0],
          isLoading: false,
        });
      }catch (e: any) {        this.setState({ isLoading: false });
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
  };

  private handleSend = (payload: IMessagePayload): void => {
    const { getMessages, currentChat } = this.props;
    MessageRepository.sendMessage(payload)
      .then(() => {
        getMessages({ groupId: payload.groupId, isNew: true });
        if (currentChat) {
          AnalyticsService.track(EventType.NewMessage, { group_name: currentChat.groupName });
        }
      })
      .catch((err) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      });
  };

  private handleNavigationCallback = async (): Promise<void> => {
    const { currentChat, clearAttachment, navigation } = this.props;

    clearAttachment();
    this.setState({ isMenuVisible: false });

    if (!currentChat) return;
    try {
      await MessageRepository.updateMessage({
        groupId: currentChat.groupId,
        data: {
          action: MessageAction.READ,
          payload: {
            read_at: DateUtils.getDisplayDate(new Date().toISOString(), DateFormats.ISO8601),
          },
        },
      });
    }catch (err: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      navigation.goBack();
    }
  };

  private getMenuItems = (): IMenu[] => {
    const { t } = this.props;
    return [{ icon: icons.info, label: t('assetMore:viewInfo'), value: MenuItems.VIEW_INFO }];
  };

  private handleMenu = (): void => {
    const { isMenuVisible } = this.state;
    this.setState({ isMenuVisible: !isMenuVisible });
  };

  public updateScroll = (): void => {
    this.setState({
      isScrollToBottom: false,
    });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getCurrentChatDetail } = CommonSelectors;
  const { getOfferPayload } = OfferSelectors;
  return {
    currentChat: getCurrentChatDetail(state),
    currentOfferPayload: getOfferPayload(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getMessages, setAttachment, clearAttachment, clearChatDetail } = CommonActions;
  const { getNegotiationComments } = OfferActions;
  return bindActionCreators(
    { getMessages, setAttachment, clearAttachment, clearChatDetail, getNegotiationComments },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ChatScreen));

const styles = StyleSheet.create({
  inputBox: {
    marginHorizontal: 16,
    marginBottom: 4,
  },
});
