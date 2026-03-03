import { SalesReportController } from '@/controllers/sales-report/protocols';
import { SalesReportControllerImpl } from '@/controllers/sales-report/implemantation';
import { salesReportService } from '@/factories/service/sales-reports';

const makeSalesReportController = (): SalesReportController => {
    return new SalesReportControllerImpl(salesReportService);
};

export const salesReportController = makeSalesReportController();
