import { ExpectedResult as SalesReportByDays} from "@models/db/types/SalesReportByDays";
import { SalesReportController } from "./protocols";
import { SalesReportService } from "@/services/sales-report/protocols";

export class SalesReportControllerImpl implements SalesReportController {
    constructor(private readonly service: SalesReportService){}

    findBydays(days: number): Promise<SalesReportByDays[]> {
        return this.service.findBydays(days);
    }
}