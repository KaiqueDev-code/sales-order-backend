import { SalesReportsModel } from '@/models-manual';
import { SalesReportRepository } from '@/repositories/sales-report/protocols';

export class SalesReportRepositoryStub implements SalesReportRepository {
    public async findByCustomer(customerId: string): Promise<SalesReportsModel[] | null> {
        const salesOrderId = crypto.randomUUID();
        const result: SalesReportsModel[] = [
            SalesReportsModel.with({
                salesOrderId,
                salesOrderHeaderTotalAmount: 5,
                customerId,
                customerFullName: 'Valid Customer'
            })
        ];
        return result;
    }

    public async findBydays(): Promise<SalesReportsModel[] | null> {
        const salesOrderId = crypto.randomUUID();
        const customerId = crypto.randomUUID();
        const result: SalesReportsModel[] = [
            SalesReportsModel.with({
                salesOrderId,
                salesOrderHeaderTotalAmount: 100,
                customerId,
                customerFullName: 'Valid Customer'
            })
        ];
        return result;
    }

    public async findByCustomerId(customerId: string): Promise<SalesReportsModel[] | null> {
        const salesOrderId = crypto.randomUUID();
        const result: SalesReportsModel[] = [
            SalesReportsModel.with({
                salesOrderId,
                salesOrderHeaderTotalAmount: 5,
                customerId,
                customerFullName: 'Valid Customer'
            })
        ];
        return result;
    }
}