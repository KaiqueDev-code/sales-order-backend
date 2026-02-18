import cds from "@sap/cds";

import {ExpectedResult as SalesReportByDays} from "@cds-models/db/types/SalesReportByDays"; 

import { SalesReportsModel } from "@/models/sales-report";
import { SalesReportRepository } from "./protocols";

export class SalesReportRepositoryImpl implements SalesReportRepository {
    public async findBydays(days: number): Promise<SalesReportsModel[] | null> {

        const today = new Date().toISOString();
        const substractedDays = new Date();
        substractedDays.setDate(substractedDays.getDate() - days);
        const substractedDaysISOString = substractedDays.toISOString();

        const sql = this.getReportBaseSql().where({createdAt: {between: substractedDaysISOString, and: today}});
        const SalesReport = await cds.run(sql);
        if (SalesReport.length === 0) {
            return null;
        }
        return this.mapReportResult(SalesReport);
    }

    public async findByCustomer(customerId: string): Promise<SalesReportsModel[] | null> {
        const sql = this.getReportBaseSql().where({customer_id : customerId});
        const SalesReport = await cds.run(sql);
        if (SalesReport.length === 0) {
            return null;
        }
        return this.mapReportResult(SalesReport);
    }

    private getReportBaseSql (): cds.ql.SELECT<unknown, unknown >{
        return SELECT.from('sales.SalesOrderHeader')
        .columns(
            'id as SalesOrderId',
            'totalAmount as salesOrderTotalAmount',
            'customer.id as customerId',
            'customer.firstName || " " || customer.lastName as customerFullName'
        )
    }

    private mapReportResult (SalesReport: SalesReportByDays[]): SalesReportsModel[] | null{
        if (SalesReport.length === 0) {
            return null;
        }
        return SalesReport.map((salesReport : SalesReportByDays) => 
        SalesReportsModel.with({
            salesOrderId: salesReport.SalesOrderId as string,
            salesOrderHeaderTotalAmount: salesReport.SalesOrderHeaderTotalAmount as number,
            customerId: salesReport.customerId as string,
            customerFullName: salesReport.customerFullName as string,
        }));
    }
}
