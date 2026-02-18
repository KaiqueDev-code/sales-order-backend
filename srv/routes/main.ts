// Este arquivo configura os event handlers do serviço CAP.
// Responsável por processar eventos de leitura e criação de dados.
import '@/configs/module-alias';
import { Request, Service } from '@sap/cds';

import { customerController } from '@/factories/controllers/customer';
import { salesOrderHeaderController } from '@/factories/controllers/sales-order-header';
import { Customers, SalesOrderHeaders } from '@models/sales';
import { salesReportController} from '@/factories/controllers/sales-report'

// Função que configura os event handlers do serviço
export default (service: Service) => {
    // Processa cada customer para adicionar domínio de email padrão (@gmail.com)
    service.after('READ', 'Customers', (customerList: Customers) => {
        // Processa a lista de customers através do controller
        const processedCustomers = customerController.afterRead(customerList);
        // Substitui os dados originais pelos processados
        customerList.splice(0, customerList.length, ...processedCustomers);
    });

    // Valida os dados antes de criar uma nova ordem de vendas
    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        // Extrai dados da requisição
        const result = await salesOrderHeaderController.beforeCreate(request.data);

        if (result.hasError) {
            return request.reject(400, result.error?.message as string);
        }

        // Atualiza o dado na requisição com o valor total calculado
        request.data.totalAmount = result.totalAmount;
    });

    // Processa a ordem criada: atualiza estoque e cria log de auditoria
    service.after('CREATE', 'SalesOrderHeaders', async (SalesOrderHeaders: SalesOrderHeaders, request: Request) => {
        await salesOrderHeaderController.afterCreate(SalesOrderHeaders, request.user);
    }); 

    service.on('getSalesReportsByDays', (request: Request) => {
        const days = request.data?.days || 7 ;
        return salesReportController.findBydays(days)
    });
};