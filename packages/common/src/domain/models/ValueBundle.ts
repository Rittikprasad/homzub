import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';
import { ServiceBundleItems } from '@homzhub/common/src/domain/models/ServiceBundleItems';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface IValueBundle {
  attachment: IAttachment;
  valueBundleItems: IUnit;
  id: number;
  name: string;
  label: string;
}

@JsonObject('ValueUnit')
export class ValueUnit {
  @JsonProperty('id', Number, true)
  private _id = 0;

  @JsonProperty('title', String, true)
  private _title = '';

  @JsonProperty('display_order', Number, true)
  private _displayOrder = -1;

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get displayOrder(): number {
    return this._displayOrder;
  }
}

@JsonObject('ValueBundle')
export class ValueBundle extends Unit {
  @JsonProperty('attachment', Attachment, true)
  private _attachment = new Attachment();

  @JsonProperty('value_bundle_items', [ServiceBundleItems], true)
  private _valueBundleItems = [new ServiceBundleItems()];

  @JsonProperty('display_order', Number, true)
  private _displayOrder = -1;

  @JsonProperty('is_asset_dependent', Boolean, true)
  private _isAssetDependent = false;

  @JsonProperty('benefits', [ValueUnit], true)
  private _benefits = [new ValueUnit()];

  @JsonProperty('terms_and_conditions', [ValueUnit], true)
  private _terms = [new ValueUnit()];

  get attachment(): Attachment {
    return this._attachment;
  }

  get valueBundleItems(): ServiceBundleItems[] {
    return this._valueBundleItems;
  }

  get displayOrder(): number {
    return this._displayOrder;
  }

  get benefits(): ValueUnit[] {
    return this._benefits;
  }

  get terms(): ValueUnit[] {
    return this._terms;
  }

  get isAssetDependent(): boolean {
    return this._isAssetDependent;
  }
}
