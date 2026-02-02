import { CustomerProps, CustomerModel } from "srv/models/customers";

export interface CustomerRepository {
    findById(id: CustomerProps['id']): Promise<CustomerModel | null>;
}