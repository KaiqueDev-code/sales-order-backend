import cds from '@sap/cds'

import { ProductProps, ProductModel } from "srv/models/products";
import { ProductRepository } from "./protocols";
import { Products } from '@models/sales';

export class ProductRepositoryImpl implements ProductRepository {
    public async findByIds(ids: ProductProps["id"][]): Promise<ProductModel[] | null> {
        const produtcsQuery = SELECT.from('sales.Products').where({ id: ids })
        const products: Products = await cds.run(produtcsQuery)
        if(products.length === 0){
            return null;
        }
        return products.map(products => ProductModel.with({
            id: products.id as string,
            nome: products.nome as string,
            price: products.price as number,
            stock: products.stock as number,
        }));
    }

    public async updateStock(product: ProductModel): Promise<void> {
        await cds.update('sales.Products').where({id: product.id}).with({stock: product.stock});
    }
}