import { User } from '@sap/cds';

import { Payload as BulkCreateSalesOrderPayload } from '@models/db/types/BulkCreateSalesOrder';
import { SalesOrderHeader } from '@models/sales';
import { CustomerModel, ProductModel } from '@/models-manual';

export type CreationPayloadValidationResult = {
    hasError: boolean;
    totalAmount?: number;
    products?: ProductModel[];
    customer?: CustomerModel;
    error?: Error;
    headers?: BulkCreateSalesOrderPayload[];
};

export interface SalesOrderHeaderService {
    beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult>;
    afterCreate(params: SalesOrderHeader, loggedUser: User): Promise<void>;
    bulkcreate(headers: BulkCreateSalesOrderPayload[], loggedUser: User): Promise<CreationPayloadValidationResult>;
    cloneSalesOrder(id: string, loggedUser: User): Promise<CreationPayloadValidationResult>;
}
