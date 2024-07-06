// BY Underemployed 05-07-2024
// REQUIRED
const APPSCRIPT_URL = `

https://script.google.com/macros/s/AKfycbzeMsCOpiEcSqtJyPc30LH2IDV07w-QYWIWsYfLXlTUlcJ86SAq52Q_sMH1pl-6cSBj/exec

`.trim();
let eventsData = [];

const fileuploadGen = (label, yes) => {
    let fileupload = document.getElementById("fileupload");

    if (!yes) {
        fileupload.innerHTML = "";
        return;
    } else {

        fileupload.innerHTML =
        `<div class="row">
            <label for="image" class="upload">` + label + `</label>
            <input name="image" id="image" placeholder="Image or PDF" type="file" accept="image/*" required="" />
        </div>

        <input type="text" name="base64" id="glob" value="" hidden />
        <input type="text" name="type" id="filetype" value="" hidden />
        <input type="text" name="name" id="filename" value="" hidden />`;


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
    }

}

$("#event-registration-form").submit((e) => {
    e.preventDefault();

    $(".send-div").fadeIn(1000); // show loader

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

            $(".send-div").delay(1000).fadeOut();  // hide loader

            // console.log(response);
            alert("Successfully Registered");


        },
        error: function (err) {

            $(".send-div").delay(1000).fadeOut();  // hide loader

            // console.log(err);
            // alert(err.message);
            alert("Error in Submitting Form")
        }
    })
})

document.addEventListener('DOMContentLoaded', function () {
    fetchEvents();
});

function fetchEvents() {
    $(".loader-div").fadeIn(1000); // Show loader

    fetch(APPSCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            eventsData = data['Event Names'];
            updateEventDropdown(eventsData);
            $(".loader-div").delay(1000).fadeOut();
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            $(".loader-div").delay(1000).fadeOut();
        });
}

// add event names
function updateEventDropdown(eventsData) {
    const dropdown = document.getElementById('inputEvent');
    dropdown.length = 1;
    eventsData.forEach(event => {
        const option = new Option(event.name, event.name);
        dropdown.add(option);
    });
}


// load file upload based on excel data
document.getElementById('inputEvent').onchange = function () {
    $("update-div").fadeIn(1000);
    const selectedEventName = this.value;
    const selectedEvent = eventsData.find(event => event.name === selectedEventName);
    if (selectedEvent) {
        fileuploadGen(selectedEvent.label, selectedEvent.paid);
        $("update-div").delay(1000).fadeOut();
    }
};

