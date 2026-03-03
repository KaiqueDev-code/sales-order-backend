import { User } from '@sap/cds';

import { Payload as BulkCreateSalesOrderPayload } from '@models/db/types/BulkCreateSalesOrder';
import { SalesOrderHeaderController } from '@/controllers/sales-order-header/protocols';
import { SalesOrderHeaderModel } from '@/models-manual/sales-order-header';
import { CreationPayloadValidationResult, SalesOrderHeaderService } from '@/services/sales-order-header/protocols';

export class SalesOrderControllerImpl implements SalesOrderHeaderController {
    constructor(private readonly service: SalesOrderHeaderService) {}

    public async beforeCreate(params: SalesOrderHeaderModel): Promise<CreationPayloadValidationResult> {
        return this.service.beforeCreate(params);
    }

    public async afterCreate(params: SalesOrderHeaderModel, loggedUser: User): Promise<void> {
        return this.service.afterCreate(params, loggedUser);
    }

    public async bulkcreate(
        headers: BulkCreateSalesOrderPayload[],
        loggedUser: User
    ): Promise<CreationPayloadValidationResult> {
        return this.service.bulkcreate(headers, loggedUser);
    }

    public async cloneSalesOrder(id: string, loggedUser: User): Promise<CreationPayloadValidationResult> {
        return this.service.cloneSalesOrder(id, loggedUser);
    }
}
