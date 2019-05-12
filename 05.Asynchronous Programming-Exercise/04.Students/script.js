function students() {
    let baseUrl = "https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students";
    let username = "guest";
    let password = "guest";
    let base64Auth = btoa(username + ":" + password);
    const authHeaders = {
        Authorization: "Basic " + base64Auth,
        "Content-Type": "application/json"
    };

    loadStudents();

    function loadStudents() {
        let request = {
            url: baseUrl,
            method: "GET",
            headers: authHeaders
        };

        $.ajax(request)
            .then(displayStudents)
            .catch(handleError);
    }

    function displayStudents(students) {
        // $('#results').find('tr').nextAll().empty();
        $('#results').find('tr').nextAll().remove();
        students = students.sort((a, b) => a.ID - b.ID);
        for (let student of students) {
            $("#results")
                .append($('<tr>')
                    .append($('<td>').text(student.ID))
                    .append($('<td>').text(student.FirstName))
                    .append($('<td>').text(student.LastName))
                    .append($('<td>').text(student.FacultyNumber))
                    .append($('<td>').text(student.Grade))
                );
        }
    }

    $('#addStudent').click(function (ev) {
        ev.preventDefault();
        let ID = Number($('#ID').val());
        let FirstName = $('#FirstName').val();
        let LastName = $('#LastName').val();
        let FacultyNumber = $('#FacultyNumber').val();
        let Grade = Number($('#Grade').val());


        if (FirstName.trim() != "" && LastName.trim() != "") {
            let request = {
                url: baseUrl,
                method: "POST",
                headers: authHeaders,
                data: JSON.stringify({
                    ID: ID,
                    FirstName: FirstName,
                    LastName: LastName,
                    FacultyNumber: FacultyNumber,
                    Grade: Grade
                })
            };

            $.ajax(request)
                .then(loadStudents);
        }
    });

    function handleError(){
        console.log('Error')
    }
}