import { BaseControllerResponse } from '../base';

export interface SalesReportController {
    findBydays(days: number): Promise<BaseControllerResponse>;
    findByCustomerId(customerId: string): Promise<BaseControllerResponse>;
}
