import { CustomerControllerImp } from "srv/controlles/customer/implementation";
import { CustomerController } from "srv/controlles/customer/protocols";
import { customerService } from "../service/customer"

const makeCustomerController = () : CustomerController => {
    return new CustomerControllerImp(customerService);
}

export const customerController = makeCustomerController();