function attachEvents() {

    $div = $(`<div>
        <h2>Create Student</h2>
        Id: <input type="number" id="idNum"/>
        <br>
        First Name: <input type="text" id="firstName"/>
        <br>
        Last Name: <input type="text" id="lastName"/>
        <br>
        FacultyNumber: <input type="text" id="facultyNumber"/>
        <br>
        Grade: <input type="number" id="grade"/>
        <br>
        </div>`);
    $btnS = $(`<button type="submit" id="btnSt" style="margin-top: 20px; background-color: darkcyan">Add students</button>`);
    $btnS.on('click', addStudents);
    $div.append($btnS);

    $btn = $(`<button type="submit" id="btn" style="margin-top: 20px; background-color: cornflowerblue">Extract students</button>`);
    $btn.on('click', extractStudents);
    $('body').append($btn);
    $('body').append($div);

    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'kid_S1NsDahuN';//'kid_BJXTsSi-e';
    const endpoint = 'students';
    const username = 'niki';//'guest';
    const password = '12345';//'guest';
    const headers = {
        'Authorization': `Basic ${btoa(username + ':' + password)}`,
        'Content-Type': `application/json`
    };

    async function addStudents() {
        let id = $('#idNum').val();
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let facultyNumber = $('#facultyNumber').val();
        let grade = $('#grade').val();

        let student = {
            ID: id,
            FirstName: firstName,
            LastName: lastName,
            FacultyNumber: facultyNumber,
            Grade: grade,
        };

        await  $.ajax({
            url: baseUrl + 'appdata/' + appKey + '/' + endpoint,
            headers,
            method: 'POST',
            data: JSON.stringify(student)
        });
    }

    async function extractStudents() {
        let students = await $.ajax({
            url: baseUrl + 'appdata/' + appKey + '/' + endpoint,
            headers,
            method: 'GET',

        });

        //$tb = $('#results > tbody > tr');
        $tb = $('<tbody></tbody>');
        $('#results').empty();
       // $('#results').append($tb);
        $tb.append($(`<tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Faculty Number</th>
        <th>Grade</th>
        </tr>`));

        //students = students.sort((a,b)=>a.ID - b.ID);

        for(let st of students.sort((a,b)=>a.ID - b.ID)) {
            $stu = $(`<tr>
                <td>${st.ID}</td>
                <td>${st.FirstName}</td>
                <td>${st.LastName}</td>
                <td>${st.FacultyNumber}</td>
                <td>${st.Grade}</td>
                </tr>`);

            $tb.append($stu);
        }
        $('#results').append($tb);
    }
}