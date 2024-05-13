let students = [];
// Function to check if a student ID already exists
function isStudentIdUnique(studentId, currentIndex) {
    // Iterate over existing students
    for (let i = 0; i < students.length; i++) {
        // Skip the current student being edited
        if (i === currentIndex) {
            continue;
        }
        // Check if the student ID already exists
        if (students[i].id === studentId) {
            return false;
        }
    }
    return true;
}

// Function to check if a contact number has exactly 10 digits
function isValidContactNumber(contactNumber) {
    return /^\d{10}$/.test(contactNumber);
}

// Function to update recorded information table
function updateRecordedInfo() {
    const tableBody = document.querySelector("#recordedTable tbody");
    tableBody.innerHTML = ""; 
    
    if (students.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6'>No recorded information available.</td></tr>";
        return;
    }
    students.forEach((student, index) => {
        const row = `<tr>
                        <td>${student.name}</td>
                        <td>${student.id}</td>
                        <td>${student.class}</td>
                        <td>${student.contact}</td>
                        <td>${student.email}</td>
                        <td>
                            <button onclick="editFromRecordedData(${index})">Edit</button>
                            <button onclick="deleteStudent(${index})">Delete</button>
                        </td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}

// Function to add a new student
function addStudent(studentData) {
    // Check if student ID is unique
    if (!isStudentIdUnique(studentData.id, -1)) {
        showMessage("Student ID must be unique.");
        return;
    }
    
    // Check if contact number has 10 digits
    if (!isValidContactNumber(studentData.contact)) {
        showMessage("Contact number must have exactly 10 digits.");
        return;
    }
    
    students.push(studentData); // Add new student to array
    updateRecordedInfo(); // Update recorded information table
}

// Function to update an existing student
function updateStudent(index, formData) {
    const studentId = formData.get("student_id");
    const contactNumber = formData.get("contact_number");
    
    // Check if student ID is unique
    if (!isStudentIdUnique(studentId, index)) {
        showMessage("Student ID must be unique.");
        return;
    }
    
    // Check if contact number has 10 digits
    if (!isValidContactNumber(contactNumber)) {
        showMessage("Contact number must have exactly 10 digits.");
        return;
    }
    
    students[index] = {
        name: formData.get("student_name"),
        id: studentId,
        class: formData.get("class"),
        contact: contactNumber,
        email: formData.get("email")
    };
    updateRecordedInfo(); // Update recorded information table
}

// Function to delete a student
function deleteStudent(index) {
    students.splice(index, 1); // Remove student from array
    updateRecordedInfo(); // Update recorded information table
}

// Event listener for form submission
document.getElementById("studentForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    const formData = new FormData(event.target); // Get form data
    const studentIndex = formData.get("student_index"); // Check if editing existing student
    const studentId = formData.get("student_id"); // Get entered student ID
    const contactNumber = formData.get("contact_number"); // Get entered contact number

    // Check if student ID already exists
    if (!isStudentIdUnique(studentId, studentIndex === "" ? -1 : parseInt(studentIndex))) {
        showMessage("Student ID must be unique.");
        return;
    }

    // Check if contact number has 10 digits
    if (!isValidContactNumber(contactNumber)) {
        showMessage("Contact number must have exactly 10 digits.");
        return;
    }

    if (studentIndex !== "") {
        updateStudent(parseInt(studentIndex), formData); 
    } else {
        addStudent({
            name: formData.get("student_name"),
            id: studentId,
            class: formData.get("class"),
            contact: contactNumber,
            email: formData.get("email")
        }); 
    }

    event.target.reset();
});

// Function  for editing
function editFromRecordedData(index) {
    const student = students[index];
    const tableRow = document.querySelector(`#recordedTable tbody tr:nth-child(${index + 1})`);
    const tableCells = tableRow.querySelectorAll('td');

    tableCells[0].innerHTML = `<input type="text" value="${student.name}" id="edit_student_name">`;
    tableCells[1].innerHTML = `<input type="text" value="${student.id}" id="edit_student_id">`;
    tableCells[2].innerHTML = `<input type="text" value="${student.class}" id="edit_class">`;
    tableCells[3].innerHTML = `<input type="text" value="${student.contact}" id="edit_contact_number">`;
    tableCells[4].innerHTML = `<input type="email" value="${student.email}" id="edit_email">`;

    tableCells[5].innerHTML = `<button onclick="saveEditedData(${index})">Save</button>`;
}
document.getElementById("email").addEventListener("input", function(event) {
    const email = event.target.value;
    if (!email.endsWith(".com")) {
        event.target.setCustomValidity("Email address must end with '.com'");
    } else {
        event.target.setCustomValidity("");
    }
});

function saveEditedData(index) {
    const tableRow = document.querySelector(`#recordedTable tbody tr:nth-child(${index + 1})`);
    const inputFields = tableRow.querySelectorAll('input');

    students[index] = {
        name: inputFields[0].value,
        id: inputFields[1].value,
        class: inputFields[2].value,
        contact: inputFields[3].value,
        email: inputFields[4].value
    };

    updateRecordedInfo();
    showMessage("Data saved successfully"); 
}

function showMessage(message) {
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.textContent = message;
    setTimeout(function() {
        messageContainer.textContent = "";
    }, 3000);
}

updateRecordedInfo();
