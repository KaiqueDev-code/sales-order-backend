import { ExpectedResult as SalesReportByDays} from "@models/db/types/SalesReportByDays";


export interface SalesReportController {
     findBydays(days: number): Promise<SalesReportByDays[]>;
}