$(document).ready(function () {
    $('#myTable').DataTable();

});



/**
 * Perform Crud operations
 */
$(document).ready(function () {
    // var table = $('#dashboardTable').DataTable();

    // $('#dashboardTable tbody').on('click', 'tr', function () {
    //     if ($(this).hasClass('selected')) {
    //         $(this).removeClass('selected');
    //     }
    //     else {
    //         table.$('tr.selected').removeClass('selected');
    //         $(this).addClass('selected');
    //     }
    // });

    // $('#btn-delete').click(function () {
    //     // table.row('.selected').remove().draw(false);
    //     console.log("INSIDE DELETE ROW", table.row('.selected').data)
    // });
});




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
            // data = [];
            // data[0] = result;
            console.log(result);

            $('#dashboardTable').DataTable({
                "data": result,
                "destroy": true,
                "paging": true,
                "ordering": true,
                "info": true,
                "rowCallback": function (row, data) {
                    if ($.inArray(data.DT_RowId, selected) !== -1) {
                        $(row).addClass('selected');
                    }
                },
                columns: [

                    { data: 'id' },
                    { data: 'name' },
                    { data: 'rate' },
                    { data: 'available_qunatity' },
                    { data: 'content' },
                    { data: 'type' }

                ],

            });



            $('#dashboardTable tbody').on('click', 'tr', function () {


                var data = {
                    id: $(this).children("td:nth-child(1)").text(),
                    name: $(this).children("td:nth-child(2)").text(),
                    rate: $(this).children("td:nth-child(3)").text(),
                    available_qunatity: $(this).children("td:nth-child(4)").text(),
                    content: $(this).children("td:nth-child(5)").text(),
                    type: $(this).children("td:nth-child(6)").text()
                }

                if (!$(this).hasClass('selected')) {
                    console.log("INSIDE DELETE ROW", $(this).hasClass('selected'))
                    selected.push(data);
                } else {
                    for (let element of selected) {
                        if (element.id == data.id) {
                            selected.splice($.inArray(element, selected), 1);
                        }
                    }
                }
                $(this).toggleClass('selected');
            });

            $('#btn-delete').click(function () {
                deleteMedicine(selected);
            });

            $('#btn-edit').click(function () {
                // updateMedicine(selected);
            });
        },
        error: function (result) {
            console.log(result);
        }
    });
}
function deleteMedicine(selectedRecords) {

    var medicine = selectedRecords[0];

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

                //save jwt token to local storage
                location.href = 'index.html';
            } else if (data.status == 404) {
                $('.nameError').html(data.message);
            } else {
                if (data.status == 201) {
                    location.href = 'index.html';
                }
            }
        }
    });


}
function updateMedicine(selectedRecords) {
    console.log("INSIDE DELETE ROW", selectedRecords)
    var medicine = selectedRecords[0].id;

    $.ajax({
        url: "http://localhost:8000/item",
        type: 'DELETE',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(medicine),
        success: function (data) {
            console.log(data);
            console.log("INSIDE DELETE MEDICINE ");
            if (data.status == 200) {

                //save jwt token to local storage
                // location.href = 'index.html';
            } else if (data.status == 404) {
                $('.nameError').html(data.message);
            } else {
                if (data.status == 201) {
                    // location.href = 'index.html';
                }
            }
        }
    });


}
