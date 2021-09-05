import supertest from 'supertest';
import { expect } from 'chai';

import errors from '../backend/messages/error.messages.js';

const request = supertest('http://localhost:5000/api/v1');


// data setup = GLOBAL GIVEN:
const invoice1 = {
    "invoiceDate": "2021-10-12",
    "invoiceNumber": "INV01",
    "items": [
        {
            "price": 3.21,
            "quantity": 3,
            "description": "Banana"
        }
    ]
};

const invoice2 = {
    "invoiceDate": "2021-10-12",
    "invoiceNumber": "INV02",
    "items": [
        {
            "price": 10.21,
            "quantity": 8,
            "description": "Apple"
        },
        {
            "price": 5.21,
            "quantity": 6,
            "description": "Orange"
        }
    ]
};

const item1 = {
    "price": 10.21,
    "quantity": 12,
    "description": "Banana"
};

let invoice1Id, invoice2Id, item1Id, clonedInvoiceId;

describe('Invoice operations (SELECTED ONLY)', () => {

    it("creates invoice (2 items)", async () => {

        // GIVEN: 
        const endpoint = '/invoices';
        const payload = invoice2;

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(201);
        expect(response.body).to.include.all.keys('invoiceDate', 'invoiceNumber', 'items', 'uuid', 'totalValue');
        expect(response.body.invoiceDate).to.eql(payload.invoiceDate);
        expect(response.body.invoiceNumber).to.eql(payload.invoiceNumber);
        expect(response.body.totalValue).to.eql(parseFloat((10.21 * 8 + 5.21 * 6).toFixed(2)));
        expect(response.body.items.length).to.eql(payload.items.length);
        for (let i; i < response.body.items.length; i++) {
            response.body.items[i].keys().map((property) => {
                expect(response.body.items[i][property]).to.eql(payload.items[i][property]);
            });
        }

        // data setup
        invoice2Id = response.body.uuid;

    });

    it("creates invoice (1 item)", async () => {

        // GIVEN: 
        const endpoint = '/invoices';
        const payload = invoice1;

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(201);
        expect(response.body).to.include.all.keys('invoiceDate', 'invoiceNumber', 'items', 'uuid', 'totalValue');
        expect(response.body.invoiceDate).to.eql(payload.invoiceDate);
        expect(response.body.invoiceNumber).to.eql(payload.invoiceNumber);
        expect(response.body.totalValue).to.eql(parseFloat((3.21 * 3).toFixed(2)));
        expect(response.body.items.length).to.eql(payload.items.length);
        for (let i; i < response.body.items.length; i++) {
            response.body.items[i].keys().map((property) => {
                expect(response.body.items[i][property]).to.eql(payload.items[i][property]);
            });
        }

        // data setup
        invoice1Id = response.body.uuid;

    });

    it("clones invoice", async () => {

        // GIVEN: 
        const endpoint = `/invoices/${invoice2Id}`;

        // WHEN:
        const response = await request
            .post(endpoint);

        // THEN:
        expect(response.status).to.eql(201);
        expect(response.body).to.include.all.keys('invoiceDate', 'invoiceNumber', 'items', 'uuid', 'totalValue');
        expect(response.body.invoiceDate).to.eql(invoice2.invoiceDate);
        expect(response.body.invoiceNumber).to.eql('Cloned: ' + invoice2.invoiceNumber);
        expect(response.body.totalValue).to.eql(parseFloat((10.21 * 8 + 5.21 * 6).toFixed(2)));
        expect(response.body.items.length).to.eql(invoice2.items.length);
        for (let i; i < response.body.items.length; i++) {
            response.body.items[i].keys().map((property) => {
                expect(response.body.items[i][property]).to.eql(invoice2.items[i][property]);
            });
        }

        clonedInvoiceId = response.body.uuid;

    });

    it("merges 2 invoices creating new one and retaining old ones", async () => {

        // GIVEN: 
        let endpoint = `/invoices/${invoice1Id},${invoice2Id}`;

        // WHEN:
        let response = await request
            .post(endpoint);

        // THEN:
        expect(response.status).to.eql(201);
        expect(response.body).to.include.all.keys('invoiceDate', 'invoiceNumber', 'items', 'uuid', 'totalValue');
        expect(response.body.invoiceDate).to.eql(new Date().toISOString().substring(0, 10));
        expect(response.body.invoiceNumber).to.eql(`Merged invoice numbers: ${invoice1.invoiceNumber} ${invoice2.invoiceNumber}`);
        expect(response.body.totalValue).to.eql(parseFloat((10.21 * 8 + 5.21 * 6 + 3.21 * 3).toFixed(2)));
        expect(response.body.items.length).to.eql(3);

        // check if invoice 1 exists
        // GIVEN: 
        endpoint = `/invoices/${invoice1Id}`;
        // WHEN:
        response = await request
            .get(endpoint);
        // THEN:
        expect(response.status).to.eql(200);

        // check if invoice 2 exists
        // GIVEN: 
        endpoint = `/invoices/${invoice2Id}`;
        // WHEN:
        response = await request
            .get(endpoint);
        // THEN:
        expect(response.status).to.eql(200);

    });

    it("merges 2 invoices overwriting the first one and deleting the secodn one", async () => {

        // GIVEN: 
        let endpoint = `/invoices/${invoice2Id},${clonedInvoiceId}?overwrite=true`;

        // WHEN:
        let response = await request
            .post(endpoint);

        // THEN:
        expect(response.status).to.eql(201);
        expect(response.body).to.include.all.keys('invoiceDate', 'invoiceNumber', 'items', 'uuid', 'totalValue');
        expect(response.body.invoiceDate).to.eql(invoice2.invoiceDate);
        expect(response.body.invoiceNumber).to.eql('INV02 (Merged invoice numbers: INV02 Cloned: INV02)');
        expect(response.body.totalValue).to.eql(parseFloat((10.21 * 8 + 5.21 * 6 + 10.21 * 8 + 5.21 * 6).toFixed(2)));
        expect(response.body.items.length).to.eql(4);

        // check if invoice cloned invoice exists
        // GIVEN: 
        endpoint = `/invoices/${clonedInvoiceId}`;
        // WHEN:
        response = await request
            .get(endpoint);
        // THEN:
        expect(response.status).to.eql(404);

    });

});

