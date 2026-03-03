// Define o contrato que todo controller de customer deve implementar.
import { BaseControllerResponse } from '../base';
import { Customers } from '@cds-models/sales';

// Interface que define os métodos disponíveis no controller de customer
export interface CustomerController {
    // Processa a lista de customers após leitura
    afterRead(customerList: Customers): BaseControllerResponse;
}
