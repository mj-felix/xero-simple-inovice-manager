import { v4 as uuidv4 } from 'uuid';

import { db } from '../database/connection.js';
import InvoiceLine from './line.model.js';

class Invoice {
    constructor(invoiceDate = new Date(), invoiceNumber = "", lineItems = []) {
        this.invoiceDate = invoiceDate;
        this.invoiceNumber = invoiceNumber;
        this.uuid = uuidv4();
        this.lineItems = lineItems.map((line) => (new InvoiceLine(line.cost, line.quantity, line.description)));
    }

    async save() {
        db.data.invoices.push(this);
        await db.write();
    }

    // Adds a line to invoice
    addInvoiceLine(line) {
        this.lineItems.push(line);
    };

    // Removes a line
    removeInvoiceLine(id) {
        return null;
    };

    getTotal() {
        return 0;
    };

    mergeInvoices() {
        return null;
    }

    clone() {
        return null;
    };
}

export default Invoice;