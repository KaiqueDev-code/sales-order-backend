import { User } from '@sap/cds';

import { Payload as BulkCreateSalesOrderPayload } from '@models/db/types/BulkCreateSalesOrder';
import { CreationPayloadValidationResult } from '@/services/sales-order-header/protocols';
import { SalesOrderHeaderModel } from '@/models-manual';

export interface SalesOrderHeaderController {
    beforeCreate(params: SalesOrderHeaderModel): Promise<CreationPayloadValidationResult>;
    afterCreate(params: SalesOrderHeaderModel, loggedUser: User): Promise<void>;
    bulkcreate(headers: BulkCreateSalesOrderPayload[], loggedUser: User): Promise<CreationPayloadValidationResult>;
    cloneSalesOrder(id: string, loggedUser: User): Promise<CreationPayloadValidationResult>;
}
