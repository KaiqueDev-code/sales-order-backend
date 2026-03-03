// Define o contrato que todo serviço de customer deve implementar.

import { AbstractError } from '@/errors';
import { Customers } from '@cds-models/sales';
import { Either } from '@sweet-monads/either';

// Interface que define os métodos disponíveis no serviço de customer
export interface CustomerService {
    // Processa a lista de customers após leitura
    afterRead(customerList: Customers): Either<AbstractError, Customers>;
}
