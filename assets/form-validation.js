// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  window.addEventListener('load', function () {
    pickEasterEgg();

    $('#generator').on("click", function (e) {
      //e.preventDefault();

      if (checkRegex()) {
        var container = $('#preview');
        container.select();
        document.execCommand("copy");
      }

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
  // This is not supported by Firefox!
  /* if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    navigator.clipboard.writeText(text);
  } else {
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
  } */

  navigator.clipboard.writeText(text);
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
  var clType = $('#type').val();
  var text = clType.substring(0, 3).toUpperCase() + ' ';
  console.log(clType.substring(0, 3).toUpperCase());

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

  $('#preview').val(text);
}

function checkRegex() {
  const regex = /([A-Z]{3}) (([A-Z]{3,5}-[0-9]+) )*(!P\[(.+?)\]\[.+\]|!X\[(.+?)\])/g;

  /*if (!$('#preview').val().match(regex)) {
    $('#preview').val("Invalid changelist");
  }*/

  return $('#preview').val().match(regex);
}

function pickEasterEgg() {
  const quotes = [
    'Game dev... game dev never changes.',
    'The Build is a lie.',
    'Be wise. Be safe. Be aware.',
    'Don\'t make your PM a promise if you know you can\'t keep it.',
    'A journey of a thousand miles begins with a single step. So just take it step by step.',
    'No matter how red the build, the green always comes.',
    'If all else fails, use fire.',
    'Remember to use nutrients to replenish your health.',
    'I\'m Commander Shepard, and this is my favorite changelist on the Citadel!',
    'It\'s time to fix the build and chew bubble gum... and I\'m all outta gum.',
    'Would you kindly not break the build?',
    'Praise the sun! \\o/',
    'Hey! Look! Listen!',
    'Do a barrel roll!',
    'Build? Build? BUUIIIIILD!',
    'Thank you, Mario! But our fix is in another changelist!',
    'You have died of dysentery.',
    'I never asked for this.',
    'Are you a bad enough dude to fix the build?',
    'You\'ve met with a terrible fate, haven’t you?',
    'Did I ever tell you the definition of insanity?',
    'Waka-waka-waka',
    'You require more vespene gas.',
    '*Fixes the build 3 days later* Kept you waiting, huh?',
    'Go ahead, make my day.',
    'Mein Führer! I can walk!',
    'A crash a day keeps the release away.',
    'May the Force be with you.',
    'You talking to me?',
    'I love the smell of broken builds in the morning.',
    'We\'re gonna need a bigger server.',
    'Mama always said gamedev bugs were like a box of chocolates. You never know what you\'re gonna get.',
    'I see broken builds.',
    'You\'ve got to ask yourself one question: \"Do I feel lucky?\". Well, do ya, punk?',
    'Keep your teammates close, but your PMs closer.',
    'Say "hello" to my little friend! *breaks the build*',
    'Gentlemen, you can\'t fight in here! This is the War Room!',
    'Get your stinking changelist off me, you damned dirty ape.',
    'Carpe diem. Seize the day. Make your lives extraordinary.',
    'Nobody puts the Build in a corner.',
    'If you\'re reading this, you\'ve been in a coma for almost 20 years now.<br>We\'re trying a new technique. We don\'t know where this message will end up in your dream, but we hope it works.<br>Please wake up, we miss you.'
  ];

  const random = Math.floor(Math.random() * quotes.length);
  $('#easter-egg').append('<p> « ' + quotes[random] + ' »</p>');
}