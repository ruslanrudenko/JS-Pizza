/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage	=require('../storage/storage');
var API = require("../API");

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $(".cart-container");
var $amount = $(".count2");
var $cost = $(".s2");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var inCart =false;
    Cart.forEach(function (node) {
        if (node.pizza.id === pizza.id && node.size == size) {
            Cart[Cart.indexOf(node)].quantity++;
            inCart=true;
        }
    });

    //Приклад реалізації, можна робити будь-яким іншим способом
    if(!inCart) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    var ind = Cart.indexOf(cart_item);
    Cart = Cart.slice(0, ind).concat(Cart.slice(ind + 1));
    //Після видалення оновити відображення
    updateCart();
}
$(".wipe").click(function () {
    Cart = [];
    updateCart();
});

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //get
    var saved_orders =	Storage.get('cart');
    if(saved_orders)	{
        Cart	=	saved_orders;
    }

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus-btn").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus-btn").click(function () {
            if (cart_item.quantity == 1) {
                removeFromCart(cart_item);
            }else{
                cart_item.quantity--;
            }
            updateCart();
        });

        $node.find(".wipe-btn").click(function () {
            removeFromCart(cart_item);
            updateCart();
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    var sum = 0;
    Cart.forEach(function (cart_item) {
        sum += cart_item.pizza[cart_item.size].price * cart_item.quantity;
    });
    $cost.text(sum+"грн");
    $amount.text(Cart.length);
    if(Cart.length>0) {
        $(".big-btn").find(".btn").prop("disabled", false);
        $(".wipe").prop("disabled",false);
        $(".big-btn").find(".firstBtn").attr("onclick", "window.location.href='/order.html'");
    }
    else {
        $(".big-btn").find(".btn").prop("disabled", true);

        $(".wipe").prop("disabled",true);
    }
    //set
    Storage.set("cart",	Cart);

}

$(".order").attr("disabled", true);
var phonev=false;
var namev=false;
var adrv=false;
    function validateName() {
        var name = $("#inputName").val();
        if(name) {
            if (!name.match(/^([a-zA-Zа-яА-Я]+|[ ]|[\-])+$/)) {
                $(".name-danger").css("display", "block");
                $(".order").attr("disabled", true);
                namev=false;
                return false;
            } else {
                $(".name-danger").css("display", "none");
                namev=true;
                return true;
            }
        }
    }

    function validatePhone() {
        var tel = $("#inputPhone").val();

        if (tel.match(/^(\+380|0)\d{9}$/)) {
                $(".tel-danger").css("display", "none");
                phonev=true;
                return true;
            } else {
                $(".tel-danger").css("display", "block");
                $(".order").prop("disabled", true);
                phonev=false;
                return false;
            }

    }

    function validateAddress() {
        var adr = $("#inputAddress").val();
        if (adr.length>1) {
            $(".adr-danger").css("display", "none");
            adrv=true;
            return true;
        } else {
            $(".adr-danger").css("display", "block");
            $(".order").prop("disabled", true);
            adrv=false;
            return false;
        }
    }

        $(".container-fluid").find("#inputPhone").on("input", function () {
            validatePhone();
            if(namev && adrv && phonev){
                $(".order").attr("disabled", false);
            }else{
                $(".order").attr("disabled", true);
            }

        });
$(".container-fluid").find("#inputAddress").on("input", function () {
            validateAddress();
    if(namev && adrv && phonev){
        $(".order").attr("disabled", false);
    }else{
        $(".order").attr("disabled", true);
    }
        });
$(".container-fluid").find("#inputName").on("input", function () {
            validateName();
            if(namev && adrv && phonev){
                $(".order").attr("disabled", false);
            }else{
                $(".order").attr("disabled", true);
            }
        });
$(".order").click(function(){
    var order = [];
    Cart.forEach(function (pizza_cart) {
        order.push([pizza_cart.pizza.title, pizza_cart.size, pizza_cart.quantity]);
    });
    var body = {
        order: order,
        name: $("#inputName").val(),
        address: $("#inputAddress").val(),
        phone: $("#inputPhone").val(),
        price: $(".s2").text()
    };
    API.createOrder(body, function (err, data) {
        if(err)
            alert("Failed!");

        else
            alert("Your order was successfull!");
    });

});




exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;