import { User } from "@sap/cds";
import { SalesOrderHeaderModel } from "srv/models/sales-order-header";
import { CreationPayloadValidationResult } from "srv/services/sales-order-header/protocols";

export interface SalesOrderHeaderController {
    beforeCreate(params: SalesOrderHeaderModel): Promise<CreationPayloadValidationResult>;
    afterCreate(params: SalesOrderHeaderModel, loggedUser: User): Promise<void>;
}
