import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';

class LedgerUtils {
  // Filter the data by CREDIT or DEBIT
  public filterByType = <D extends { entryType: string | T }, T>(type: T, data: D[]): D[] => {
    return data.filter((ledger: D) => ledger.entryType === type);
  };

  // Sums up the total by CREDIT or DEBIT
  public totalByType = (type: LedgerTypes, data: GeneralLedgers[]): number => {
    const ledgersByCategory: GeneralLedgers[] = this.filterByType<GeneralLedgers, LedgerTypes>(type, data);
    return ledgersByCategory.reduce((accumulator: number, ledger: GeneralLedgers) => accumulator + ledger.amount, 0);
  };

  // Format payment-mode data
  public formattedPaymentModes = (modes: Unit[]): IDropdownOption[] =>
    modes.map((mode) => ({
      label: StringUtils.toTitleCase(mode.label),
      value: mode.code, // Using code here to make it backend compatible.
    }));
}

const ledgerUtils = new LedgerUtils();
export { ledgerUtils as LedgerUtils };
