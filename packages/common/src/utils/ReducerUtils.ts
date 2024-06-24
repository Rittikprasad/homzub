/* eslint-disable prettier/prettier */
import { groupBy, cloneDeep } from 'lodash';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { Message, IMessageKeyValue, IMessages } from '@homzhub/common/src/domain/models/Message';
import { IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IImageSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { IPaginationPayload } from '@homzhub/common/src/modules/interfaces';
import { IFile } from '@homzhub/common/src/constants/AttachmentTypes';

class ReducerUtils {
  public formatMessages = (data: Message[], prevObj: IMessages | null, isNew?: boolean): IMessageKeyValue => {
    let resultObj = prevObj?.messageResult ?? {};
    let prevDate: string[] = [];

    const groupedData = groupBy(data, (item: Message) => {
      return DateUtils.getUtcDisplayDate(item.createdAt, 'DD, MMM YYYY');
    });
    if (prevObj) {
      prevDate = Object.keys(prevObj.messageResult);
    }

    Object.keys(groupedData).forEach((date) => {
      let result = groupedData[date];
      const isPresent = prevDate.includes(date);
      if (isPresent && prevObj && !isNew) {
        result = [...prevObj.messageResult[date], ...result];
      }
      resultObj = { ...resultObj, [date]: result };
    });

    return resultObj;
  };

  public removeAttachment = (key: string, prevData: IImageSource[] | IFile[]): IImageSource[] | IFile[] => {
    const attachments = cloneDeep(prevData);
    // @ts-ignore
    const index = attachments.findIndex((item) => item.filename || item.name === key);
    attachments.splice(index, 1);
    return attachments;
  };

  public formatFinancialTransactions = (
    initialState: IFinancialTransaction | null,
    payload: IPaginationPayload<IFinancialTransaction>
  ): IFinancialTransaction => {
    const { data, isReset } = payload;
    const newData =
      isReset || !initialState
        ? payload.data
        : ({
            ...initialState,
            count: data.count,
            links: data.links,
            results: [...initialState.results, ...data.results],
          } as IFinancialTransaction);
    return newData;
  };
}

const reducerUtils = new ReducerUtils();
export { reducerUtils as ReducerUtils };
