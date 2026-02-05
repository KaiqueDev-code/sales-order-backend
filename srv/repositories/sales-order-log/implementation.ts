import cds from '@sap/cds'

import { SalesOrderLogsModel } from "srv/models/sales-order-logs";
import { SalesOrderLogRepository } from "./protocols";

export class SalesOrderLogRepositoryImp implements SalesOrderLogRepository{
    public async create(logs: SalesOrderLogsModel[]): Promise<void> {
        const logsObject = logs.map(log => log.ToObject());
        await cds.create('sales.SalesOrderLogs').entries(logsObject)
    }
}