// Responsável por criar e exportar instâncias do serviço de customer.
// Segue o padrão Factory para facilitar a criação e injeção de dependências.

import { CustomerService } from '../../services/customer/protocols';
import { CustomerServiceImpl} from '../../services/customer/implementation';

// Factory function que cria a instância do serviço de customer
const makeCustomerService = (): CustomerService => {
    // Instancia e retorna o serviço
    return new CustomerServiceImpl();
};

// Exporta a instância singleton do serviço
export const customerService = makeCustomerService();