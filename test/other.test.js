import { expect } from 'chai';
import { v4 as uuidv4 } from 'uuid';

import Invoice from '../backend/models/invoice.model.js';
import { connect } from '../backend/database/connection.js';

describe('Merge invoices', () => {

    it('smart merges items', async () => {

        // ARRANGE / GIVEN: 
        const invoice1Obj = {
            invoiceDate: '2021-10-12',
            invoiceNumber: 'INV' + uuidv4(),
            items: [
                {
                    price: 10.21,
                    quantity: 8,
                    description: 'Apple'
                },
                {
                    price: 5.21,
                    quantity: 6,
                    description: 'Orange'
                }
            ]
        };
        const invoice1 = new Invoice(invoice1Obj.invoiceDate, invoice1Obj.invoiceNumber, invoice1Obj.items);
        const invoice1Total = invoice1.getTotalValue();

        const invoice2Obj = {
            invoiceDate: '2021-10-13',
            invoiceNumber: 'INV' + uuidv4(),
            items: [
                {
                    price: 10.21,
                    quantity: 5,
                    description: 'Apple'
                },
                {
                    price: 5.21,
                    quantity: 3,
                    description: 'Apple'
                }
            ]
        };
        const invoice2 = new Invoice(invoice2Obj.invoiceDate, invoice2Obj.invoiceNumber, invoice2Obj.items);
        const invoice2Total = invoice2.getTotalValue();

        // ACT / WHEN:
        await connect();
        const updatedInvoice1 = await invoice1.smartMerge(invoice2);

        // ASSERT / THEN:
        expect(updatedInvoice1.getTotalValue()).to.eql(invoice1Total + invoice2Total);
        expect(updatedInvoice1.items.length).to.eql(3);

    });

});




