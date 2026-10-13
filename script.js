var form = document.getElementById("regForm");
var message = document.getElementById("message");
var openDashboard = document.getElementById("openDashboard");
var dashboard = document.getElementById("dashboardSection");
var backToForm = document.getElementById("backToForm");
var studentRows = document.getElementById("studentRows");
var total = document.getElementById("total");
var registered = document.getElementById("registered");
var clearBtn = document.getElementById("clearBtn");

function getStudents() {
    var savedData = localStorage.getItem("aitStudents");

    if (savedData == null) {
        return [];
    }

    return JSON.parse(savedData);
}

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}

form.onsubmit = function (event) {
    event.preventDefault();

    var name = document.getElementById("fullName").value.trim();
    var email = document.getElementById("email").value.trim().toLowerCase();
    var phone = document.getElementById("phone").value.trim();
    var course = document.getElementById("course").value;
    var gender = document.getElementById("gender").value;
    var dob = document.getElementById("dob").value;
    var address = document.getElementById("address").value.trim();
    var city = document.getElementById("city").value;
    var terms = document.getElementById("terms").checked;

    if (name == "" || email == "" || phone == "" || course == "" || gender == "" || dob == "" || city == "") {
        showMessage("Please fill in all required fields.", "red");
        return;
    }

    if (name.length < 3) {
        showMessage("Name must have at least 3 characters.", "red");
        return;
    }

    if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
        showMessage("Please enter a valid email address.", "red");
        return;
    }

    if (phone.length < 10) {
        showMessage("Please enter a valid phone number.", "red");
        return;
    }

    if (new Date(dob) >= new Date()) {
        showMessage("Date of birth must be in the past.", "red");
        return;
    }

    if (address != "" && address.length < 5) {
        showMessage("Please enter a complete address.", "red");
        return;
    }

    if (terms == false) {
        showMessage("Please accept the registration terms.", "red");
        return;
    }

    var students = getStudents();

    for (var i = 0; i < students.length; i++) {
        if (students[i].email == email) {
            showMessage("This email is already registered.", "red");
            return;
        }
    }

    var student = {
        id: "AKH-" + (students.length + 1) + "-" + new Date().getTime(),
        name: name,
        email: email,
        phone: phone,
        course: course,
        gender: gender,
        dob: dob,
        address: address,
        city: city
    };

    students.push(student);
    localStorage.setItem("aitStudents", JSON.stringify(students));

    showMessage("Student registered successfully!", "green");
    form.reset();
};

function showDashboard() {
    var students = getStudents();
    studentRows.innerHTML = "";

    total.textContent = students.length;
    registered.textContent = students.length;

    if (students.length == 0) {
        var emptyRow = document.createElement("tr");
        var emptyCell = document.createElement("td");
        emptyCell.colSpan = 11;
        emptyCell.textContent = "No students registered yet.";
        emptyRow.appendChild(emptyCell);
        studentRows.appendChild(emptyRow);
        return;
    }

    for (var i = 0; i < students.length; i++) {
        var student = students[i];
        var row = document.createElement("tr");
        var details = [i + 1, student.id, student.name, student.email, student.phone, student.course, student.gender, student.dob, student.address || "-", student.city];

        for (var j = 0; j < details.length; j++) {
            var cell = document.createElement("td");
            cell.textContent = details[j];
            row.appendChild(cell);
        }

        var actionCell = document.createElement("td");
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";

        deleteButton.setAttribute("data-id", student.id);

        deleteButton.onclick = function () {
            var answer = confirm("Do you want to delete this student?");

            if (answer == true) {
                var latestStudents = getStudents();
                var idToDelete = this.getAttribute("data-id");
                var remainingStudents = [];

                for (var k = 0; k < latestStudents.length; k++) {
                    if (latestStudents[k].id != idToDelete) {
                        remainingStudents.push(latestStudents[k]);
                    }
                }

                localStorage.setItem("aitStudents", JSON.stringify(remainingStudents));
                showDashboard();
            }
        };

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        studentRows.appendChild(row);
    }
}

openDashboard.onclick = function () {
    form.hidden = true;
    openDashboard.hidden = true;
    dashboard.hidden = false;
    showDashboard();
};

backToForm.onclick = function () {
    dashboard.hidden = true;
    form.hidden = false;
    openDashboard.hidden = false;
};

clearBtn.onclick = function () {
    var students = getStudents();

    if (students.length == 0) {
        alert("There are no student records to clear.");
        return;
    }

    if (confirm("Do you want to delete all students?")) {
        localStorage.removeItem("aitStudents");
        showDashboard();
    }
};