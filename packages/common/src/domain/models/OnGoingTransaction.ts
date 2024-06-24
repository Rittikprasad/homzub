import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ITransactionDetail, TransactionDetail } from '@homzhub/common/src/domain/models/TransactionDetail';

interface IOnGoingTransaction {
  id: number;
  name: string;
  lease_transaction?: ITransactionDetail;
}

@JsonObject('OnGoingTransaction')
export class OnGoingTransaction {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('lease_transaction', TransactionDetail, true)
  private _leaseTransaction = new TransactionDetail();

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get leaseTransaction(): TransactionDetail {
    return this._leaseTransaction;
  }
}
