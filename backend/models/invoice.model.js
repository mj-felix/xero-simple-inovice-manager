import { v4 as uuidv4 } from 'uuid';
import util from 'util';
import colors from 'colors';

import { db } from '../database/connection.js';
import Item from './item.model.js';

class Invoice {
    constructor(invoiceDate = new Date().toISOString().substring(0, 10), invoiceNumber = "", items = [], uuid = uuidv4()) {
        this.invoiceDate = invoiceDate;
        this.invoiceNumber = invoiceNumber;
        this.uuid = uuid;
        this.items = items.map((item) => (new Item(item.price, item.quantity, item.description, item.uuid)));
    }

    async save() {
        const existingInvoice = db.data.invoices.filter((invoice) => (invoice.uuid === this.uuid));
        if (existingInvoice.length === 1) {
            db.data.invoices = db.data.invoices.map((invoice) => (invoice.uuid === this.uuid ? new Invoice(this.invoiceDate, this.invoiceNumber, this.items, this.uuid) : invoice));
        } else {
            db.data.invoices.push(this);
        }
        await db.write();
        return Invoice.findOne(this.uuid);
    }

    static async findAll() {
        // return db.data.invoices;
        const foundInvoices = db.data.invoices.map((invoice) => (new Invoice(
            invoice.invoiceDate,
            invoice.invoiceNumber,
            // invoice.items,
            invoice.items.map((item) => (new Item(item.price, item.quantity, item.description, item.uuid))),
            invoice.uuid
        )));
        foundInvoices.forEach(invoice => invoice.totalValue = invoice.getTotalValue());
        return foundInvoices;
    }

    static async findOne(uuid) {
        const invoice = db.data.invoices.filter((invoice) => (invoice.uuid === uuid));
        if (invoice.length === 1) {
            const foundInvoice = new Invoice(
                invoice[0].invoiceDate,
                invoice[0].invoiceNumber,
                // invoice[0].items,
                invoice[0].items.map((item) => (new Item(item.price, item.quantity, item.description, item.uuid))),
                invoice[0].uuid);
            foundInvoice.totalValue = foundInvoice.getTotalValue();
            return foundInvoice;
        }
        return null;
    }

    static async destroy(uuid) {
        db.data.invoices = db.data.invoices.filter((invoice) => (invoice.uuid !== uuid));
        await db.write();
    }

    static async clone(existingInvoice) {
        const clonedInvoice = new Invoice(
            existingInvoice.invoiceDate,
            'Cloned: ' + existingInvoice.invoiceNumber,
            existingInvoice.items.map((item) => (new Item(item.price, item.quantity, item.description)))
        );
        await clonedInvoice.save();
        clonedInvoice.totalValue = clonedInvoice.getTotalValue();
        return clonedInvoice;
    }

    // node 14.16 - nice printout of invoice ;-)
    [util.inspect.custom](depth, opts) {
        let printedInvoice = '\n-------------------------------------------------\n'.yellow;
        printedInvoice += `Invoice Date:   ${this.invoiceDate.green}\n`;
        printedInvoice += `Invoice Number: ${this.invoiceNumber.green}\n`;
        printedInvoice += '-------------------------------------------------\n'.yellow;
        printedInvoice += `${'Item'.padEnd(20, ' ')}${'Price'.padEnd(10, ' ')}Quantity\n`.cyan;
        for (const item of this.items) {
            printedInvoice += `${item.description.padEnd(20, ' ')}${item.price.toString().padEnd(10, ' ')}${item.quantity}\n`;
        }
        printedInvoice += '-------------------------------------------------\n'.yellow;
        printedInvoice += `${'Total:'.padStart(36, ' ')} ${this.getTotalValue()}\n`.magenta.bold;
        printedInvoice += '-------------------------------------------------\n\n'.yellow;
        return printedInvoice;
    };

    getTotalValue() {
        return parseFloat(this.items.reduce((accumulator, item) => (accumulator + (item.price * item.quantity)), 0).toFixed(2));
    };

    // if (overwrite) then invoices are merged into the first one and remaining ones are deleted - code should be refactored - only POC
    static async merge(uuids, overwrite) {
        let invoiceNumber = 'Merged invoice numbers: ';
        let firstInvoice;
        const items = [];
        for (const uuid of uuids) {
            const existingInvoice = await Invoice.findOne(uuid);
            if (overwrite && !firstInvoice) {
                firstInvoice = existingInvoice;
            }
            invoiceNumber += existingInvoice.invoiceNumber + ' ';
            existingInvoice.items.forEach(item => {
                if (overwrite && firstInvoice === existingInvoice) {
                    items.push(new Item(item.price, item.quantity, item.description, item.uuid));
                } else {
                    items.push(new Item(item.price, item.quantity, item.description));
                }
            });
            if (overwrite && firstInvoice !== existingInvoice) {
                await Invoice.destroy(existingInvoice.uuid);
            }
        }
        invoiceNumber = invoiceNumber.trim();
        if (overwrite && firstInvoice) {
            firstInvoice.invoiceNumber = `${firstInvoice.invoiceNumber} (${invoiceNumber})`;
            firstInvoice.items = items;
            firstInvoice.save();
            firstInvoice.totalValue = firstInvoice.getTotalValue();
            return firstInvoice;
        } else {
            const mergedInvoice = new Invoice(undefined, invoiceNumber, items);
            await mergedInvoice.save();
            mergedInvoice.totalValue = mergedInvoice.getTotalValue();
            return mergedInvoice;
        }
    }

    async addItem(item) {
        this.items.push(item);
        return await this.save();
    };

    async removeItem(uuid) {
        this.items = this.items.filter((item) => (item.uuid !== uuid));
        return await this.save();
    };

}

export default Invoice;