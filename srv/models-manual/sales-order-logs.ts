type SalesOrderLogsProps = {
    id: string;
    headerId: string;
    userData: string;
    orderData: string;
};

type SalesOrderLogsdbProps = Omit<SalesOrderLogsProps, 'headerId'> & {
    header_id: string;
};

type SalesOrderLogWithoutIProps = Omit<SalesOrderLogsProps, 'id'>;

export class SalesOrderLogsModel {
    constructor(private props: SalesOrderLogsProps) {}

    public static create(props: SalesOrderLogWithoutIProps): SalesOrderLogsModel {
        return new SalesOrderLogsModel({
            ...props,
            id: crypto.randomUUID()
        });
    }

    public get id() {
        return this.props.id;
    }

    public get headerId() {
        return this.props.id;
    }

    public get userData() {
        return this.props.id;
    }

    public get orderData() {
        return this.props.id;
    }

    // Converte a instância do modelo para um objeto simples (DTO)
    public ToObject(): SalesOrderLogsdbProps {
        return {
            id: this.props.id,
            header_id: this.props.headerId,
            userData: this.props.userData,
            orderData: this.props.orderData
        };
    }
}
