import { ProductModel, ProductProps } from '@/models-manual';

export interface ProductRepository {
    findByIds(ids: ProductProps['id'][]): Promise<ProductModel[] | null>;
    updateStock(product: ProductModel): Promise<void>;
}
