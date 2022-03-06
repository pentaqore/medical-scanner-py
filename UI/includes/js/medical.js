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
                    { data: 'rate' },
                    { data: 'available_qunatity' },
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
                $('#delete-med-confirmation').modal('toggle');
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

            /**
             * Edit button Event
             */
            $('#btn-edit').click(function () {
                $('#newMedicine').modal('toggle');
                populateData(selected[0]);
            });
        },
        error: function (result) {
            console.log(result);
        }
    });
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
