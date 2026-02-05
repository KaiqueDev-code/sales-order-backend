import { SalesOrderHeaderModel } from "srv/models/sales-order-header";
import { CreationPayloadValidationResult, SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";
import { SalesOrderHeaderController } from "./protocols";
import { User } from "@sap/cds";

export class SalesOrderControllerImpl implements SalesOrderHeaderController{
    constructor(private readonly service: SalesOrderHeaderService){}

    public async beforeCreate(params: SalesOrderHeaderModel): Promise<CreationPayloadValidationResult> {
        return this.service.beforeCreate(params);
    }

    public async afterCreate(params: SalesOrderHeaderModel, loggedUser: User): Promise<void> {
        return this.service.afterCreate(params, loggedUser);
    }
}