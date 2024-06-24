import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export interface ICoinTransaction {
  coins: number;
  transaction_date: string;
  transaction_type: string;
}

@JsonObject('CoinTransaction')
export class CoinTransaction {
  @JsonProperty('coins', Number)
  private _coins = 0;

  @JsonProperty('transaction_date', String)
  private _transactionDate = '';

  @JsonProperty('transaction_type', String)
  private _transactionType = '';

  @JsonProperty('title', String)
  private _title = '';

  get coins(): number {
    return this._coins;
  }

  get transactionDate(): string {
    return this._transactionDate;
  }

  get transactionType(): TransactionType {
    return this._transactionType as TransactionType;
  }

  get title(): string {
    return this._title;
  }
}
