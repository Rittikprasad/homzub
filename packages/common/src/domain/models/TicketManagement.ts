import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('TicketCount')
export class TicketCount {
  @JsonProperty('pending_tickets', Number)
  private _pendingTickets = 0;

  get pendingTickets(): number {
    return this._pendingTickets;
  }
}

@JsonObject('TicketManagement')
export class TicketManagement {
  @JsonProperty('count', TicketCount)
  private _count = new TicketCount();

  get count(): TicketCount {
    return this._count;
  }
}
