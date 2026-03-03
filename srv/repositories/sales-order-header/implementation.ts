import cds from '@sap/cds';

import { CompleteSalesOrderHeader, SalesOrderHeaderHepository } from '@/repositories/sales-order-header/protocols';
import { ProductModel, SalesOrdemItemModel, SalesOrderHeaderModel } from '@/models-manual';

export class SalesOrderHeaderRepositortyImpl implements SalesOrderHeaderHepository {
    public async bulkCreate(header: SalesOrderHeaderModel[]): Promise<void> {
        const headerObjects = header.map((header) => header.toCreationObject());
        await cds.create('sales.SalesOrderHeaders').entries(headerObjects);
    }

    public async findCompletateSalesOrderById(id: string): Promise<SalesOrderHeaderModel | null> {
        const sql = SELECT.from('sales.SalesOrderHeaders')
            .columns(
                'totalAmount',
                'cystomer.id as customerId',
                'items.quantity as item_quantity',
                'items.product.id as product_id',
                'items.product.name as product_name',
                'items.product.price as product_price',
                'items.product.stock as product_stock'
            )
            .where({ id });
        const header: CompleteSalesOrderHeader[] = await cds.run(sql);
        if (!header || header.length === 0) {
            return null;
        }

        const products = this.mapProductstoCompleteSalesOrder(header);
        const items = this.mapItemstoCompleteSalesOrder(header, products);
        return SalesOrderHeaderModel.create({
            customerId: header.at(0)?.customerId as string,
            items
        });
    }

    private mapProductstoCompleteSalesOrder(headers: CompleteSalesOrderHeader[]): ProductModel[] {
        return headers.map((header) =>
            ProductModel.with({
                id: header.product_id,
                nome: header.product_name,
                price: header.product_price,
                stock: header.product_stock
            })
        );
    }

    private mapItemstoCompleteSalesOrder(
        headers: CompleteSalesOrderHeader[],
        products: ProductModel[]
    ): SalesOrdemItemModel[] {
        return headers.map((header) =>
            SalesOrdemItemModel.create({
                price: header.product_price,
                quantity: header.item_quantity,
                productId: header.product_id,
                products
            })
        );
    }
}
