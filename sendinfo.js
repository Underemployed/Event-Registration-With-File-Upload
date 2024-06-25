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
        url: 'https://script.google.com/macros/s/AKfycbxu6RgeQ7eeLa6SaeNOuv-QXy75-nzWrMi-ieUDadIiW7HoDxG-mTKh9Mm2k5lM_xYM/exec',
        data: JSON.stringify(data), // convert data to JSON
        method: "POST",
        success: function (response) {
            //       console.log(response);
            alert("Successfully Registered");
        },
        error: function (err) {
            // console.log(err);
            // alert(err.message);
            alert("Error in Submitting Form")
        }
    })
})
