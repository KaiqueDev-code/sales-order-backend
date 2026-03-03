import { CustomerModel, CustomerProps } from '@/models-manual';

export interface CustomerRepository {
    findById(id: CustomerProps['id']): Promise<CustomerModel | null>;
}
