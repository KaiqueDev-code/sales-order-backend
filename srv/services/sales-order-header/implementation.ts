import { SalesOrderHeaderModel } from "srv/models/sales-order-header-Model";
import { SalesOrderHeaderService, CreationPayloadValidationResult } from "./protocols";
import { SalesOrderHeaders, SalesOrderItem } from "@models/sales";
import { SalesOrdemItemModel } from "srv/models/sales-order-items";
import { ProductRepository } from "../../repositories/products/protocols"
import { CustomerRepository } from "srv/repositories/customer/protocols";
import { ProductModel } from "srv/models/products";
import { CustomerModel } from "srv/models/customers";


export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly customerRepository: CustomerRepository,
        private readonly ProductRepository: ProductRepository
    ) { }

    public async beforeCreate(params: SalesOrderHeaders): Promise<CreationPayloadValidationResult> {
        const products = await this.getProductsByIds(params)

        if (!products) {
            return {
                hasError: true,
                error: new Error('Produto não encontrado')
            }
        };

        const items = this.getSalesOrderitems(params, products);
        const header = this.getSalesOrderHeader(params, items, );
        const customer = await this.getCustomerByIds(params);
        
        if (!customer) {
            return {
                hasError: true,
                error: new Error('Customer não encontrado')
            }
        }

        const headervalidationResult = header.validateCreationPayload({ customer_id: customer.id });

        if (headervalidationResult.hasError) {
            return headervalidationResult;
        }

        return {
            hasError: false,
            totalAmount: header.calculateDiscont()
        }
    }

    private async getProductsByIds(params: SalesOrderHeaders): Promise<ProductModel[] | null > {
        const productsIds: string[] = params.items?.map((item: SalesOrderItem) => (item.product_id)) as string[];
        return this.ProductRepository.findByIds(productsIds);
    }

    private getSalesOrderitems(params: SalesOrderHeaders, products: ProductModel[]): SalesOrdemItemModel[] {
        return params.items?.map(item => SalesOrdemItemModel.create({
            price: item.price as number,
            productId: item.product_id as string,
            quantiti: item.quantiti as number,
            products

        })) as SalesOrdemItemModel[];
    }

    private getSalesOrderHeader(params: SalesOrderHeaders, items: SalesOrdemItemModel[]): SalesOrderHeaderModel{
        return SalesOrderHeaderModel.create({
            customerId: params.customer_id as string,
            items
        });
    }

    private getCustomerByIds(params: SalesOrderHeaders): Promise <CustomerModel | null>{
        const customerId = params.customer_id as string;
        return this.customerRepository.findById(customerId);
    }
}
