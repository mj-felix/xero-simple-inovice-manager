import { v4 as uuidv4 } from 'uuid';

class Item {
    constructor(price, quantity, description, uuid = uuidv4()) {
        this.uuid = uuid;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
    }
}

export default Item;