import { SalesOrderHeaderModel } from "srv/models/sales-order-header-Model";
import { CreationPayloadValidationResult, SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";
import { SalesOrderHeaderController } from "./protocols";

export class SalesOrderControllerImpl implements SalesOrderHeaderController{
    constructor(private readonly service: SalesOrderHeaderService){}

    public async beforeCreate(params: SalesOrderHeaderModel): Promise<CreationPayloadValidationResult> {
        return this.service.beforeCreate(params);
    }

}