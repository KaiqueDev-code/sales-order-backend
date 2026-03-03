import { AbstractError } from '@/errors';
import { Either } from '@sweet-monads/either';
import { ExpectedResult as SalesReportByDays } from '@cds-models/db/types/SalesReport';

export interface SalesReportService {
    findBydays(days: number): Promise<Either<AbstractError, SalesReportByDays[]>>;
    findByCustomerId(customerId: string): Promise<Either<AbstractError, SalesReportByDays[]>>;
}
