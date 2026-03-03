import { ExpectedResult as SalesReportByDays } from '@cds-models/db/types/SalesReport';

import { SalesReportRepository } from '@/repositories/sales-report/protocols';
import { SalesReportService } from './protocols';
import { AbstractError, NotFoundError, ServerError } from '@/errors';
import { Either, left, right } from '@sweet-monads/either';

export class SalesReportServiceImpl implements SalesReportService {
    constructor(private repository: SalesReportRepository) {}

    public async findBydays(days: 7): Promise<Either<AbstractError, SalesReportByDays[]>> {
        try {
            const reportData = await this.repository.findBydays(days);
            if (!reportData) {
                const stack = new Error().stack as string;
                return left(new NotFoundError('Nenhum dado encontrado para os parametros informados', stack));
            }
            const mappedData = reportData?.map((r) => r.toObject());
            return right(mappedData);
        } catch (error) {
            const errorInstance = error as Error;
            return left(new ServerError(errorInstance.stack as string, errorInstance.message));
        }
    }

    public async findByCustomerId(customerId: string): Promise<Either<AbstractError, SalesReportByDays[]>> {
        try {
            const reportData = await this.repository.findByCustomer(customerId);
            if (!reportData) {
                const stack = new Error().stack as string;
                return left(new NotFoundError('Nenhum dado encontrado para os parametros informados', stack));
            }
            const mappedData = reportData?.map((r) => r.toObject());
            return right(mappedData);
        } catch (error) {
            const errorInstance = error as Error;
            return left(new ServerError(errorInstance.stack as string, errorInstance.message));
        }
    }
}
