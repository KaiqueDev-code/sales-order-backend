export type ProductProps = {
    id: string;
    nome: string;
    price: number;
    stock: number;
};

export type sellValidationResult = {
    hasError: boolean;
    error?: Error;
};

export class ProductModel {
    constructor(private props: ProductProps) {}

    public static with(props: ProductProps) {
        return new ProductModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get nome() {
        return this.props.nome;
    }

    public get price() {
        return this.props.price;
    }

    public get stock() {
        return this.props.stock;
    }

    public set stock(stock: number) {
        this.props.stock = stock;
    }

    public sell(amount: number): sellValidationResult {
        if (this.stock < amount) {
            return {
                hasError: true,
                error: new Error('Qantidade de produtos insuficiente no estoque')
            };
        }
        this.stock -= amount;
        return {
            hasError: false
        };
    }
}
