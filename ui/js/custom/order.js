var productPrices = {};

$(function () {
    //Json data by api call for order table
    $.get(productListApiUrl, function (response) {
        productPrices = {}
        if(response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function(index, product) {
                options += '<option value="'+ product.product_id +'">'+ escapeHtml(product.product_name) +'</option>';
                productPrices[product.product_id] = product.price_per_unit;
            });
            $(".product-box").find("select").empty().html(options);
            $("#addMoreButton").click();   // NEW: start with one product row already on the page
        }
    });
});

$("#addMoreButton").click(function () {
    var row = $(".product-box").html();
    $(".product-box-extra").append(row);
    $(".product-box-extra .remove-row").last().removeClass('hideit');
    $(".product-box-extra .product-price").last().text('0.0');
    $(".product-box-extra .product-qty").last().val('1');
    $(".product-box-extra .product-total").last().text('0.0');
});

$(document).on("click", ".remove-row", function (){
    $(this).closest('.row').remove();
    calculateValue();
});

$(document).on("change", ".cart-product", function (){
    var product_id = $(this).val();
    var price = productPrices[product_id];

    $(this).closest('.row').find('#product_price').val(price);
    calculateValue();
});

$(document).on("change", ".product-qty", function (e){
    calculateValue();
});

// NEW: returns an error message if the order is not ready to save, otherwise ''
function validateOrder() {
    if ($.trim($("#customerName").val()) === '') {
        return 'Please enter the customer name';
    }
    var rows = $("#itemsInOrder .product-item");
    if (rows.length === 0) {
        return 'Add at least one product';
    }
    var message = '';
    rows.each(function () {
        if ($(this).find('.cart-product').val() === '') {
            message = 'Please select a product in every row';
        } else if (!(parseFloat($(this).find('.product-qty').val()) > 0)) {
            message = 'Quantity must be at least 1';
        }
    });
    return message;
}

$("#saveOrder").on("click", function(){
    var errorMessage = validateOrder();
    if (errorMessage) {
        showToast(errorMessage, 'error');
        return;
    }

    var formData = $("form").serializeArray();
    var requestPayload = {
        customer_name: null,
        grand_total: null,
        order_details: []
    };
    var orderDetails = [];
    for(var i=0;i<formData.length;++i) {
        var element = formData[i];
        var lastElement = null;

        switch(element.name) {
            case 'customerName':
                requestPayload.customer_name = $.trim(element.value);
                break;
            case 'product_grand_total':
                requestPayload.grand_total = element.value;
                break;
            case 'product':
                requestPayload.order_details.push({
                    product_id: element.value,
                    quantity: null,
                    total_price: null
                });                
                break;
            case 'qty':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                lastElement.quantity = element.value
                break;
            case 'item_total':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                lastElement.total_price = element.value
                break;
        }

    }
    callApi("POST", orderSaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    }, 'Order saved');
});