describe('Items operations', () => {

    it("adds item", async () => {

        // GIVEN: 
        const endpoint = `/invoices/${invoice1Id}/items`;
        const payload = item1;

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body).to.include.all.keys('invoiceDate', 'invoiceNumber', 'items', 'uuid', 'totalValue');
        expect(response.body.invoiceDate).to.eql(invoice1.invoiceDate);
        expect(response.body.invoiceNumber).to.eql(invoice1.invoiceNumber);
        expect(response.body.totalValue).to.eql(parseFloat((3.21 * 3 + 10.21 * 12).toFixed(2)));
        expect(response.body.items.length).to.eql(2);
        expect(response.body.items[0]).to.include.all.keys('uuid', 'price', 'quantity', 'description');
        expect(response.body.items[1]).to.include.all.keys('uuid', 'price', 'quantity', 'description');
        expect(response.body.items[0].price).to.eql(invoice1.items[0].price);
        expect(response.body.items[0].quantity).to.eql(invoice1.items[0].quantity);
        expect(response.body.items[0].description).to.eql(invoice1.items[0].description);
        expect(response.body.items[1].price).to.eql(payload.price);
        expect(response.body.items[1].quantity).to.eql(payload.quantity);
        expect(response.body.items[1].description).to.eql(payload.description);

        // data setup
        item1Id = response.body.items[1].uuid;

    });

    it("fails to add item without price, quantity and description (example of negative test case)", async () => {

        // GIVEN: 
        const endpoint = `/invoices/${invoice1Id}/items`;
        const payload = {};

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(422);
        expect(response.body.errors.length).to.eql(3);
        expect(response.body.errors[0].price).to.eql(errors.item.PRICE_POSITIVE_NUMBER);
        expect(response.body.errors[1].quantity).to.eql(errors.item.QUANTITY_POSITIVE_INTEGER);
        expect(response.body.errors[2].description).to.eql(errors.item.DESC_REQUIRED);

    });

    it("removes item", async () => {

        // GIVEN: 
        const endpoint = `/invoices/${invoice1Id}/items/${item1Id}`;

        // WHEN:
        const response = await request
            .delete(endpoint);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body).to.include.all.keys('invoiceDate', 'invoiceNumber', 'items', 'uuid', 'totalValue');
        expect(response.body.invoiceDate).to.eql(invoice1.invoiceDate);
        expect(response.body.invoiceNumber).to.eql(invoice1.invoiceNumber);
        expect(response.body.totalValue).to.eql(parseFloat((3.21 * 3).toFixed(2)));
        expect(response.body.items.length).to.eql(1);
        expect(response.body.items[0]).to.include.all.keys('uuid', 'price', 'quantity', 'description');
        expect(response.body.items[0].price).to.eql(invoice1.items[0].price);
        expect(response.body.items[0].quantity).to.eql(invoice1.items[0].quantity);
        expect(response.body.items[0].description).to.eql(invoice1.items[0].description);

    });


});