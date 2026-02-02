// Este arquivo configura os event handlers do serviço CAP.
// Responsável por processar eventos de leitura e criação de dados.

import cds, { db, Request, Service } from '@sap/cds';
import { Customers, Product, Products, SalesOrderHeaders, SalesOrderItem, SalesOrderItems }  from '../@cds-models/sales';
import { customerController } from './factories/controllers/customer'
import { SalesOrderHeaderController } from './controlles/sales-order-header/protocols';
import { FullRequestParams } from './protocols';
import { salesOrderHeaderController } from './factories/controllers/sales-order-header';
const { SELECT } = cds.ql;



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
        const result = await salesOrderHeaderController.beforeCreate(request.data)

        if (result.hasError){
            return request.reject(400, result.error?.message as string);
        }
        
        // Atualiza o dado na requisição com o valor total calculado
        request.data.totalAmount = result.totalAmount;

    })


    // Processa a ordem criada: atualiza estoque e cria log de auditoria
    service.after('CREATE', 'SalesOrderHeaders', async (results: SalesOrderHeaders [], request : Request) => {
        // Garante que results seja um array
        const headersAsArray = Array.isArray(results) ? results : [results] as SalesOrderHeaders []
        
        // Itera sobre cada header de vendas criado
        for (const header of headersAsArray) {
            // Extrai os itens da ordem
            const items = header.items as SalesOrderItems;
            // Mapeia os itens para extrair id do produto e quantidade
            const productsData = items.map(item => ({
                id: item.product_id as string,
                quantity: item.quantiti as number
            }))

            // Busca os produtos no banco de dados
            const productsIds: string[] = productsData.map((productsData) => productsData.id);
            const produtcsQuery = SELECT.from('sales.Products').where({id: productsIds})
            const products: Products = await cds.run(produtcsQuery)
            

            // Reduz o estoque de cada produto com base na quantidade vendida
            for(const productData of productsData){
                // Encontra o produto na lista
                const findproducts = products.find(produc => produc.id === productData.id) as Product;
                // Reduz o estoque
                findproducts.stock = (findproducts.stock as number) - productData.quantity;
                // Atualiza o estoque no banco de dados
                await cds.update('sales.Products').where({id: findproducts.id}).with({stock: findproducts.stock});
            }

 
            // Converte os dados para JSON para armazenamento no log
            const headerAsString = JSON.stringify(header);
            const userAsString = JSON.stringify(request.user);
            
            // Cria um registro de log com dados do usuário e da ordem
            await cds.create('sales.SalesOrderLogs').entries({
                header_id: header.id,
                userData: userAsString,
                orderData: headerAsString
            })

        }
    });
}