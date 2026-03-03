import { ProductModel } from '@/models-manual';

type SalesOrderItemProps = {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    products: ProductModel[];
};

type SalesOrdemItemPropsWithoutId = Omit<SalesOrderItemProps, 'id'>;

export type SalesOrderItemPropsWithSnakeCaseProductId = Omit<SalesOrderItemProps, 'productId' | 'products'> & {
    product_id: SalesOrderItemProps['productId'];
};

type CreationPayload = {
    product_id: SalesOrderItemProps['productId'];
};

type CreationPayloadValidationResult = {
    hasError: boolean;
    error?: Error;
};

export class SalesOrdemItemModel {
    constructor(private props: SalesOrderItemProps) {}

    public static create(props: SalesOrdemItemPropsWithoutId): SalesOrdemItemModel {
        return new SalesOrdemItemModel({
            ...props,
            id: crypto.randomUUID()
        });
    }

    public get id() {
        return this.props.id;
    }

    public get productId() {
        return this.props.productId;
    }

    public get quantity() {
        return this.props.quantity;
    }

    public get price() {
        return this.props.price;
    }

    public get products() {
        return this.props.products;
    }

    public validationCreationPayload(params: CreationPayload): CreationPayloadValidationResult {
        const product = this.products.find((product) => product.id === params.product_id);
        if (!product) {
            return {
                hasError: true,
                error: new Error(`Produto ${params.product_id} não encontrado`)
            };
        }

        if (product.stock === 0) {
            return {
                hasError: true,
                error: new Error(`Produto ${product.nome} (${product.id})sem estoque disponivel`)
            };
        }
        return {
            hasError: false
        };
    }

    public toCreationObject(): SalesOrderItemPropsWithSnakeCaseProductId {
        return {
            id: this.props.id,
            price: this.props.price,
            quantity: this.props.quantity,
            product_id: this.props.productId
        };
    }
}
