import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';

interface IProps {
  isEditable?: boolean;
  message: string;
  onChangeMessage: (value: string) => void;
  placeholder?: string;
  submitButtonTitle?: string;
  onSubmit: () => void;
  showCancel?: boolean;
  onCancelPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const EditableTextArea = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const {
    isEditable = false,
    message,
    placeholder = t('property:writeComment'),
    submitButtonTitle = t('common:submit'),
    onChangeMessage,
    showCancel = true,
    onCancelPress,
    onSubmit,
    containerStyle = {},
  } = props;
  const [editable, setEditable] = React.useState(isEditable);

  // TODO: (Shivam: 10/3/21) add edit icon for edit functionality
  const renderCommentBox = (): React.ReactElement => {
    return (
      <View style={[styles.commentContainer, containerStyle]}>
        <View style={styles.commentWithIcon}>
          <Label textType="regular" type="regular" style={styles.commentLabel}>
            {t('common:comment')}
          </Label>
          {/* <Icon name={icons.noteBook} size={11} onPress={(): void => setEditable(true)} /> */}
        </View>
        <Label textType="regular" type="large" style={styles.comment}>
          {message}
        </Label>
      </View>
    );
  };

  const onSubmitPress = (): void => {
    setEditable(false);
    onSubmit();
  };

  return (
    <>
      {editable ? (
        <>
          <TextArea
            value={message}
            isCountRequired={false}
            placeholder={placeholder || t('property:writeComment')}
            textAreaStyle={styles.textArea}
            onMessageChange={onChangeMessage}
          />
          <View style={styles.buttonContainer}>
            {showCancel && onCancelPress && (
              <Button
                onPress={onCancelPress}
                type="secondary"
                title={t('common:cancel')}
                containerStyle={styles.button}
                titleStyle={styles.buttonTitle}
              />
            )}
            <Button
              type="primary"
              title={submitButtonTitle}
              containerStyle={[styles.button, styles.submit]}
              titleStyle={styles.buttonTitle}
              onPress={onSubmitPress}
            />
          </View>
        </>
      ) : (
        renderCommentBox()
      )}
    </>
  );
};

export default React.memo(EditableTextArea);

const styles = StyleSheet.create({
  buttonTitle: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  submit: {
    marginStart: 12,
  },
  button: {
    flex: 0,
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textArea: {
    height: 80,
    borderRadius: 4,
  },
  commentWithIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentContainer: {
    backgroundColor: theme.colors.gray12,
    padding: 16,
  },
  comment: {
    marginTop: 6,
    color: theme.colors.darkTint3,
  },
  commentLabel: {
    color: theme.colors.darkTint4,
  },
});
