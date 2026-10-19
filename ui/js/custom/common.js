// Define your api here
var productListApiUrl = 'http://127.0.0.1:5000/get_products';
var uomListApiUrl = 'http://127.0.0.1:5000/get_uoms';
var productSaveApiUrl = 'http://127.0.0.1:5000/insert_product';
var productUpdateApiUrl = 'http://127.0.0.1:5000/update_product';      // NEW
var productDeleteApiUrl = 'http://127.0.0.1:5000/delete_product';
var orderListApiUrl = 'http://127.0.0.1:5000/get_all_orders';
var orderDetailsApiUrl = 'http://127.0.0.1:5000/get_order_details';    // NEW
var orderSaveApiUrl = 'http://127.0.0.1:5000/insert_order';

// NEW: small message box (top-right) instead of the browser alert()
// type is 'success' (green) or 'error' (red)
function showToast(message, type) {
    var toast = $('<div class="toast-msg toast-' + type + '"></div>').text(message);
    $('body').append(toast);
    setTimeout(function () {
        toast.fadeOut(300, function () { toast.remove(); });
    }, 2500);
}

// NEW: makes text safe before we put it inside HTML (stops a product name like <b>x</b> from running as HTML)
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function callApi(method, url, data, successMessage) {
    $.ajax({
        method: method,
        url: url,
        data: data
    }).done(function (msg) {
        showToast(successMessage || 'Done', 'success');
        setTimeout(function () { window.location.reload(); }, 800);
    }).fail(function (xhr) {
        // the server sends {"error": "..."} for validation problems
        var message = (xhr.responseJSON && xhr.responseJSON.error) ||
                      ('Request failed: ' + xhr.status + ' ' + xhr.statusText);
        showToast(message, 'error');
    });
}

function calculateValue() {
    var total = 0;
    $(".product-item").each(function( index ) {
        var qty = parseFloat($(this).find('.product-qty').val()) || 0;
        var price = parseFloat($(this).find('#product_price').val()) || 0;
        price = price*qty;
        $(this).find('#item_total').val(price.toFixed(2));
        total += price;
    });
    $("#product_grand_total").val(total.toFixed(2));
}
