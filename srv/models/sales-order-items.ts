import { ProductModel } from "./products";

type SalesOrderItemProps = {
    id: string;
    productId: string;
    quantiti: number;
    price: number;
    products: ProductModel[];
}

type SalesOrdemItemPropsWithoutId = Omit<SalesOrderItemProps, 'id'>;

type CreationPayload = {
    product_id: SalesOrderItemProps["productId"];
}

type CreationPayloadValidationResult = {
    hasError: boolean;
    error?: Error;
}

export class SalesOrdemItemModel{
    constructor(private props : SalesOrderItemProps){}

    public static create(props: SalesOrdemItemPropsWithoutId): SalesOrdemItemModel{
        return new SalesOrdemItemModel({
            ...props,
            id: crypto.randomUUID(),
        })

        
    }

    public get id(){
        return this.props.id
    }

    public get productId(){
        return this.props.productId
    }

    public get quantiti(){
        return this.props.quantiti
    }

    public get price(){
        return this.props.price
    }

    public get products(){
        return this.props.products
    }

    public validationCreationPayload(params: CreationPayload): CreationPayloadValidationResult{

        const product = this.products.find(product => product.id === params.product_id);
        if (!product){
            return{
                hasError: true,
                error: new Error(`Produto ${params.product_id} não encontrado`)
            }
        }

        if(product.stock === 0){
            return {
                hasError: true,
                error: new Error(`Produto ${product.nome} (${product.id})sem estoque disponivel`)
            }
        }
        return {
            hasError: false
        }
    }
}