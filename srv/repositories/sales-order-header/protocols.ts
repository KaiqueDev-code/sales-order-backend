import { SalesOrderHeaderModel } from '@/models-manual';

export type CompleteSalesOrderHeader = {
    totalAmount: number;
    customerId: string;
    item_quantity: number;
    product_id: string;
    product_name: string;
    product_price: number;
    product_stock: number;
};

export interface SalesOrderHeaderHepository {
    bulkCreate(header: SalesOrderHeaderModel[]): Promise<void>;
    findCompletateSalesOrderById(id: string): Promise<SalesOrderHeaderModel | null>;
}
