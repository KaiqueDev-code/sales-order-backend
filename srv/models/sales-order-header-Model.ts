import { error } from "node:console";
import { SalesOrdemItemModel } from "./sales-order-items";
import { ProductRepositoryImpl } from "srv/repositories/products/implementation";
import { createEntityProxy } from "@models/_";

type SalesOrderHeaderProps = {
    id: string;
    customerId: string;
    items: SalesOrdemItemModel[];
    totalAmount: number;
}

type CreationPayload = {
    customer_id: SalesOrderHeaderProps["customerId"],
}

type CreationPayloadValidationResult = {
    hasError: boolean;
    erro?: Error;
}

type SalesOrderHeaderPropsWithoutTotalAmount = Omit<SalesOrderHeaderProps, 'id' | 'totalAmount' >;

export class SalesOrderHeaderModel {
    constructor(private props: SalesOrderHeaderProps) {}

    public static create(props: SalesOrderHeaderPropsWithoutTotalAmount): SalesOrderHeaderModel{
        return new SalesOrderHeaderModel({
            ...props,
            id: crypto.randomUUID(),
            totalAmount: 0,
        })
    }

    public get totalAmount (){
        return this.props.totalAmount
    }

    public get id() {
        return this.props.id
    }

    public get customerId() {
        return this.props.customerId;
    }

    public get items() {
        return this.props.items
    }

    public set totalAmount (amount: number){
        this.props.totalAmount = amount;
    }

    public validateCreationPayload(params: CreationPayload): CreationPayloadValidationResult {
        const customerValidationresult = this.validateCustomerOnCreation(params.customer_id);

        if (customerValidationresult.hasError) {
            return customerValidationresult;

        }
        const itemsValidationResult = this.validateItemsOnCreation(this.items);
        if(itemsValidationResult.hasError){
            return itemsValidationResult;
        }
        return {
            hasError: false
        }


    }

    // Validação: verifica se customer_id foi fornecido
    private validateCustomerOnCreation(customerId: CreationPayload['customer_id']): CreationPayloadValidationResult {

        if (!customerId) {
            return {
                hasError: true,
                erro: new Error('Invalid customer'),
            };

        }
        return {
            hasError: false
        }

    }

    // Validação: verifica se há itens na ordem
    private validateItemsOnCreation(items: SalesOrderHeaderProps['items']): CreationPayloadValidationResult {
        if (!items || items?.length === 0) {
            return {
                hasError: true,
                erro: new Error('Items Invalidos'),
            };
        }

        const itemsErrors: string[] = [];
        items.forEach(item => {
            const validationresult = item.validationCreationPayload({ product_id: item.productId })
            if (validationresult.hasError) {
                itemsErrors.push(validationresult.error?.message as string)
            }
        })
        if (itemsErrors.length > 0) {
            const mensages = itemsErrors.join('\n -')
            return {
                hasError: true,
                erro: new Error(mensages)
            }
        }
        return {
            hasError: false
        }
    }

    public calculateTotalAmoult (): number {
        let totalAmount = 0;
        this.items.forEach(item => {
            totalAmount += (item.price as number) * (item.quantiti as number);
        });
        return totalAmount;
    }

    public calculateDiscont (): number{
        let totalAmount = this.calculateTotalAmoult();
        if(totalAmount > 30000){
            const discont = totalAmount * (10/100) ;
            totalAmount = totalAmount - discont;
        }
        return totalAmount;
    }

}




