import { User } from "@sap/cds";

import { SalesOrderHeaders } from "@models/sales";
import { SalesOrderHeaderModel } from "srv/models/sales-order-header";


export type CreationPayloadValidationResult = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
}

export interface SalesOrderHeaderService {
    beforeCreate(params: SalesOrderHeaderModel): Promise<CreationPayloadValidationResult>;
    afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise <void>;
}