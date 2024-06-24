import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { InvoiceId, InvoiceSummary } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IPaymentPayload,
  IOrderSummaryPayload,
  IPaymentParams,
  IInvoiceSummaryPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  valueAddedServices: 'v1/value-added-services/payment/',
  valueAddedServicesPayment: 'v1/value-added-services/payment-response/',
  initiatePayment: (invoiceId: number): string => `v1/invoices/${invoiceId}/razorpay-orders/`,
  processPayment: 'v1/invoices/razorpay-payments/',
  invoiceSummary: 'v1/invoices/summary/',
};

class PaymentRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public valueAddedServices = async (payload: IOrderSummaryPayload): Promise<Payment> => {
    const response = await this.apiClient.post(ENDPOINTS.valueAddedServices, payload);
    return ObjectMapper.deserialize(Payment, response);
  };

  public valueAddedServicesPayment = async (paymentDetails: IPaymentParams): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.valueAddedServicesPayment, paymentDetails);
  };

  public initiatePayment = async (invoiceId: number): Promise<Payment> => {
    const response = await this.apiClient.put(ENDPOINTS.initiatePayment(invoiceId));
    return ObjectMapper.deserialize(Payment, response);
  };

  public processPayment = async (data: IPaymentPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.processPayment, data);
  };

  public getInvoiceSummary = async (data: IInvoiceSummaryPayload): Promise<InvoiceSummary> => {
    const response = await this.apiClient.post(ENDPOINTS.invoiceSummary, data);
    return ObjectMapper.deserialize(InvoiceSummary, response);
  };

  public getInvoice = async (data: IInvoiceSummaryPayload): Promise<InvoiceId> => {
    const response = await this.apiClient.post(ENDPOINTS.invoiceSummary, data);
    return ObjectMapper.deserialize(InvoiceId, response);
  };
}

const paymentRepository = new PaymentRepository();
export { paymentRepository as PaymentRepository };
