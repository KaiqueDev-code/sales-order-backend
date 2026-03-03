import cds from '@sap/cds';

import { SalesOrderLogRepository } from './protocols';
import { SalesOrderLogsModel } from '@/models-manual';

export class SalesOrderLogRepositoryImpl implements SalesOrderLogRepository {
    public async create(logs: SalesOrderLogsModel[]): Promise<void> {
        const logsObject = logs.map((log) => log.ToObject());
        await cds.create('sales.SalesOrderLogs').entries(logsObject);
    }
}
