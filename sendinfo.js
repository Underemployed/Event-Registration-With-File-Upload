// BY Underemployed 05-07-2024
// REQUIRED
const APPSCRIPT_URL = "https://script.google.com/macros/s/AKfycbxN6mGfyRle3fyEl7Qdx9qSc4H2f2jZAAkhkG5O6OjlmawYShP6KPXjEuY5_LqPB5Gu/exec";

let fileInput = document.getElementById("image");
let filetype = document.getElementById("filetype");
let filename = document.getElementById("filename");
let fileglob = document.getElementById("glob");

fileInput.addEventListener("change", () => {
    let file = fileInput.files[0];

    let fr = new FileReader();
    fr.onload = (e) => {
        let res = e.target.result;
        let glob = res.split("base64,")[1];
        filetype.value = file.type;
        filename.value = file.name;
        fileglob.value = glob;
    };
    fr.readAsDataURL(file);
});

$("#event-registration-form").submit((e) => {
    e.preventDefault();

    $(".send-div").show(); // show loader

    var formData = $("#event-registration-form").serializeArray();
    var data = {};
    $(formData).each(function (index, obj) {
        data[obj.name] = obj.value;
    });
    $.ajax({
        url: APPSCRIPT_URL, // required
        data: JSON.stringify(data), // convert data to JSON
        method: "POST",
        success: function (response) {

            $(".send-div").hide(); // hide loader

            // console.log(response);
            alert("Successfully Registered");

            
        },
        error: function (err) {

            $(".send-div").hide(); // hide loader

            // console.log(err);
            // alert(err.message);
            alert("Error in Submitting Form")
        }
    })
})

document.addEventListener('DOMContentLoaded', function() {
    fetchEvents();
});

function fetchEvents() {
    $(".loader-div").show(); // Show loader

    fetch(APPSCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            const events = data['Event Names'];
            updateEventDropdown(events);
            $(".loader-div").hide(); 
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            $(".loader-div").hide(); 
        });
}

function updateEventDropdown(events) {
    const dropdown = document.getElementById('inputEvent');
    dropdown.length = 1;
    events.forEach(event => {
        const option = new Option(event, event); 
        dropdown.add(option);
    });
}