import { SalesOrderHeaderModel } from "srv/models/sales-order-header-Model";


export type CreationPayloadValidationResult = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
}

export interface SalesOrderHeaderService {
    beforeCreate(params: SalesOrderHeaderModel): Promise<CreationPayloadValidationResult>
}