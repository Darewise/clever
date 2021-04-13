(function () {
  'use strict'

  initClever();

  $('#cl-generator-button').on("click", function (e) {
    //e.preventDefault();

    if (checkRegex()) {
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