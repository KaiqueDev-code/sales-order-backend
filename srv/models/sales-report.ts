type SalesReportProps = {
    salesOrderId:string;
    salesOrderHeaderTotalAmount: number;
    customerId: string;
    customerFullName: string;
};

export class SalesReportsModel {
    constructor(private props: SalesReportProps) {}

    public static with(props: SalesReportProps) {
        return new SalesReportsModel(props)
    }

    get SalesOrderId() {
        return this.props.salesOrderId;
    }
    get SalesOrderHeaderTotalAmount() {
        return this.props.salesOrderHeaderTotalAmount;
    }
    get customerId() {
        return this.props.customerId;
    }
    get customerFullName() {
        return this.props.customerFullName;
    }

    public toObject(): SalesReportProps {
        return {
            salesOrderId: this.props.salesOrderId,
            salesOrderHeaderTotalAmount: this.props.salesOrderHeaderTotalAmount,
            customerId: this.props.customerId,
            customerFullName: this.props.customerFullName
        }
    }
}