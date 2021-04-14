(function () {
  'use strict'

  initClever();

  $('#cl-generator-button').on("click", function (e) {
    //e.preventDefault();

    const regex = /([A-Z]{3}) (([A-Z]{3,5}-[0-9]+) )*(!P\[(.+?)\]\[.+\]|!X\[(.+?)\])/g;
    if ($('#cl-preview-field').val().match(regex)) {
      navigator.clipboard.writeText($('#cl-preview-field').val());
    }

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      });
  });
})()