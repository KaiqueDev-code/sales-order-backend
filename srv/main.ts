// Este arquivo configura os event handlers do serviço CAP.
// Responsável por processar eventos de leitura e criação de dados.

import cds, { db, Request, Service } from '@sap/cds';
import { Customers, Product, Products, SalesOrderHeaders, SalesOrderItem, SalesOrderItems }  from '../@cds-models/sales';
import { customerController } from './factories/controllers/customer'
import { FullRequestParams } from './protocols';
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
        const params = request.data;
        const items: SalesOrderItems = params.items;

        // Validação: verifica se customer_id foi fornecido
        if (!params.customer_id){
            return request.reject(400, 'Invalid customer');
        }

        // Validação: verifica se há itens na ordem
        if(!params.items || params.items.length === 0){
            return request.reject(404, 'Invalid item')
        }
        
        // Busca o customer no banco de dados para verificar sua existência
        const CustomerQuery = SELECT.one.from('sales.Customers').where({id: params.customer_id})
        const customer = await cds.run(CustomerQuery)
        
        // Validação: verifica novamente se há itens
        if (params.items.length === 0 || !params.items){
            return request.reject(404, "Item não encontrado")
        }
       
        // Validação: verifica se o customer existe
        if(!customer){
            return request.reject(404, 'Customer não encontrado');
        }

        // Extrai IDs dos produtos dos itens da ordem
        const productsIds: string[] = params.items.map((item: SalesOrderItem) => (item.product_id));
        // Busca os detalhes dos produtos no banco de dados
        const produtcsQuery = SELECT.from('sales.Products').where({id: productsIds})
        const products: Products = await cds.run(produtcsQuery)

        
        
       
        // Verifica se todos os produtos existem e possuem estoque disponível
        for(const item  of items){
            // Procura pelo produto na lista retornada do banco de dados
            const dbproduct = products.find(product => product.id === item.product_id )
            // Validação: produto não encontrado
            if(!dbproduct){
                return request.reject(404, `Produto ${item.product_id} não encontrado`)
            }
            
            // Validação: produto sem estoque
            if(dbproduct.stock === 0 ){
                return request.reject(404, `Produto ${dbproduct.nome} (${dbproduct.id})sem estoque disponivel`)
            }
            
        }

 
        // Calcula o valor total da ordem e aplica desconto se necessário
        let totalAmount = 0;
        // Soma o valor de todos os itens (preço * quantidade)
        items.forEach(item => {
            totalAmount += (item.price as number) * (item.quantiti as number) 
        })
        console.log(`Antes do Desconto ${totalAmount.toFixed(2)}`)
        
        // Aplica desconto de 10% se o total for maior que 30.000
        if(totalAmount > 30000){
            const discont = totalAmount * (10/100) ;
            totalAmount = totalAmount - discont;
        }
        console.log(`Depois do Desconto ${totalAmount.toFixed(2)}`)

        // Atualiza o dado na requisição com o valor total calculado
        request.data.totalAmount = totalAmount;

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