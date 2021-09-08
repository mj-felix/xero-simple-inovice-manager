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
                        if (lineArr[1]) {
                            await this.printOne(lineArr[1]);
                        } else {
                            await this.printAll();
                        }
                        break;
                    case 'q':
                        console.log('Closing ...');
                        rl.close();
                    default:
                        console.log('Option unknown ...');
                        break;
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