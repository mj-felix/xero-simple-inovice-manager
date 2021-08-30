import { v4 as uuidv4 } from 'uuid';

import { db } from '../database/connection.js';
import Item from './item.model.js';

class Invoice {
    constructor(invoiceDate = new Date(), invoiceNumber = "", items = []) {
        this.invoiceDate = invoiceDate;
        this.invoiceNumber = invoiceNumber;
        this.uuid = uuidv4();
        this.items = items.map((item) => (new Item(item.price, item.quantity, item.description)));
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