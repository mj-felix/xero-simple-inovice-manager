import { v4 as uuidv4 } from 'uuid';
import util from 'util';

import { db } from '../database/connection.js';
import Item from './item.model.js';

class Invoice {
    constructor(invoiceDate = new Date(), invoiceNumber = "", items = [], uuid = uuidv4()) {
        this.invoiceDate = invoiceDate;
        this.invoiceNumber = invoiceNumber;
        this.uuid = uuid;
        this.items = items.map((item) => (new Item(item.price, item.quantity, item.description, item.uuid)));
    }

    async save() {
        const existingInvoice = db.data.invoices.filter((invoice) => (invoice.uuid === this.uuid));
        if (existingInvoice.length === 1) {
            db.data.invoices = db.data.invoices.map((invoice) => (invoice.uuid === this.uuid ? new Invoice(this.invoiceDate, this.invoiceNumber, this.items, this.uuid) : invoice));
            return Invoice.findOne(this.uuid);
        } else {
            db.data.invoices.push(this);
        }
        await db.write();
    }

    static async findAll() {
        // return db.data.invoices;
        return db.data.invoices.map((invoice) => (new Invoice(
            invoice.invoiceDate,
            invoice.invoiceNumber,
            // invoice.items,
            invoice.items.map((item) => (new Item(item.price, item.quantity, item.description, item.uuid))),
            invoice.uuid
        )));
    }

    static async findOne(uuid) {
        const invoice = db.data.invoices.filter((invoice) => (invoice.uuid === uuid));
        if (invoice.length === 1) {
            return new Invoice(
                invoice[0].invoiceDate,
                invoice[0].invoiceNumber,
                // invoice[0].items,
                invoice[0].items.map((item) => (new Item(item.price, item.quantity, item.description, item.uuid))),
                invoice[0].uuid);
        }
        return null;
    }

    static async destroy(uuid) {
        db.data.invoices = db.data.invoices.filter((invoice) => (invoice.uuid !== uuid));
        await db.write();
    }

    static async clone(invoice) {
        const clonedInvoice = new Invoice(
            invoice.invoiceDate,
            invoice.invoiceNumber,
            invoice.items.map((item) => (new Item(item.price, item.quantity, item.description)))
        );
        await clonedInvoice.save();
        return clonedInvoice;
    }

    // node 14.16
    [util.inspect.custom](depth, opts) {
        // nice printout of invoice
        return '' + this.invoiceNumber;
    };

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

}

export default Invoice;