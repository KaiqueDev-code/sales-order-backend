import { SalesReportsModel } from '@/models-manual';

export interface SalesReportRepository {
    findBydays(days: number): Promise<SalesReportsModel[] | null>;
    findByCustomerId(customerId: string): Promise<SalesReportsModel[] | null>;
}
