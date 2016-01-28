/**
 * Created by oliver on 1/26/16.
 */
test('Order WITH unintentional side effect.', function () {
    var cartProto = {
        items: [],
        addItem: function addItem(item) {
            this.items.push(item);
        }
    },
        createCart = function (items) {
            var cart = Object.create(cartProto);
            cart.items = items;
            return cart;
        },

        //Load cart with stored items.
        savedCart = createCart(['apple','pear','orange']),

        session = {
            get: function get() {
                return this.cart;
            },

            //Grab the saved cart
            cart: createCart(savedCart.items)
        };

    // addItem gets triggered by an event handler somewhere
    session.cart.addItem('grapefruit');

    ok(session.cart.items.indexOf('grapefruit')
    !== -1,'Passes: Session cart has grapefruit.');

    ok(savedCart.cart.items.indexOf('grapefruit')
    === -1,'Fails: The stored cart is unchanged.')
});