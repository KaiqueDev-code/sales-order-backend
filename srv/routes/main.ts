// Este arquivo configura os event handlers do serviço CAP.
// Responsável por processar eventos de leitura e criação de dados.
import '@/configs/module-alias';

import { FullRequestParams } from './protocols';
import { SalesOrdemItemModel } from '@/models-manual/sales-order-items';
import { SalesOrderHeaderModel } from '@/models-manual/sales-order-header';
import { customerController } from '@/factories/controllers/customer';
import { salesOrderHeaderController } from '@/factories/controllers/sales-order-header';
import { salesReportController } from '@/factories/controllers/sales-report';
import { Customers, SalesOrderHeaders } from '@cds-models/sales';
import { Request, Service } from '@sap/cds';

// Função que configura os event handlers do serviço
// eslint-disable-next-line max-lines-per-function
export default (service: Service) => {
    // Processa cada customer para adicionar domínio de email padrão (@gmail.com)
    service.after('READ', 'Customers', (customerList: Customers, request: Request) => {
        const result = customerController.afterRead(customerList);
        if (result.status >= 400) {
            return request.error(result.status, result.data as string);
        }
        (request as unknown as FullRequestParams<Customers>).result = result.data as Customers;
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
        // Itera sobre SalesOrderHeaders e mapeia para SalesOrderHeaderProps com validação e conversão
        const salesOrderHeaderModels = SalesOrderHeaders.map((header) => {
            return SalesOrderHeaderModel.with({
                id: header.id || crypto.randomUUID(),
                customerId: header.customer_id || '',
                totalAmount: header.totalAmount ?? 0,
                items: (header.items || []).map((item) => {
                    const salesOrderItem = new SalesOrdemItemModel({
                        productId: item.product_id || '',
                        id: item.id || crypto.randomUUID(),
                        quantity: item.quantity || 0,
                        price: item.price || 0,
                        products: []
                    });
                    return salesOrderItem;
                })
            });
        });
        for (const model of salesOrderHeaderModels) {
            await salesOrderHeaderController.afterCreate(model, request.user);
        }
    });
    service.on('getSalesReportsReportDays', async (request: Request) => {
        const days = request.data?.days || 7;
        const result = await salesReportController.findBydays(days);
        if (result.status >= 400) {
            return request.error(result.status, result.data as string);
        }
        return result.data;
    });
    service.on('getSalesReportsByCustomerId', async (request: Request) => {
        const [{ id: customerId }] = request.params as unknown as { id: string }[];
        const result = await salesReportController.findByCustomerId(customerId);
        if (result.status >= 400) {
            return request.error(result.status, result.data as string);
        }
        return result.data;
    });
    service.on('bulkCreateSalesOrder', async (request: Request) => {
        const { user, data } = request;
        return salesOrderHeaderController.bulkcreate(data.payload, user);
    });
    service.on('clone_salesOrder', async (request: Request) => {
        const [{ id }] = request.params as unknown as { id: string }[];
        const { user } = request;
        return salesOrderHeaderController.cloneSalesOrder(id, user);
    });
};
