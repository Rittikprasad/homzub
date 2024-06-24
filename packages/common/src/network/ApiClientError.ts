import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IApiClientError {
  message: string;
  statusCode?: number;
  description?: string;
  errors?: any[];
  original?: IError;
  errorType?: string;
  url?: string;
  method?: string;
}

interface IError {
  status: string;
  error?: any[];
  data?: any[];
}

export class ApiClientError extends Error {
  public details: IApiClientError;

  constructor(m: string, details: IApiClientError) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiClientError.prototype);
    this.details = details;
    AnalyticsService.track(EventType.Exception, details);
  }

  public toString(): string {
    const errorObject = {
      message: this.message,
      details: this.details,
    };

    return JSON.stringify(errorObject);
  }
}
