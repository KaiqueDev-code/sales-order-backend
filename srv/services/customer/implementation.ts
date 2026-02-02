// Fornece a lógica de negócio para processar dados de customers.
// Implementa as regras de negócio e transformações necessárias.

import { Customers } from "@models/sales";
import { CustomerService } from "./protocols";
import { CustomerModel } from "srv/models/customers";

// Implementação do serviço de customer que processa listas de customers
export class CustomerServiceImpl implements CustomerService{
    // Processa a lista de customers após leitura do banco de dados
    // Aplica transformações como validação e formatação de email
    public afterread(customerList: Customers): Customers {
        // Mapeia cada customer para aplicar transformações através do modelo
        const customers = customerList.map(c => {
            // Cria uma instância do modelo com os dados do customer atual
            const customer = CustomerModel.with({
                id: c.id as string,
                firstName: c.firstName as string,
                lastName: c.lastName as string,
                email: c.email as string
            })
            // Aplica transformações ao customer e retorna o objeto transformado
            return customer
            .SetDefaultEmailDomain()
            .ToObject();
        });

        return customers;
    }
}