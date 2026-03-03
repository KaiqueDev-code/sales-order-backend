import { Customers } from '@cds-models/sales';

// Responsável por orquestrar as requisições do controller com o serviço.
import { CustomerController } from '@/controllers/customer/protocols';
import { CustomerService } from '@/services/customer/protocols';
import { BaseControllerImpl, BaseControllerResponse } from '../base';

// Controller que gerencia as operações de customer
export class CustomerControllerImp extends BaseControllerImpl implements CustomerController {
    // Injeta o serviço de customer como dependência
    constructor(private readonly service: CustomerService) {
        super();
    }

    // Método executado após leitura de customers, delegando ao serviço
    public afterRead(customerList: Customers): BaseControllerResponse {
        const result = this.service.afterRead(customerList);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(result.value);
    }
}
