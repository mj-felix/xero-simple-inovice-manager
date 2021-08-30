import { v4 as uuidv4 } from 'uuid';

class InvoiceLine {
    constructor(cost, quantity, description) {
        this.invoiceLineId = uuidv4();
        this.cost = cost;
        this.quantity = quantity;
        this.description = description;
    }
}

export default InvoiceLine;