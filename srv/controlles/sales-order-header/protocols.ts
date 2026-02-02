import { SalesOrderHeaderModel } from "srv/models/sales-order-header-Model";
import { CreationPayloadValidationResult } from "srv/services/sales-order-header/protocols";

export interface SalesOrderHeaderController {
    beforeCreate(params: SalesOrderHeaderModel): Promise<CreationPayloadValidationResult>
}