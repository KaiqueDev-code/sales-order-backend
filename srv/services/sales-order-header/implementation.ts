import { SalesOrderHeaderModel } from "srv/models/sales-order-header";
import { SalesOrderHeaderService, CreationPayloadValidationResult } from "./protocols";
import { SalesOrderHeaders, SalesOrderItem } from "@models/sales";
import { SalesOrdemItemModel } from "srv/models/sales-order-items";
import { ProductRepository } from "../../repositories/products/protocols"
import { CustomerRepository } from "srv/repositories/customer/protocols";
import { ProductModel } from "srv/models/products";
import { CustomerModel } from "srv/models/customers";
import { SalesOrderLogsModel } from "srv/models/sales-order-logs";
import { SalesOrderLogRepository } from "srv/repositories/sales-order-log/protocols";
import { log } from "node:console";
import { LoggedUserModel } from "srv/models/logged-user";
import { User } from "@sap/cds";


export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly customerRepository: CustomerRepository,
        private readonly ProductRepository: ProductRepository,
        private readonly SalesOrderLogRepository: SalesOrderLogRepository,
    ) { }

    public async afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void> {


        // Garante que results seja um array
        const headersAsArray = Array.isArray(params) ? params : [params] as SalesOrderHeaders[]

        const logs: SalesOrderLogsModel[] = []

        // Itera sobre cada header de vendas criado
        for (const header of headersAsArray) {
            const products = await this.getProductsByIds(header) as ProductModel[];
            const items = this.getSalesOrderitems(header, products);
            const salesOrderHeader = this.getExistingSalesOrderHeader(header, items,);
            const ProductsData = salesOrderHeader.getProductsData();
            for (const product of products) {
                const findProduct = ProductsData.find(ProductsData => ProductsData.id === product.id);
                product.sell(findProduct?.quantity as number);
                await this.ProductRepository.updateStock(product);
            }

            const user = this.getLoggedUser(loggedUser);
            const log = this.getSalesOrderLog(salesOrderHeader, user);
            logs.push(log);

        };

        await this.SalesOrderLogRepository.create(logs)

    }

    public async beforeCreate(params: SalesOrderHeaders): Promise<CreationPayloadValidationResult> {
        const products = await this.getProductsByIds(params)

        if (!products) {
            return {
                hasError: true,
                error: new Error('Produto não encontrado')
            }
        };

        const items = this.getSalesOrderitems(params, products);
        const header = this.getSalesOrderHeader(params, items,);
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

    private async getProductsByIds(params: SalesOrderHeaders): Promise<ProductModel[] | null> {
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

    private getSalesOrderHeader(params: SalesOrderHeaders, items: SalesOrdemItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.create({
            customerId: params.customer_id as string,
            items
        });
    }

    private getExistingSalesOrderHeader(params: SalesOrderHeaders, items: SalesOrdemItemModel[]): SalesOrderHeaderModel{
        return SalesOrderHeaderModel.with({
            id: params.id as string,
            customerId: params.customer_id as string,
            totalAmount: params.totalAmount as number,
            items
        });
    }

    private getCustomerByIds(params: SalesOrderHeaders): Promise<CustomerModel | null> {
        const customerId = params.customer_id as string;
        return this.customerRepository.findById(customerId);
    };

    private getLoggedUser(loggedUser: User): LoggedUserModel {
        return LoggedUserModel.create({
            id: loggedUser.id,
            roles: loggedUser.roles as string[],
            attributes: {
                id: loggedUser.attr.id as unknown as number,
                groups: loggedUser.attr.groups as unknown as string[]
            }

        });
    }

    private getSalesOrderLog(salesOrderHeader: SalesOrderHeaderModel, user: LoggedUserModel): SalesOrderLogsModel{
        return SalesOrderLogsModel.create({
                headerId: salesOrderHeader.id,
                orderData: salesOrderHeader.toStringifiedObject(),
                userData: user.toStringifiedObject(),
            });
    }
}
