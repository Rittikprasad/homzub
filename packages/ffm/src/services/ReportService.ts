import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Report, ReportStatus } from '@homzhub/common/src/domain/models/Report';
import { IReportAction } from '@homzhub/common/src/domain/repositories/interfaces';

export enum ReportAction {
  ACCEPT = 'Accept',
  REJECT = 'Reject',
  RESUME = 'Resume',
  VIEW = 'View',
  START = 'Start',
  SCHEDULED = 'Scheduled',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  AWAITING_APPROVAL = 'Awaiting Approval',
  OVERDUE = 'Overdue',
  CANCEL = 'Cancel',
}

class ReportService {
  public getActions = (payload: Report): IReportAction[] => {
    const {
      user: { userProfile },
    } = StoreProviderService.getStore().getState();
    const { status, completedPercentage, statusUpdatedBy, dueDate } = payload;
    const isLoggedInUser = userProfile?.id === statusUpdatedBy?.id;
    const { ACCEPT, RESUME, REJECT, REJECTED, START, ACCEPTED, VIEW, SCHEDULED, AWAITING_APPROVAL, OVERDUE } =
      ReportAction;
    switch (status) {
      case ReportStatus.NEW:
        if (DateUtils.isPastDate(dueDate)) {
          return [OVERDUE].map((item, index) => {
            return {
              title: item,
              color: theme.colors.error,
            };
          });
        }

        return [ACCEPT, REJECT].map((item) => {
          return {
            title: item,
            color: item === ACCEPT ? theme.colors.green : theme.colors.error,
            iconColor: item === ACCEPT ? theme.colors.green : theme.colors.error,
            icon: item === ACCEPT ? icons.circularCheckFilled : icons.circularCrossFilled,
            isReverse: true,
          };
        });
      case ReportStatus.ACCEPTED: {
        if (completedPercentage > 0) {
          return [`${completedPercentage}% Done`, RESUME].map((item, index) => {
            return {
              title: item,
              color: index === 1 ? theme.colors.mediumPriority : theme.colors.primaryColor,
              iconColor: index === 1 ? theme.colors.mediumPriority : theme.colors.primaryColor,
              ...(index === 1 && { icon: icons.play }),
            };
          });
        }
        if (DateUtils.isPastDate(dueDate)) {
          return [OVERDUE, START].map((item, index) => {
            return {
              title: item,
              color: index === 0 ? theme.colors.error : theme.colors.darkTint1,
              iconColor: theme.colors.green,
              ...(index === 1 && { icon: icons.play }),
            };
          });
        }
        return [SCHEDULED, START].map((item, index) => {
          return {
            title: item,
            color: index === 0 ? theme.colors.primaryColor : theme.colors.darkTint1,
            iconColor: theme.colors.green,
            ...(index === 1 && { icon: icons.play }),
          };
        });
      }
      case ReportStatus.CANCELLED:
      case ReportStatus.REJECTED: {
        return [`${StringUtils.toTitleCase(status)} by ${isLoggedInUser ? 'you' : statusUpdatedBy?.firstName}`].map(
          (item) => {
            return {
              title: item,
              color: theme.colors.error,
            };
          }
        );
      }
      case ReportStatus.AWAITING_APPROVAL:
        return [AWAITING_APPROVAL, VIEW].map((item, index) => {
          return {
            title: StringUtils.toTitleCase(item),
            color: index === 0 ? theme.colors.primaryColor : theme.colors.darkTint1,
            iconColor: theme.colors.primaryColor,
            ...(index === 1 && { icon: icons.play }),
          };
        });
      case ReportStatus.QA_APPROVED:
        return [ACCEPTED, VIEW].map((item, index) => {
          return {
            title: StringUtils.toTitleCase(item),
            color: index === 0 ? theme.colors.green : theme.colors.darkTint1,
            iconColor: theme.colors.primaryColor,
            ...(index === 1 && { icon: icons.play }),
          };
        });
      case ReportStatus.QA_REJECTED: {
        return [REJECTED, VIEW].map((item, index) => {
          return {
            title: StringUtils.toTitleCase(item),
            color: index === 0 ? theme.colors.error : theme.colors.darkTint1,
            iconColor: theme.colors.primaryColor,
            ...(index === 1 && { icon: icons.play }),
          };
        });
      }
      default:
        return [];
    }
  };
}

const reportService = new ReportService();
export { reportService as ReportService };
