/**
 * Created by oliver on 1/26/16.
 */
TestCase("shopcart", {
    "test cart Delete Item": function () {

        savedCart = this.createCart(['apple', 'pear', 'orange']);

        session = {
            get: function get() {
                return this.cart;
            },

            //Grab the saved cart
            cart: this.createCart(savedCart.items)
        };
        var item = 'grapefruit';
        // addItem gets triggered by an event handler somewhere
        session.cart.addItem(item);
        item = 'apple';
        session.cart.deleteItem(item);
        //console.log(savedCart.items);
        console.log('This is session cart content: '+session.cart.items);
        console.log('This is saved cart content: '+savedCart.items);

        assertEquals("Deleted Item Session cart has grapefruit.", -1, savedCart.items.indexOf('grapefruit'));
    },
    "test cart Add Item": function () {
        // Load cart with stored items.
        savedCart = this.createCart(['apple', 'pear', 'orange']);

        session = {
            get: function get() {
                return this.cart;
            },

            //Grab the saved cart
            cart: this.createCart(savedCart.items)
        };

        // addItem gets triggered by an event handler somewhere
        session.cart.addItem("grapefruit");

        assertEquals("Added Item Session cart has grapefruit.", 3, session.cart.items.indexOf('grapefruit'));
    },
    setUp: function () {
        var cartPorto = {
            items: [],
            addItem: function addItem(item) {
                this.items.push(item);
            },
            deleteItem: function deleteItem(item) {
                //this.items.pop(item); // pop()方法只能删除最后添加的元素即后入先出 shift()方法遵循先入先出
                var index = this.items.indexOf(item);
                this.items.splice(index,1);
            }
        };
        this.createCart = function (items) {
            var cart = Object.create(cartPorto);
            cart.items = Object.create(items);
            return cart;
        };
    }
})