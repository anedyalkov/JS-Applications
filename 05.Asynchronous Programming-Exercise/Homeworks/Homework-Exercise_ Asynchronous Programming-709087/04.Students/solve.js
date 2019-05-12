function attachEvents() {

    const url = 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students';
    const kinveyUsername = "guest";
    const kinveyPassword = "guest";
    const base64auth = btoa(`${kinveyUsername}:${kinveyPassword}`);
    const authHeaders = {"Authorization": "Basic " + base64auth, "Content-type": "application/json"};

    const $table = $('#results');
    let $tbody = $('#body');

    $('#load').on('click', getStudents);
    $('#create').on('click', createNewStudent);

    async function getStudents(){

        $tbody.empty();
        try{
            let students = await $.ajax({
                method:'GET',
                url,
                headers: authHeaders
            });

            printStudents(students);

        }catch (e) {
            console.error(e.message);
        }
    }

    function printStudents(students) {



        students.sort((a,b) => (a.ID > b.ID) ? 1 : ((b.ID > a.ID) ? -1 : 0));

        for (const student of students) {

            let $tr = $('<tr></tr>');

            $tr.append(`<td>${student.ID}</td>`);
            $tr.append(`<td>${student.FirstName}</td>`);
            $tr.append(`<td>${student.LastName}</td>`);
            $tr.append(`<td>${student.FacultyNumber}</td>`);
            $tr.append(`<td>${student.Grade}</td>`);

            $tbody.append($tr);
        }

        $table.append($tbody);
    }

    async function createNewStudent() {

        let $firstName = $('#firstName');
        let $lastName = $('#lastName');
        let $number = $('#number');
        let $grade = $('#grade');
        let $id = $('#id');

        let newStudent = {
            'ID':Number($id.val()),
            'FirstName':$firstName.val(),
            'LastName':$lastName.val(),
            'FacultyNumber':$number.val(),
            'Grade':Number($grade.val())
        };

        try {
            await $.ajax({
                method:'POST',
                url,
                headers:authHeaders,
                data:JSON.stringify(newStudent)
            });

        }catch (e) {
            console.error(e.message)
        }


        $firstName.val('');
        $lastName.val('');
        $number.val('');
        $grade.val('');
        $id.val('');

        await getStudents();
    }
}