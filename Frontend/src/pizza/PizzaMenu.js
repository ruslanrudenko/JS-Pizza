/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = {};
var API = require('../API');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $(".left");
function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");
    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});
        var $node = $(html_code);

        $node.find(".buy-btn-medium").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-btn-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

$(".pizzaT").click(function () {
    $(".pizzaT").each(function(i, obj) {
        $(this).css("background-color", "#fffff5");
        $(this).css("color", "#ec890e")
    });
    $(this).css("background-color", "orange");
    $(this).css("color", "white");
    filterPizza(+$(this).attr("itemid"));

});
function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        //Якщо піка відповідає фільтру
        //pizza_shown.push(pizza);
        switch(filter){
            case 1:
                pizza_shown.push(pizza);
                $(".header").find(".a").text("Усі піци");
                break;
            case 2:
                if(pizza.content.meat)
                    pizza_shown.push(pizza);
                $(".header").find(".a").text("М'ясні піци");
                break;
            case 3:
                if(pizza.content.pineapple)
                    pizza_shown.push(pizza);
                $(".header").find(".a").text("З ананасами");
                break;
            case 4:
                if(pizza.content.mushroom)
                    pizza_shown.push(pizza);
                $(".header").find(".a").text("З грибами");
                break;
            case 5:
                if(pizza.content.ocean)
                    pizza_shown.push(pizza);
                $(".header").find(".a").text("З морепродуктами");
                break;
            case 6:
                if(pizza.type === 'Вега піца')
                    pizza_shown.push(pizza);
                $(".header").find(".a").text("Вега піци");
                break;
            default:
                break;

        }

    });
    $(".header").find(".pizza-count").text(pizza_shown.length);
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    API.getPizzaList(function (err, data) {
        if(err)
            alert("Failed to load pizzas from server!");
        else {
            Pizza_List = data;
            showPizzaList(Pizza_List);
        }
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;