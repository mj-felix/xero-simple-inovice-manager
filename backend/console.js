import readline from 'readline';

import { db, connect } from './database/connection.js';
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
        console.log('Available options:');
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

    run() {
        this.printOptions();

        const rl = readline.createInterface(process.stdin, process.stdout);

        rl.setPrompt('> ');
        rl.prompt();

        rl.on('line', async (line) => {
            try {
                await db.read();
                switch (line.trim()) {
                    case 'print':
                        await this.printAll();
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