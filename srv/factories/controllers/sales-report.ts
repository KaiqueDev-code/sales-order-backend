import { SalesReportControllerImpl } from "@/controlles/sales-report/implemantation";
import { SalesReportController } from "@/controlles/sales-report/protocols";
import { salesReportService } from "@/factories/service/sales-reports";

const makeSalesReportController = () : SalesReportController => {
    return new SalesReportControllerImpl(salesReportService);
};

export const salesReportController = makeSalesReportController();