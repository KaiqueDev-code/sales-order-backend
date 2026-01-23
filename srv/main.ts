import cds, { db, Request, Service } from '@sap/cds';
import { Customers, Product, Products, SalesOrderHeaders, SalesOrderItem, SalesOrderItems }  from '../@cds-models/sales';
import { userInfo } from 'node:os';
import { request } from 'axios';
const { SELECT } = cds.ql;

// função que apos o "Customers" ser lido e se o "Customer" não tiver @ no email, sera adicionado @gmail.com
export default (service: Service) => {
    service.after('READ', 'Customers', (results: Customers) => {
        results.forEach(Customer => {
            if(!Customer.email?.includes('@')){
                Customer.email = `${Customer.email}@gmail.com`;
            }

        })
    });

    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => { 
        const params = request.data;
        const items: SalesOrderItems = params.items;

        // Caso o Customer não existir retornar uma mensagem
        if (!params.customer_id){
            return request.reject(400, 'Invalid customer');
        }

        
        if(!params.items || params.items.length === 0){
            return request.reject(404, 'Invalid item')
        }
        

        const CustomerQuery = SELECT.one.from('sales.Customers').where({id: params.customer_id})
        const customer = await cds.run(CustomerQuery) // pesquisar sobre o await
        
        if (params.items.length === 0 || !params.items){
            return request.reject(404, "Item não encontrado")
        }
       
        if(!customer){
            return request.reject(404, 'Customer não encontrado');
        }

        const productsIds: string[] = params.items.map((item: SalesOrderItem) => (item.product_id));
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

        let totalAmount = 0;
        items.forEach(item => {
            totalAmount += (item.price as number) * (item.quantiti as number) 
        })
        console.log(`Antes do Disconto ${totalAmount.toFixed(2)}`)
        if(totalAmount > 30000){
            const discont = totalAmount * (10/100) ;
            totalAmount = totalAmount - discont;
        }
        console.log(`Depois do Disconto ${totalAmount.toFixed(2)}`)

        request.data.totalAmount = totalAmount;
        

    })

    service.after('CREATE', 'SalesOrderHeaders', async (results: SalesOrderHeaders [], request : Request) => {
        const headersAsArray = Array.isArray(results) ? results : [results] as SalesOrderHeaders []
        for (const header of headersAsArray) {
            const items = header.items as SalesOrderItems;
            const productsData = items.map(item => ({
                id: item.product_id as string,
                quantity: item.quantiti as number
            }))

            const productsIds: string[] = productsData.map((productsData) => productsData.id);
            const produtcsQuery = SELECT.from('sales.Products').where({id: productsIds})
            const products: Products = await cds.run(produtcsQuery)
            for(const productData of productsData){
                const findproducts = products.find(produc => produc.id === productData.id) as Product;
                findproducts.stock = (findproducts.stock as number) - productData.quantity;
                await cds.update('sales.Products').where({id: findproducts.id}).with({stock: findproducts.stock});
            }

            const headerAsString = JSON.stringify(header);
            const userAsString = JSON.stringify(request.user);
            
            await cds.create('sales.SalesOrderLogs').entries({
                header_id: header.id,
                userData: userAsString,
                orderData: headerAsString
            })

        }
    });


}