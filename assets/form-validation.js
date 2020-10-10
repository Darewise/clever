// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  window.addEventListener('load', function () {

    $('#generator').on("click", function (e) {
      //e.preventDefault();
      var container = $('#preview');
      container.select();
      document.execCommand("copy");

      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');

      // Loop over them and prevent submission
      Array.prototype.filter.call(forms, function (form) {
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      });
    });

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    /*var forms = document.getElementsByClassName('needs-validation')

    // Loop over them and prevent submission
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })*/
  }, false)
}())

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  // to avoid breaking orgain page when copying more words
  // cant copy when adding below this code
  // dummy.style.display = 'none'
  document.body.appendChild(dummy);
  //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
  return false;
}

function togglePublicDescription() {
  if ($('#visibility').val().toLowerCase() === "public") {
    $('#public-description-group').show();
  } else {
    $('#public-description-group').hide();
  }
}

function updateResult() {
  var text = $('#type').val() + ' ';

  var jiraId = $('#jira').val();
  if (jiraId) {
    text += jiraId + ' ';
  }

  var visibility = $('#visibility').val();
  var isPublic = visibility.toLowerCase() === "public";

  if (isPublic) {
    text += '!P';
  } else if (visibility.toLowerCase() === "private") {
    text += '!X';
  }

  var category = $('#category').val();
  if (category) {
    text += '[' + category + ']';
  }

  if (isPublic) {
    var publicDescription = $('#public-description').val();
    text += '[' + publicDescription + ']';
  }

  var privateDescription = $('#private-description').val();
  if (privateDescription) {
    text += ' ' + privateDescription;
  }

  var container = $('#preview');

  const regex = /([A-Z]{3}) (([A-Z]{3,5}-[0-9]+) )*(!P\[(.+?)\]\[.+\]|!X\[(.+?)\])/g;
  if (text.match(regex)) {
    container.val(text);
  } else {
    container.val("Invalid changelist");
  }
}