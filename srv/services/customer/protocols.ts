// Define o contrato que todo serviço de customer deve implementar.

import { Customers } from "@models/sales";

// Interface que define os métodos disponíveis no serviço de customer
export interface CustomerService{
    // Processa a lista de customers após leitura
    afterread(customerList: Customers): Customers;
}