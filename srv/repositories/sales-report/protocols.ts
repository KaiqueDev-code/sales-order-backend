import { SalesReportsModel } from "@/models/sales-report";

export interface SalesReportRepository{
    findBydays(days: number): Promise<SalesReportsModel[] | null>;
    findByCustomer(customerId: string): Promise<SalesReportsModel[] | null>;
} 