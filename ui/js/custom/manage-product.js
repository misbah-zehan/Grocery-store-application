var productModal = $("#productModal");
var selectedUnitId = '';   // NEW: unit to pre-select when editing (the unit list loads after the popup opens)

$(function () {

    //JSON data by API call
    $.get(productListApiUrl, function (response) {
        if (response) {
            var table = '';
            $.each(response, function (index, product) {
                table += '<tr data-id="' + product.product_id + '" data-name="' + escapeHtml(product.product_name) + '" data-unit="' + product.unit_id + '" data-price="' + product.price_per_unit + '">' +
                    '<td>' + escapeHtml(product.product_name) + '</td>' +
                    '<td>' + escapeHtml(product.unit_name) + '</td>' +
                    '<td>' + product.price_per_unit + '</td>' +
                    '<td><span class="btn btn-xs btn-primary edit-product">Edit</span> ' +
                    '<span class="btn btn-xs btn-danger delete-product">Delete</span></td></tr>';
            });
            $("table").find('tbody').empty().html(table);
        }
    });
});

// NEW: search box - hides rows whose name does not contain the typed text
$("#searchProduct").on("input", function () {
    var keyword = $.trim($(this).val()).toLowerCase();
    $("tbody tr").each(function () {
        var name = String($(this).data('name')).toLowerCase();
        $(this).toggle(name.indexOf(keyword) !== -1);
    });
});

// Save Product (adds a new one, or updates when the hidden #id is not 0)
$("#saveProduct").on("click", function () {
    var productId = $("#id").val();
    var name = $.trim($("#name").val());
    var unitId = $("#uoms").val();
    var price = parseFloat($("#price").val());

    // NEW: check the form before calling the API
    if (name === '') {
        showToast('Please enter the product name', 'error');
        return;
    }
    if (!unitId) {
        showToast('Please select a unit', 'error');
        return;
    }
    if (isNaN(price) || price <= 0) {
        showToast('Price must be a number greater than 0', 'error');
        return;
    }

    var requestPayload = {
        product_name: name,
        unit_id: unitId,
        price_per_unit: price
    };

    if (productId !== '0') {
        requestPayload.product_id = productId;
        callApi("POST", productUpdateApiUrl, {
            'data': JSON.stringify(requestPayload)
        }, 'Product updated');
    } else {
        callApi("POST", productSaveApiUrl, {
            'data': JSON.stringify(requestPayload)
        }, 'Product added');
    }
});

// NEW: Edit button - fill the popup with this row's values and open it
$(document).on("click", ".edit-product", function () {
    var tr = $(this).closest('tr');
    $("#id").val(tr.data('id'));
    $("#name").val(tr.data('name'));
    $("#price").val(tr.data('price'));
    selectedUnitId = tr.data('unit');
    productModal.find('.modal-title').text('Edit Product');
    productModal.modal('show');
});

$(document).on("click", ".delete-product", function () {
    var tr = $(this).closest('tr');
    var data = {
        product_id: tr.data('id')
    };
    var isDelete = confirm("Are you sure to delete " + tr.data('name') + " item?");
    if (isDelete) {
        callApi("POST", productDeleteApiUrl, data, 'Product deleted');
    }
});

productModal.on('hide.bs.modal', function () {
    $("#id").val('0');
    $("#name, #uoms, #price").val('');
    selectedUnitId = '';
    productModal.find('.modal-title').text('Add New Product');
});

productModal.on('show.bs.modal', function () {
    //JSON data by API call
    $.get(uomListApiUrl, function (response) {
        if (response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function (index, unit_table) {
                options += '<option value="' + unit_table.unit_id + '">' + unit_table.unit_name + '</option>';
            });
            $("#uoms").empty().html(options);
            $("#uoms").val(selectedUnitId);   // NEW: pre-select the unit when editing
        }
    });
});
