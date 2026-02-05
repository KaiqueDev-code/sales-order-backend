import { SalesOrderLogsModel } from "srv/models/sales-order-logs";

export interface SalesOrderLogRepository {
    create(logs: SalesOrderLogsModel[]): Promise<void>;
}