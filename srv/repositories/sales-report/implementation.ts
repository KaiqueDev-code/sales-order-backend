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

        const sql = SELECT.from('sales.SalesOrderHeader')
        .columns(
            'id as SalesOrderId',
            'totalAmount as salesOrderTotalAmount',
            'customer.id as customerId',
            'customer.firstName || " " || customer.lastName as customerFullName'
        )
        .where({createdAt: {between: substractedDaysISOString, and: today}});
        const SalesReport = await cds.run(sql);
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
