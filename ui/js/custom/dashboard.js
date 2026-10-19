$(function () {
    //Json data by api call for order table
    $.get(orderListApiUrl, function (response) {
        if(response) {
            var table = '';
            var totalCost = 0;
            $.each(response, function(index, order) {
                totalCost += parseFloat(order.total);
                // data-id / data-customer let us know which row was clicked
                table += '<tr class="order-row" data-id="' + order.order_id + '" data-customer="' + escapeHtml(order.customer_name) + '">' +
                    '<td>'+ order.datetime +'</td>'+
                    '<td>'+ order.order_id +'</td>'+
                    '<td>'+ escapeHtml(order.customer_name) +'</td>'+
                    '<td>'+ order.total.toFixed(2) +' Rs</td></tr>';
            });
            table += '<tr><td colspan="3" style="text-align: end"><b>Total</b></td><td><b>'+ totalCost.toFixed(2) +' Rs</b></td></tr>';
            $("#ordersTable").find('tbody').empty().html(table);

            // NEW: summary cards (calculated here from the same list, no extra API call)
            var average = response.length ? totalCost / response.length : 0;
            $("#statOrders").text(response.length);
            $("#statSales").text(totalCost.toFixed(2) + ' Rs');
            $("#statAverage").text(average.toFixed(2) + ' Rs');
        }
    }).fail(function () {
        showToast('Could not load orders. Is the Flask server running?', 'error');
    });
});

// NEW: click an order row -> fetch its items -> show them in the popup
$(document).on("click", ".order-row", function () {
    var orderId = $(this).data('id');
    var customer = $(this).data('customer');

    $.get(orderDetailsApiUrl, { order_id: orderId }, function (items) {
        var rows = '';
        $.each(items, function (index, item) {
            rows += '<tr>' +
                '<td>' + escapeHtml(item.product_name) + '</td>' +
                '<td>' + item.quantity + ' ' + escapeHtml(item.unit_name) + '</td>' +
                '<td>' + item.total_price.toFixed(2) + ' Rs</td></tr>';
        });
        $("#orderItems").find('tbody').html(rows);
        $("#orderDetailsTitle").text('Order #' + orderId + ' - ' + customer);
        $("#orderDetailsModal").modal('show');
    }).fail(function () {
        showToast('Could not load order details', 'error');
    });
});
