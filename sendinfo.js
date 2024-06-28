// BY Underemployed 28-06-2024
// REQUIRED
const APPSCRIPT_URL = "https://script.google.com/macros/s/AKfycbzCJLjHR3wFwSRT6FT_xnzNqZja3q_M6f7GD6kmhXPAfb7bc7wKhzXPPprppyNufQ/exec";


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
            // console.log(response);
            alert("Successfully Registered");
        },
        error: function (err) {
            // console.log(err);
            // alert(err.message);
            alert("Error in Submitting Form")
        }
    })
})
