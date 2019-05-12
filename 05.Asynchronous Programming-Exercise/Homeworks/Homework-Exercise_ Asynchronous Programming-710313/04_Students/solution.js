async function solve() {

    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'kid_BJXTsSi-e';
    const endPoint = 'students';
    const username = 'guest';
    const password = 'guest';
    const headers = {
        'Authorization': `Basic ${btoa(username + ':' + password)}`,
        'Content-Type': 'application/json',
    };

    let $addBtn = $('#addStudent');
    $addBtn.on('click', addStudent);

    loadStudents();

    async function loadStudents() {

        try{
            let students = await $.ajax({
                url: baseUrl + 'appdata/' + appKey + '/' + endPoint,
                method: 'GET',
                headers
            });

            displayStudents(students);
        }catch(err){
            console.log(err);
        }

    }

    function displayStudents(students){
        console.log(students);
        let $table = $('#results')

        for (let student of students.sort((a,b) => a.ID - b.ID)) {
            let $tr = $(`<tr id="${student._id}"></tr>`);

            $(`<td>${student.ID}</td>`).appendTo($tr);
            $(`<td>${student.FirstName}</td>`).appendTo($tr);
            $(`<td>${student.LastName}</td>`).appendTo($tr);
            $(`<td>${student.FacultyNumber}</td>`).appendTo($tr);
            $(`<td>${student.Grade}</td>`).appendTo($tr);

            $table.append($tr);
        }

    }

    async function addStudent(e) {
        e.preventDefault();
        let ID = +$('#ID').val();
        let FirstName = $('#FirstName').val();
        let LastName = $('#LastName').val();
        let FacultyNumber = $('#FacultyNumber').val();
        let Grade = +$('#Grade').val();

        let studentObj = {
            ID,
            FirstName,
            LastName,
            FacultyNumber,
            Grade
        }

        try {
            await $.ajax({
                url: baseUrl + 'appdata/' + appKey + '/' + endPoint,
                method: 'POST',
                headers,
                data: JSON.stringify(studentObj)
            });

            await loadStudents();

           $('#ID').val('');
           $('#FirstName').val('');
           $('#LastName').val('');
           $('#FacultyNumber').val('');
           $('#Grade').val('');
        } catch (err) {
            console.log(err);
        }

    }
}