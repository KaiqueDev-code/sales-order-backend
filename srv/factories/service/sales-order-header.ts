import { CustomerRepositoryImpl } from "srv/repositories/customer/implementation";
import { ProductRepositoryImpl } from "srv/repositories/products/implementation";
import { SalesOrderLogRepositoryImp } from "srv/repositories/sales-order-log/implementation";
import { SalesOrderHeaderServiceImpl } from "srv/services/sales-order-header/implementation";
import { SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";

const makeSalesOrderHeaderService = (): SalesOrderHeaderService => {
    const customerRepository = new CustomerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    const salesOrderLogRepository = new SalesOrderLogRepositoryImp();
    return new SalesOrderHeaderServiceImpl(customerRepository, productRepository, salesOrderLogRepository);
}

export const salesOrderHeaderService = makeSalesOrderHeaderService();