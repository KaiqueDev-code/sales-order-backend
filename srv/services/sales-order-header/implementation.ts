import { Payload as BulkCreateSalesOrderPayload } from '@models/db/types/BulkCreateSalesOrder';
import { CustomerModel } from '@/models-manual/customers';
import { CustomerRepository } from '@/repositories/customer/protocols';
import { LoggedUserModel } from '@/models-manual/logged-user';
import { ProductModel } from '@/models-manual/products';
import { ProductRepository } from '@/repositories/products/protocols';
import { SalesOrdemItemModel } from '@/models-manual/sales-order-items';
import { SalesOrderHeader } from '@cds-models/sales';
import { SalesOrderHeaderHepository } from '@/repositories/sales-order-header/protocols';
import { SalesOrderHeaderModel } from '@/models-manual/sales-order-header';
import { SalesOrderLogRepository } from '@/repositories/sales-order-log/protocols';
import { SalesOrderLogsModel } from '@/models-manual/sales-order-logs';
import { User } from '@sap/cds';
import { CreationPayloadValidationResult, SalesOrderHeaderService } from '@/services/sales-order-header/protocols';

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly salesOrderHeaderRepository: SalesOrderHeaderHepository,
        private readonly customerRepository: CustomerRepository,
        private readonly ProductRepository: ProductRepository,
        private readonly SalesOrderLogRepository: SalesOrderLogRepository
    ) {}

    public async afterCreate(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload[],
        loggedUser: User
    ): Promise<void> {
        // Garante que params seja um array
        const headersAsArray = Array.isArray(params) ? params : [params];

        const logs: SalesOrderLogsModel[] = []; // Declaração da variável logs

        for (const header of headersAsArray) {
            const products = (await this.getProductsByIds(header)) as ProductModel[];
            const items = this.getSalesOrderitems(header, products);
            const salesOrderHeader = this.getExistingSalesOrderHeader(header, items);
            const ProductsData = salesOrderHeader.getProductsData();
            for (const product of products) {
                const findProduct = ProductsData.find((ProductsData) => ProductsData.id === product.id);
                product.sell(findProduct?.quantity as number);
                await this.ProductRepository.updateStock(product);
            }

            const user = this.getLoggedUser(loggedUser);
            const log = this.getSalesOrderLog(salesOrderHeader, user);
            logs.push(log);
        }

        await this.SalesOrderLogRepository.create(logs);
    }

    public async bulkcreate(
        headers: BulkCreateSalesOrderPayload[],
        loggedUser: User
    ): Promise<CreationPayloadValidationResult> {
        const bulkCreateHeaders: SalesOrderHeaderModel[] = [];

        for (const headerObject of headers) {
            const productValidation = await this.validateProductsOnCreation(headerObject);
            if (productValidation.hasError) {
                return productValidation;
            }
            const items = this.getSalesOrderitems(headerObject, productValidation.products as ProductModel[]);
            const header = this.getSalesOrderHeader(headerObject, items);
            const customerValidationResult = await this.validationCustomerOnCreation(headerObject);
            if (!customerValidationResult.hasError) {
                return customerValidationResult;
            }
            const headervalidationResult = header.validateCreationPayload({
                customer_id: (customerValidationResult.customer as CustomerModel).id
            });

            if (headervalidationResult.hasError) {
                return headervalidationResult;
            }
            bulkCreateHeaders.push(header);
        }
        await this.salesOrderHeaderRepository.bulkCreate(bulkCreateHeaders);
        await this.afterCreate(headers, loggedUser);
        return this.serializeBulkCreateResult(bulkCreateHeaders);
    }

    public async cloneSalesOrder(id: string, loggedUser: User): Promise<CreationPayloadValidationResult> {
        const header = await this.salesOrderHeaderRepository.findCompletateSalesOrderById(id);
        if (!header) {
            return {
                hasError: true,
                error: new Error('Pedido não encontrado')
            };
        }
        const headerValidationResult = header.validateCreationPayload({ customer_id: header.customerId });
        if (headerValidationResult.hasError) {
            return headerValidationResult;
        }
        await this.salesOrderHeaderRepository.bulkCreate([header]);
        await this.afterCreate([header.toCreationObject()], loggedUser);
        return this.serializeBulkCreateResult([header]);
    }

    private serializeBulkCreateResult(headers: SalesOrderHeaderModel[]): CreationPayloadValidationResult {
        return {
            hasError: false,
            headers: headers.map((header) => header.toCreationObject())
        };
    }

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
        const productsValidationResult = await this.validateProductsOnCreation(params);

        if (productsValidationResult.hasError) {
            return productsValidationResult;
        }
        const items = this.getSalesOrderitems(params, productsValidationResult.products as ProductModel[]);
        const header = this.getSalesOrderHeader(params, items);
        const customerValidationResult = await this.validationCustomerOnCreation(params);
        if (customerValidationResult.hasError) {
            return customerValidationResult;
        }
        const headervalidationResult = header.validateCreationPayload({
            customer_id: (customerValidationResult.customer as CustomerModel).id
        });
        if (headervalidationResult.hasError) {
            return headervalidationResult;
        }
        return {
            hasError: false,
            totalAmount: header.calculateDiscont()
        };
    }

    private async validateProductsOnCreation(
        header: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<CreationPayloadValidationResult> {
        const products = await this.getProductsByIds(header);
        if (!products) {
            return {
                hasError: true,
                error: new Error('Produto não encontrado')
            };
        }
        return {
            hasError: false,
            products
        };
    }

    private async validationCustomerOnCreation(
        header: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<CreationPayloadValidationResult> {
        const customer = await this.getCustomerByIds(header);
        if (!customer) {
            return {
                hasError: true,
                error: new Error('Customer não encontrado')
            };
        }
        return {
            hasError: false,
            customer
        };
    }

    private async getProductsByIds(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<ProductModel[] | null> {
        // Acessa os itens do pedido
        const productsIds: string[] = params.items?.map((item) => item.product_id) as string[];
        return this.ProductRepository.findByIds(productsIds); // Remove valores vazios
    }

    private getSalesOrderitems(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload,
        products: ProductModel[]
    ): SalesOrdemItemModel[] {
        // Cria os itens do pedido
        return (
            params.items?.map((item) =>
                SalesOrdemItemModel.create({
                    price: item.price as number,
                    productId: item.product_id as string,
                    quantity: item.quantity as number,
                    products
                })
            ) || []
        );
    }

    private getSalesOrderHeader(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload,
        items: SalesOrdemItemModel[]
    ): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.create({
            customerId: params.customer_id as string,
            items
        });
    }

    private getExistingSalesOrderHeader(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload,
        items: SalesOrdemItemModel[]
    ): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.with({
            id: params.id as string,
            customerId: params.customer_id as string,
            totalAmount: params.totalAmount as number,
            items
        });
    }

    private getCustomerByIds(params: SalesOrderHeader | BulkCreateSalesOrderPayload): Promise<CustomerModel | null> {
        const customerId = params.customer_id as string;
        return this.customerRepository.findById(customerId);
    }

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

    private getSalesOrderLog(salesOrderHeader: SalesOrderHeaderModel, user: LoggedUserModel): SalesOrderLogsModel {
        return SalesOrderLogsModel.create({
            headerId: salesOrderHeader.id,
            orderData: salesOrderHeader.toStringifiedObject(),
            userData: user.toStringifiedObject()
        });
    }
}
