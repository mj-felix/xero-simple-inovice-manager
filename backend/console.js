import readline from 'readline';

import { db } from './database/connection.js';
import Invoice from './models/invoice.model.js';

class ConsoleApp {

    constructor() {
        this.options = [
            'print - prints all invoices',
            'print INVOICE_NUMBER - prints invoice with INVOICE_NUMBER',
            'q - quits program'
        ];
    }

    printOptions() {
        console.log('\nAvailable options:');
        for (let option of this.options) {
            console.log(option);
        }
    }

    async printAll() {
        const allInvoices = await Invoice.findAll();
        console.log('\nNumber of invoices found: ' + allInvoices.length);
        console.log('Value of invoices found: ' + await Invoice.getTotal());
        for (let invoice of allInvoices) {
            console.log(invoice);
        }
    }

    async printOne(invoiceNumber) {
        const invoice = await Invoice.findByInvoiceNumber(invoiceNumber);
        if (!invoice) console.log('\nInvoice not found');
        else console.log(invoice);
    }

    async sort(field, order) {
        const allInvoices = await Invoice.findAll();
        console.log('\nNumber of invoices found: ' + allInvoices.length);
        console.log('Value of invoices found: ' + await Invoice.getTotal());

        if (field === 'date' && order === 'asc') {
            allInvoices.sort((a, b) => (new Date(a.invoiceDate) - new Date(b.invoiceDate)));

        } else if (field === 'date' && order === 'desc') {
            allInvoices.sort((a, b) => (new Date(b.invoiceDate) - new Date(a.invoiceDate)));
        } else if (field === 'number' && order === 'asc') {
            allInvoices.sort(this.sortInvoicesByNumberAsc);
        } else {
            allInvoices.sort(this.sortInvoicesByNumberDesc);
        }
        console.log('\nInvoices sorted by', field, order);

        for (let invoice of allInvoices) {
            console.log(invoice);
        }

    }

    sortInvoicesByNumberAsc = (a, b) => {
        const numA = a.invoiceNumber.toLowerCase();
        const numB = b.invoiceNumber.toLowerCase();
        if (numA < numB) {
            return -1;
        }
        if (numA > numB) {
            return 1;
        }
        return 0;
    };

    sortInvoicesByNumberDesc = (a, b) => {
        const numA = a.invoiceNumber.toLowerCase();
        const numB = b.invoiceNumber.toLowerCase();
        if (numA < numB) {
            return 1;
        }
        if (numA > numB) {
            return -1;
        }
        return 0;
    };

    run() {
        this.printOptions();

        const rl = readline.createInterface(process.stdin, process.stdout);

        rl.setPrompt('> ');
        rl.prompt();

        rl.on('line', async (line) => {
            const trimmedLine = line.trim();
            const lineArr = trimmedLine.split(' ');
            const command = lineArr[0];
            try {
                await db.read();
                switch (command) {
                    case 'print':
                        const invoiceNumber = lineArr[1];
                        if (invoiceNumber) {
                            await this.printOne(invoiceNumber);
                        } else {
                            await this.printAll();
                        }
                        break;
                    case 'sort':
                        let field = lineArr[1];
                        if (field !== 'date' && field !== 'number') field = 'date';
                        let order = lineArr[2];
                        if (order !== 'asc' && order !== 'desc') order = 'asc';
                        await this.sort(field, order);
                        break;
                    case 'q':
                        console.log('Closing ...');
                        rl.close();
                    default:
                        console.log('Option unknown ...');
                }
            } catch (e) { console.log(e); }
            finally {
                this.printOptions();
                rl.prompt();
            }

        }).on('close', function () {
            console.log('Have a great day!');
            process.exit(0);
        });

    }

}

new ConsoleApp().run();