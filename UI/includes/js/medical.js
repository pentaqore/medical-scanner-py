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
            console.log(result);
            for (let i = 0; i < result.length; i++) {
                result[i].srNo = i + 1;
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
            console.log(result);

            $('#dashboardTable').DataTable({
                "data": result,
                "destroy": true,
                "paging": true,
                "ordering": true,
                "info": true,
                columns: [
                    { data: 'srNo' },
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
                    id: $(this).children("td:nth-child(2)").text(),
                    name: $(this).children("td:nth-child(3)").text(),
                    available_qunatity: $(this).children("td:nth-child(4)").text(),
                    rate: $(this).children("td:nth-child(5)").text(),

                    content: $(this).children("td:nth-child(6)").text(),
                    type: $(this).children("td:nth-child(7)").text()
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
        url: 'http://localhost:8000/transactions',
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
                    date: $(this).children("td:nth-child(4)").text()
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
                    var transactionId = selected[0].id;
                    console.log(transactionId);
                    let url = "http://localhost:8000/bills?tansact_id=" + transactionId;

                    console.log(selected[0]);
                    //Bills Print Api
                    $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(
                        ),
                        success: function (result) {
                            console.log("result ", result)
                            resultPrintTable = [];
                            // var billDate = new Date(selected[0].date);
                            if (selected.length != 0) {
                                $('#bill-generation').modal('toggle');
                                $('#invo-id').text(selected[0].id);
                                $('#bill-cust-name').text(selected[0].name);
                                $('#mob-number').text(selected[0].mob_no);
                                // $('#date').text(billDate.toDateString());
                                $('#date').text(selected[0].date);
                            }

                            if (result.length != 0) {

                                for (let res of result) {
                                    srNumber = srNumber + 1;
                                    subTotal = parseInt(res.qunatity) * parseFloat(res.rate);
                                    resultPrintTable.push({ sr_no: srNumber, medicine: res.medicine, rate: res.rate, quantity: res.qunatity, total: subTotal })
                                    total = total + parseFloat(subTotal);
                                }
                                $('#total').text(total);

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
                            } else {
                                console.log("INSIDE TABLE FRESH");
                                table.ajax.reload();
                                // $('#billPrintTable').text("No data available");
                            }
                        }
                    });
                } else {
                    $('#message-modal').modal('toggle');
                    $('#message').html("Please select a transaction row for this operation !");
                    $('#btn-ok').click(function () {
                        location.href = 'billing.html';
                    });
                }
            });


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
    html2pdf().from(element).save("Print.pdf");
    console.log();
}

/**
 *  Delete one record of medicine 
 * @param Array of selectedRecords 
 */
function deleteMedicine(medicine) {
    console.log("=======", medicine)
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
    console.log(medicine)

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

    console.log(medicine.type);

    if (medicine) {
        $('#id').val(medicine.id);
        $('#name').val(medicine.name);
        $('#available_quantity').val(medicine.available_qunatity);
        $('#content').val(medicine.content);
        $('#rate').val(medicine.rate);
        $('#type').val(medicine.type);
    }
}
