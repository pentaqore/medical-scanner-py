$(document).ready(function () {
    $('#myTable').DataTable();

});

function fetchFranchiseTableData() {

    var isLogin = localStorage.getItem('isLogin');

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
                columns: [
                    { data: 'id' },
                    { data: 'name' },
                    { data: 'rate' },
                    { data: 'available_qunatity' },
                    { data: 'content' },
                    { data: 'type' }
                ]
            });
            // $("#dashboardTable tbody").append();
        },
        error: function (result) {
            console.log(result);
        }
    });
}