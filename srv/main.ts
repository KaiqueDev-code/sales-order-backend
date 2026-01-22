import cds, { db, Request, Service } from '@sap/cds';
import { Customers, Products, SalesOrderIten, SalesOrderItens }  from '../@cds-models/sales';
const { SELECT } = cds.ql;

// função que apos o "Customers" ser lido e se o "Costumer" não tiver @ no email, sera adicionado @gmail.com
export default (service: Service) => {
    service.after('READ', 'Customers', (results: Customers) => {
        results.forEach(Customer => {
            if(!Customer.email?.includes('@')){
                Customer.email = `${Customer.email}@gmail.com`;
            }

        })
    });

    service.before('CREATE', 'SalesOrderHeader', async (request: Request) => { 
        const params = request.data;
        const items: SalesOrderItens = params.itens;

        // Caso o Customer não existir retornar uma mensagem
        if (!params.customer_id){
            return request.reject(400, 'Customers invalido');
        }

        
        if(!params.itens || params.itens.length === 0){
            return request.reject(404, 'Item Invalido')
        }
        

        const CustomerQuery = SELECT.one.from('sales.Customers').where({id: params.customer_id})
        const customer = await cds.run(CustomerQuery) // pesquisar sobre o await
        
        if (params.itens.length === 0 || !params.itens){
            return request.reject(404, "Item não encontrado")
        }
       
        if(!customer){
            return request.reject(404, 'Customer não encontrado');
        }

        const productsIds: string[] = params.itens.map((itens: SalesOrderIten) => (itens.product_id));
        const produtcsQuery = SELECT.from('sales.Products').where({id: productsIds})
        const products: Products = await cds.run(produtcsQuery)
        const dbproducts = products.map((product) => (product.id))

        
        
        for(const item  of items){
            
            const dbproduct = products.find(product => product.id === item.product_id )
            if(!dbproduct){
                return request.reject(404, `Produto ${item.product_id} não encontrado`)
            }
            
            if(dbproduct.stock === 0 ){
                return request.reject(404, `Produto ${dbproduct.nome} (${dbproduct.id})sem estoque disponivel`)
            }


        }


    })


}