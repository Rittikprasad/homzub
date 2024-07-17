import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { MessageRepository } from '@homzhub/common/src/domain/repositories/MessageRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { IApiClientError } from '@homzhub/common/src/network/ApiClientError';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ChatInputBox from '@homzhub/common/src/components/molecules/ChatInputBox';
import Menu, { IMenu } from '@homzhub/common/src/components/molecules/Menu';
import MessagePreview from '@homzhub/common/src/components/organisms/MessagePreview';
import { IGetMessageParam, IMessagePayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IChatPayload } from '@homzhub/common/src/modules/common/interfaces';
import { IAttachmentResponse } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { ICurrentOffer, IGetNegotiationComments } from '@homzhub/common/src/modules/offers/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

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

interface IProps {
  isFromOffers: boolean;
  popupRef: React.MutableRefObject<PopupActions | null>;
  onOpenModal: () => void;
  onCloseModal: () => void;
  isOpen?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

interface IScreenState {
  isScrollToBottom: boolean;
  isMenuVisible: boolean;
  attachment: ImagePickerResponse;
  users: string;
  assetName: string;
  isLoading: boolean;
}

type Props = IDispatchProps & IStateProps & IProps;

const ChatScreenPopover: React.FC<Props> = (props: Props) => {
  const [customState, setCustomState] = useState<IScreenState>({
    isScrollToBottom: true,
    isMenuVisible: false,
    attachment: {} as ImagePickerResponse,
    users: '',
    isLoading: false,
    assetName: '',
  });
  const {
    isFromOffers,
    currentChat,
    popupRef,
    onOpenModal,
    onCloseModal,
    isOpen,
    contentStyle,
    getMessages,
    currentOfferPayload,
  } = props;
  const { t } = useTranslation();
  const { isLoading, assetName, attachment } = customState;

  useEffect(() => {
    if (isFromOffers) {
      getUsersInOfferChat().then();
    }
  }, [currentOfferPayload]);

  const getPageTitle = (): string => {
    if (isFromOffers) return assetName;
    if (currentChat) return currentChat.groupName;

    return t('common:message');
  };

  const isPreview = (isFromOffers && !currentChat) || (!isFromOffers && currentChat);
  const renderRightNode = (): React.ReactElement => {
    const menuItems = getMenuItems();
    return (
      <Menu data={menuItems} onSelect={onSelectMenuItem} sheetHeight={200} optionTitle={t('assetMore:chatOptions')} />
    );
  };

  //   const onGoBack = (): void => { TODO: Popover Exit Scenario
  //     const { clearChatDetail } = props;
  //     setCustomState((prevState) => {
  //       return { ...prevState, isMenuVisible: false };
  //     });
  //     handleNavigationCallback().then(() => {
  //       clearChatDetail();
  //       // navigation.goBack(); Close Popover
  //     });
  //   };

  const onInputFocus = (): void => {
    setCustomState((prevState) => {
      return { ...prevState, isScrollToBottom: true };
    });
  };

  const onInputFocusOut = (): void => {
    setCustomState((prevState) => {
      return { ...prevState, isScrollToBottom: false };
    });
  };

  const onSelectMenuItem = (value: string): void => {
    if (value === MenuItems.VIEW_INFO && currentChat) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.GroupChatInfo, {
        groupId: currentChat.groupId,
        screenTitle: !isFromOffers ? t('assetPortfolio:portfolio') : getTitle(),
      });
      handleMenu();
    }
  };

  const onClickImage = (): void => {
    const { setAttachment } = props;
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
        setCustomState((prevState) => {
          return { ...prevState, attachment: image };
        });
        setAttachment(image.path);
      })
      .catch((err) => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          AlertHelper.error({ message: err.message });
        }
      });
  };

  const onUploadAttachment = async (): Promise<void> => {
    const { setAttachment } = props;
    try {
      const response: ImagePickerResponse | ImagePickerResponse[] = await ImagePicker.openPicker({
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
        includeBase64: true,
        mediaType: 'photo',
      });
      const image = response as ImagePickerResponse;
      setCustomState((prevState) => {
        return { ...prevState, attachment: image };
      });
      setAttachment(image.path);
    }catch (e: any) {      if (e.code !== 'E_PICKER_CANCELLED') {
        AlertHelper.error({ message: e.message });
      }
    }
  };

  const onSendMessage = (text: string, isAttachment?: boolean): void => {
    if (isFromOffers) {
      postComment(text);
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
          handleSend(payload);
        })
        .catch((e: IApiClientError) => {
          AlertHelper.error({ message: e.message });
        });
    }

    if (!isAttachment && !!payload.message) {
      handleSend(payload);
    }
  };

  const getTitle = (): string => {
    const isFromProperty = !isFromOffers;

    if (isFromProperty && isFromOffers) return t('assetPortfolio:portfolio');
    if (isFromProperty) return '';

    return t('assetMore:more');
  };

  const postComment = async (comment: string): Promise<void> => {
    const { getNegotiationComments } = props;
    if (currentOfferPayload) {
      try {
        const payload: ICurrentOffer = { ...currentOfferPayload, threadId: currentOfferPayload.threadId ?? '' };
        await OffersRepository.postNegotiationComments(payload, comment);
        getNegotiationComments({ isNew: true });
      }catch (e: any) {        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
  };

  const getUsersInOfferChat = async (): Promise<void> => {
    if (currentOfferPayload && currentOfferPayload.threadId) {
      const payload: ICurrentOffer = { ...currentOfferPayload, threadId: currentOfferPayload.threadId ?? '' };
      try {
        setCustomState((prevState) => {
          return { ...prevState, isLoading: true };
        });
        const response = await OffersRepository.getUsersInOfferThread(payload);
        const userNames = response.users.map((user) => user.fullName).join(', ');
        setCustomState((prevState) => {
          return {
            ...prevState,
            users: userNames,
            assetName: response.name.split(',')[0],
            isLoading: false,
          };
        });
      }catch (e: any) {        setCustomState((prevState) => {
          return { ...prevState, isLoading: false };
        });
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
  };

  const handleSend = (payload: IMessagePayload): void => {
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

  //   const handleNavigationCallback = async (): Promise<void> => { TODO: Popover Navigation Scenario
  //     clearAttachment();
  //     setCustomState((prevState) => {
  //       return { ...prevState, isMenuVisible: false };
  //     });

  //     if (!currentChat) return;
  //     try {
  //       await MessageRepository.updateMessage({
  //         groupId: currentChat.groupId,
  //         data: {
  //           action: MessageAction.READ,
  //           payload: {
  //             read_at: DateUtils.getDisplayDate(new Date().toISOString(), DateFormats.ISO8601),
  //           },
  //         },
  //       });
  //     }catch (err: any) {  //       AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
  //       // navigation.goBack(); Close Popover
  //     }
  //   };

  const getMenuItems = (): IMenu[] => {
    return [{ icon: icons.info, label: t('assetMore:viewInfo'), value: MenuItems.VIEW_INFO }];
  };

  const handleMenu = (): void => {
    setCustomState((prevState) => {
      return { ...prevState, isMenuVisible: !prevState.isMenuVisible };
    });
  };

  const updateScroll = (): void => {
    setCustomState((prevState) => {
      return {
        ...prevState,
        isScrollToBottom: false,
      };
    });
  };
  const renderInputView = (): React.ReactElement => {
    return (
      <ChatInputBox
        containerStyle={styles.inputBox}
        onInputFocus={onInputFocus}
        onFocusOut={onInputFocusOut}
        onSubmit={onSendMessage}
        onUploadImage={onUploadAttachment}
        onPressCamera={onClickImage}
        hasAttachments={!isFromOffers}
      />
    );
  };
  const { users, isScrollToBottom } = customState;
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const renderPopoverContent = (): React.ReactElement => {
    return (
      <View>
        <View style={styles.modalHeader}>
          {/* title={getTitle()} */}
          {/* onNavigateCallback={handleNavigationCallback} */}
          <Typography variant="label" size="small" fontWeight="bold">
            {getPageTitle()}
          </Typography>
          <Typography variant="label" size="small" fontWeight="bold">
            {isFromOffers ? users : undefined}
          </Typography>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint7}
            onPress={onCloseModal}
            containerStyle={styles.closeButton}
          />
        </View>
        <Divider containerStyles={styles.verticalStyle} />
        <View style={styles.modalContent}>
          {!isFromOffers && !!currentChat && <View> {renderRightNode()} </View>}

          <View>
            <View>
              {isPreview ? (
                <MessagePreview
                  isFromOffers={isFromOffers}
                  isScrollToBottom={isScrollToBottom}
                  shouldScrollToBottom={updateScroll}
                  shouldReverseOrder={!isFromOffers}
                />
              ) : (
                <EmptyState
                  isIconRequired={false}
                  title={t('assetMore:noActiveThread')}
                  subTitle={t('assetMore:accessOldMessage')}
                />
              )}
            </View>
          </View>
        </View>
        <View>{isPreview && renderInputView()}</View>
      </View>
    );
  };

  return (
    <View>
      <Loader visible={isLoading} />
      <Popover
        content={renderPopoverContent()}
        popupProps={{
          open: isOpen,
          closeOnDocumentClick: false,
          arrow: false,
          contentStyle: {
            maxHeight: '100%',
            alignItems: 'stretch',
            width: isMobile ? 320 : 650,
            borderRadius: 8,
            overflow: 'auto',
            height: 500,
            ...{ contentStyle },
          },
          children: undefined,
          modal: true,
          position: 'center center',
          onOpen: onOpenModal,
          onClose: onCloseModal,
        }}
        forwardedRef={popupRef}
      />
    </View>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreenPopover);

const styles = StyleSheet.create({
  inputBox: {
    marginTop: 8,
  },
  modalHeader: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  modalContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'calc(500px * 0.7)',
  },
  verticalStyle: {
    marginTop: 20,
  },
  closeButton: {
    zIndex: 1,
    position: 'absolute',
    right: 12,
    cursor: 'pointer',
    color: theme.colors.darkTint7,
  },
});
