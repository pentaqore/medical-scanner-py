$(document).ready(function () {
    $('#myTable').DataTable();

});


/**
 * Fetch all the records from server and populate it into DataTable
 */
function fetchFranchiseTableData() {

    var isLogin = localStorage.getItem('isLogin');
    var selected = [];
    $.ajax({
        url: 'http://localhost:8000/items',
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: {},
        success: function (result) {
            for (let i = 0; i < result.length; i++) {
                switch (result[i].type) {
                    case 'c': result[i].type = 'Capsule';
                        break;
                    case 't': result[i].type = 'Tablet';
                        break;
                    case 's': result[i].type = 'Syrup';
                        break;
                    case 'i': result[i].type = 'Injectible';
                        break;
                    default:
                        break;
                }

            }


            $('#dashboardTable').DataTable({
                "data": result,
                "destroy": true,
                "paging": true,
                "ordering": true,
                "info": true,
                columns: [
                    { data: 'id' },
                    { data: 'name' },
                    { data: 'available_qunatity' },
                    { data: 'rate' },
                    { data: 'content' },
                    { data: 'type' }
                ],
            });

            var table = $('#dashboardTable').DataTable();

            /**
             * helps to took selected records
             */
            $('#dashboardTable tbody').on('click', 'tr', function () {

                var data = {
                    id: $(this).children("td:nth-child(1)").text(),
                    name: $(this).children("td:nth-child(2)").text(),
                    rate: $(this).children("td:nth-child(3)").text(),
                    available_qunatity: $(this).children("td:nth-child(4)").text(),
                    content: $(this).children("td:nth-child(5)").text(),
                    type: $(this).children("td:nth-child(6)").text()
                }

                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    for (let element of selected) {
                        if (element.id == data.id) {
                            selected.splice($.inArray(element, selected), 1);
                        }
                    }
                }
                else {
                    selected = [];
                    table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    selected.push(data);
                }
            });


            /**
             * Delete button Event
             */
            $('#btn-delete').click(function () {

                if (!table.$('tr.selected').hasClass('selected')) {
                    $('#message-modal').modal('toggle');
                    $('#message').html("Please select a product row for this operation !");
                    $('#btn-ok').click(function () {
                        location.href = 'index.html';
                    });
                } else {
                    $('#delete-med-confirmation').modal('toggle');
                }


            });

            /**
             * Delete confirmation button Event
             */
            $('#btn-delete-confirm').click(function () {
                deleteMedicine(selected[0]);
            });

            $('#btn-cancel').click(function () {
                location.href = 'index.html';
            });
            $('#btn-bill-cancel').click(function () {
                location.href = 'billing.html';
            });
            /**
             * Edit button Event
             */
            $('#btn-edit').click(function () {
                if (!table.$('tr.selected').hasClass('selected')) {
                    $('#message-modal').modal('toggle');
                    $('#message').html("Please select a product row for this operation !");
                    $('#btn-ok').click(function () {
                        location.href = 'index.html';
                    });
                } else {
                    $('#newMedicine').modal('toggle');
                    populateData(selected[0]);
                }
            });
        },
        error: function (result) {
            console.log(result);
        }
    });
}

/**
 * Fetch all the records from server and populate it into  bill DataTable
 */
