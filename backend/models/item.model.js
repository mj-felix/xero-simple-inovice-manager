import { v4 as uuidv4 } from 'uuid';

class Item {
    constructor(price, quantity, description, uuid = uuidv4()) {
        this.uuid = uuid;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
    }

    toString() {
        return `${this.description.padEnd(20, ' ')}${this.price.toString().padEnd(10, ' ')}${this.quantity}\n`;
    }

}

export default Item;