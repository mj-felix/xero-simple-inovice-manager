import { v4 as uuidv4 } from 'uuid';
import util from 'util';
import colors from 'colors';

import { db } from '../database/connection.js';
import Item from './item.model.js';

class Invoice {
    /**
     * Represents an Invoice.
     * @constructor
     * @param {string} invoiceDate Invoice date.
     * @param {string} invoiceNumber Invoice number.
     * @param {Array.<Item>} items Array of (invoice) Item objects.
     * @param {string} uuid Invoice identifier.
     */
    constructor(invoiceDate = new Date().toISOString().substring(0, 10), invoiceNumber = "", items = [], uuid = uuidv4()) {
        this.invoiceDate = invoiceDate;
        this.invoiceNumber = invoiceNumber;
        this.uuid = uuid;
        this.items = items.map((item) => (new Item(item.price, item.quantity, item.description, item.uuid)));
    }

    /**
     *  Saves amended or newly created invoice.
     * 
     *  @returns {Invoice} Updated or created Invoice object.
     */
    async save() {
        const existingInvoice = db.data.invoices.filter((invoice) => (invoice.uuid === this.uuid));

        if (existingInvoice && existingInvoice.length === 1) {
            db.data.invoices = db.data.invoices.map((invoice) => (invoice.uuid === this.uuid ? new Invoice(this.invoiceDate, this.invoiceNumber, this.items, this.uuid) : invoice));
        } else {
            db.data.invoices.push(this);
        }
        await db.write();
        return await Invoice.findOne(this.uuid);
    }

    /**
    *  Finds and returns all invoices
    *
    *  @returns {Array.<Invoice>} Array of Invoice objects.
    */
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

    /**
    *  Finds Invoice by id and returns it.
    *
    *  @param {string} uuid Invoice identifier.
    *  @returns {Invoice} Invoice object.
    */
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

    /**
    *  Finds Invoice by id and deletes it.
    *
    *  @param {string} uuid Invoice identifier.
    */
    static async destroy(uuid) {
        db.data.invoices = db.data.invoices.filter((invoice) => (invoice.uuid !== uuid));
        await db.write();
    }

    /**
    *  Copies passed in Invoice into a brand new one.
    *
    *  @param {Invoice} existingInvoice Invoice object to clone.
    *  @returns {Invoice} Newly created Invoice object.
    */
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

    /**
    *  Creates a brand new copy of the invoice.
    *
    *  @returns {Invoice} Newly created Invoice object.
    */
    async cloneNonStatic() {
        // return await Invoice.clone(this);
        const clonedInvoice = new Invoice(
            this.invoiceDate,
            'Cloned: ' + this.invoiceNumber,
            this.items.map((item) => (new Item(item.price, item.quantity, item.description)))
        );
        await clonedInvoice.save();
        clonedInvoice.totalValue = clonedInvoice.getTotalValue();
        return clonedInvoice;
    }

    /**
    *  Returns string representation of the Invoice.
    *
    *  @returns {string} String object.
    */
    toString() {
        let printedInvoice = '\n-------------------------------------------------\n'.yellow;
        printedInvoice += `Invoice Date:   ${this.invoiceDate.green}\n`;
        printedInvoice += `Invoice Number: ${this.invoiceNumber.green}\n`;
        printedInvoice += '-------------------------------------------------\n'.yellow;
        printedInvoice += `${'Item'.padEnd(20, ' ')}${'Price'.padEnd(10, ' ')}Quantity\n`.cyan;
        for (const item of this.items) {
            // printedInvoice += `${item.description.padEnd(20, ' ')}${item.price.toString().padEnd(10, ' ')}${item.quantity}\n`;
            printedInvoice += item.toString();
        }
        printedInvoice += '-------------------------------------------------\n'.yellow;
        printedInvoice += `${'Total:'.padStart(36, ' ')} ${this.getTotalValue()}\n`.magenta.bold;
        printedInvoice += '-------------------------------------------------\n\n'.yellow;
        return printedInvoice;
    }

    /**
    *  Custom [util.inspect.custom](depth, opts) function invoked by util.inspect().
    *
    *  @returns {string} String object.
    *  @description Result is used in console.log
    *  @see {@link https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects}
    */
    [util.inspect.custom](depth, opts) {
        return this.toString();
    };

    /**
    *  Calculates and returns total value of the items on the invoice.
    *
    *  @returns {number} Total value.
    */
    getTotalValue() {
        return parseFloat(this.items.reduce((accumulator, item) => (accumulator + (item.price * item.quantity)), 0).toFixed(2));
    };

    /**
    *  Merges passed in Invoices into a brand new one retianing the original ones or overwrites the first one removing the other ones.
    *
    *  @param {Array.<string>} uuids Array of Invoice identifiers.
    *  @param {boolean} overwrite Overwrite flag. If overwrite is true then invoices are merged into the first one and remaining ones are deleted - code should be refactored - only POC.
    *  @returns {Invoice} Newly created or updated Invoice object.
    */
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

    /**
    *  Adds invoice item to the Invoice.
    *
    *  @param {Item} item Invoice item object.
    *  @returns {Invoice} Updated Invoice object.
    */
    async addItem(item) {
        this.items.push(item);
        return await this.save();
    };

    /**
    *  Removes invoice item from the Invoice.
    *
    *  @param {string} uuid Item identfier.
    *  @returns {Invoice} Updated Invoice object.
    */
    async removeItem(uuid) {
        this.items = this.items.filter((item) => (item.uuid !== uuid));
        return await this.save();
    };

    static async getTotal() {
        const invoices = await Invoice.findAll();
        return parseFloat(invoices.reduce((accumulator, invoice) => (accumulator + invoice.getTotalValue()), 0).toFixed(2));
    }

    static async invoiceNumberExists(invoiceNumber, invoiceId) {
        const invoices = await Invoice.findAll();

        for (let invoice of invoices) {
            if (invoice.invoiceNumber === invoiceNumber && (invoiceId ? invoice.uuid !== invoiceId : true)) return true;
        }

        return false;
    }

    static async findByInvoiceNumber(invoiceNumber) {

        const invoice = db.data.invoices.filter((invoice) => (invoice.invoiceNumber === invoiceNumber));
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

    itemExist(item) {
        const { description, price } = item;
        for (let item of this.items) {
            if (item.price === price && item.description === description) {
                return item;
            }
        }
        return false;
    }

    async smartMerge(invoice) {
        const itemsToCopy = invoice.items;
        for (let item of itemsToCopy) {
            const existingItem = await this.itemExist(item);
            if (existingItem) {
                existingItem.quantity = existingItem.quantity + item.quantity;
            } else {
                this.items.push(new Item(item.price, item.quantity, item.description));
            }
        }
        // await this.save();
        return this;
    }

}

export default Invoice;