function fetchBillTableData() {

    var isLogin = localStorage.getItem('isLogin');
    var selected = [];

    //TODO: Need to validate flow

    $.ajax({
        url: 'http://localhost:8000/bills',
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: {},
        success: function (result) {

            console.log("RESULT", result);
            console.log(result);
            $('#billTable').DataTable({
                "data": result,
                "destroy": true,
                "paging": true,
                "ordering": true,
                "info": true,
                columns: [
                    { data: 'id' },
                    { data: 'name' },
                    { data: 'mobile_no' },
                    { data: 'medicine' },
                    { data: 'qunatity' },
                    { data: 'rate' },
                    { data: 'date' }
                ],
            });

            var table = $('#billTable').DataTable();

            /**
             * helps to took selected records
             */
            $('#billTable tbody').on('click', 'tr', function () {
                var data = {
                    id: $(this).children("td:nth-child(1)").text(),
                    name: $(this).children("td:nth-child(2)").text(),
                    mob_no: $(this).children("td:nth-child(3)").text(),
                    medicine: $(this).children("td:nth-child(4)").text(),
                    quantity: $(this).children("td:nth-child(5)").text(),
                    rate: $(this).children("td:nth-child(6)").text(),
                    date: $(this).children("td:nth-child(7)").text()
                }

                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    for (let element of selected) {
                        if (element.id == data.id) {
                            selected.splice($.inArray(element, selected), 1);
                        }
                    }
                }
                else {
                    // selected = [];
                    // table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    selected.push(data);
                }

                console.log(selected);
            });


            /**
             * Print button Event
             */
            $('#btn-print').click(function () {

                let total = 0;
                let subTotal = 0;
                srNumber = 0

                if (selected.length != 0) {
                    $('#bill-generation').modal('toggle');
                    $('#invo-id').text(selected[0].id);
                    $('#bill-cust-name').text(selected[0].name);
                    $('#mob-number').text(selected[0].mob_no);
                    $('#date').text(selected[0].date);
                } else {
                    $('#message-modal').modal('toggle');
                    $('#message').html("Please select a product row for this operation !");
                    $('#btn-ok').click(function () {
                        location.href = 'billing.html';
                    });
                }

                resultPrintTable = []



                for (let result of selected) {
                    srNumber = srNumber + 1;
                    subTotal = parseInt(result.quantity) * parseFloat(result.rate);
                    resultPrintTable.push({ sr_no: srNumber, medicine: result.medicine, rate: result.rate, quantity: result.quantity, total: subTotal })
                    total = total + parseFloat(subTotal);
                }


                $('#total').text(total);
                console.log("result ", resultPrintTable)
                //populate data in table  here
                $('#billPrintTable').DataTable({
                    "data": resultPrintTable,
                    "destroy": false,
                    "paging": false,
                    "ordering": false,
                    "info": false,
                    searching: false,
                    "autoWidth": false,
                    columns: [
                        { data: 'sr_no' },
                        { data: 'medicine' },
                        { data: 'rate' },
                        { data: 'quantity' },
                        { data: 'total' }
                    ],
                });
                // $("#billPrintTable").css("width", "100%");
                var table = $('#billPrintTable').DataTable();
            });

            // /**
            //  * Delete confirmation button Event
            //  */
            // $('#btn-delete-confirm').click(function () {
            //     generateBill(selected[0]);
            // });

            // $('#btn-cancel').click(function () {
            //     location.href = 'index.html';
            // });
            $('#btn-bill-cancel').click(function () {
                location.href = 'billing.html';
            });

        },
        error: function (result) {
            console.log(result);
        }
    });
}
function generateBill() {
    // var medicine = $('#name').val();
    // var available_quantity = $('#available_quantity').val();
    // var content = $('#content').val();
    // var rate = $('#rate').val();
    // var type = $('#type').val();
    console.log("INSIDE GENERATE BILL")
    var medicine = "fff";
    var available_quantity = "sdg";
    var content = "sfdfs";
    var rate = "sdfs";
    var type = "sdfs";
    var jwtToken = localStorage.getItem('jwtToken');

    const element = document.getElementById("invoice");
    html2pdf().from(element).save();

    console.log();
}

/**
 *  Delete one record of medicine 
 * @param Array of selectedRecords 
 */
function deleteMedicine(medicine) {

    $.ajax({
        url: "http://localhost:8000/item",
        type: 'DELETE',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(
            { id: parseInt(medicine.id) }),
        success: function (data) {
            console.log(data);
            console.log("INSIDE DELETE MEDICINE ");
            if (data.status == 200) {
                $('#delete-med-confirmation').hide();
                $('#message-modal').modal('toggle');
                $('#message').html(data.msg);
                $('#btn-ok').click(function () {
                    location.href = 'index.html';
                });
            } else if (data.status == 404) {
                $('.nameError').html(data.message);
            } else {
                if (data.status == 201) {
                    $('#delete-med-confirmation').hide();
                    $('#message-modal').modal('toggle');
                    $('#message').html(data.msg);
                    $('#btn-ok').click(function () {
                        location.href = 'index.html';
                    });
                }
            }
        }
    });


}



/**
 * Populate the fields on medicine form
 * 
 * @param selectedRecord selectedRecord 
 */

function populateData(medicine) {


    switch (medicine.type) {
        case 'Capsule': medicine.type = 'c';
            break;
        case 'Tablet': medicine.type = 't';
            break;
        case 'Syrup': medicine.type = 's';
            break;
        case 'Injectible': medicine.type = 'i';
            break;
        default:
            break;
    }


    if (medicine) {
        $('#id').val(medicine.id);
        $('#name').val(medicine.name);
        $('#available_quantity').val(medicine.available_qunatity);
        $('#content').val(medicine.content);
        $('#rate').val(medicine.rate);
        $('#type').val(medicine.type);
    }
}
