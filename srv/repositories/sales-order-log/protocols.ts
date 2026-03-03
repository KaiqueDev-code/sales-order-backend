import { SalesOrderLogsModel } from '@/models-manual';

export interface SalesOrderLogRepository {
    create(logs: SalesOrderLogsModel[]): Promise<void>;
}
