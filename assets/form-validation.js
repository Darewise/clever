// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  window.addEventListener('load', function () {
    pickEasterEgg();
    presetDropdownFields();
    togglePublicMode();

    // Calling this here will allow us to prefill
    // the JIRA field at page load (if possible).
    handlePasteOnJira();

    $('#generator').on("click", function (e) {
      //e.preventDefault();

      if (checkRegex()) {
        navigator.clipboard.writeText($('#preview').val());
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
  }, false)
}())

function presetDropdownFields() {
  var typeFieldCookie = getCookie('type');
  if (typeFieldCookie) {
    $('#type').val(typeFieldCookie);
  }

  var categoryFieldCookie = getCookie('category');
  if (categoryFieldCookie) {
    $('#category').val(categoryFieldCookie);
  }

  $('#type').trigger('change');
  $('#category').trigger('change');
}

function setCookie(cname, cvalue, expirationInDays) {
  var d = new Date();
  d.setTime(d.getTime() + (expirationInDays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function isPublicChangelist() {
  return $('#visibility').val().toLowerCase() === "public";
}

function togglePublicMode() {
  if (isPublicChangelist()) {
    $('#main-description').attr('placeholder', 'Information relevant to the public');
    $('#optional-info').attr('placeholder', 'Information relevant to the development team');
  } else {
    $('#main-description').attr('placeholder', 'Information relevant to the development team');
    $('#optional-info').attr('placeholder', 'More detailed information');
  }
}

function handlePasteOnJira() {
  navigator.clipboard.readText().then(
    clipText => {
      const urlRegex = /(https|http)\:\/\/(.+)\.atlassian\.net\/browse\/([A-Z]{3,5}-[0-9]+)(.*)/;

      var jiraSplit = clipText.split(urlRegex);

      // Remove empty strings
      jiraSplit = jiraSplit.filter(item => item);

      if (jiraSplit.length > 2) {
        // Given the regex we defined before, we'll end up with at least three groups.
        // The first one will contain "http" or "https".
        // The second one will contain the JIRA domain.
        // The third one will contain the string we're looking for.
        $('#jira').val(jiraSplit[2]);
      } else {
        console.log("Failed to properly match the regex for the JIRA field. Groups are: " + jiraSplit);
      }
    }
  );
}

function updateResult() {
  const cookiesLifetimeInDays = 7;

  var clType = $('#type').val();
  document.cookie = setCookie("type", clType, cookiesLifetimeInDays);

  var text = '';
  if (clType) {
    text += clType.substring(0, 3).toUpperCase() + ' ';
  }

  var jiraId = $('#jira').val();
  if (jiraId) {
    const jiraRegex = /([A-Z]{3,5}-[0-9]+)/g;
    var processedJira = jiraId.match(jiraRegex);
    for (const group in processedJira) {
      text += processedJira[group] + ' ';
    }
  }

  var isPublic = isPublicChangelist();

  if (isPublic) {
    text += '!P';
  } else {
    text += '!X';
  }

  var category = $('#category').val();
  document.cookie = setCookie("category", category, cookiesLifetimeInDays);
  if (category) {
    text += '[' + category + ']';
  }

  var releaseNote = $('#main-description').val();

  if (isPublic) {
    text += '[' + releaseNote + ']\n\n';
  } else {
    text += ' ' + releaseNote + '\n\n';
  }

  var optionalInfo = $('#optional-info').val();
  if (optionalInfo) {
    text += optionalInfo;
  }

  // The changelog generator doesn't support Unicode characters.
  // Also, remove all unnecessary spaces and end of lines.
  $('#preview').val(text.replace(/[^\x00-\x7F]/g, "").trim());
}

function checkRegex() {
  const regex = /([A-Z]{3}) (([A-Z]{3,5}-[0-9]+) )*(!P\[(.+?)\]\[.+\]|!X\[(.+?)\])/g;
  return $('#preview').val().match(regex);
}

function pickEasterEgg() {
  const quotes = [
    'Game dev... game dev never changes.',
    'The Build is a lie.',
    'You just put it in the right changelist, according to alphabetical order! Y\'know A, B, C, D, E, F, G!',
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
    'You require more vespene gas.',
    '*Fixes the build 3 days later* Kept you waiting, huh?',
    'Go ahead, make my day.',
    'Mein Führer! I can walk!',
    'A crash a day keeps the release away.',
    'May the Force be with you.',
    'You talking to me?',
    'I love the smell of broken builds in the morning.',
    'If you don\'t mind, it\'s time to milk the alpacas.',
    'We\'re gonna need a bigger server.',
    'Mama always said gamedev bugs were like a box of chocolates. You never know what you\'re gonna get.',
    'I see broken builds.',
    'You\'ve got to ask yourself one question: \"Do I feel lucky?\". Well, do ya, punk?',
    'Keep your teammates close, but your PMs closer.',
    'Say "hello" to my little friend! *breaks the build*',
    'Sorry boss, but there\'s only two men I trust. One of them\'s me. The other\'s not you.',
    'Gentlemen, you can\'t fight in here! This is the War Room!',
    'Get your stinking changelist off me, you damned dirty ape.',
    'A dream you dream alone is just a dream. A dream you dream together is reality.',
    'Carpe diem. Seize the day. Make your lives extraordinary.',
    'Nobody puts the Build in a corner.',
    'If you\'re reading this, you\'ve been in a coma for almost 20 years now. We\'re trying a new technique.<br>We don\'t know where this message will end up in your dream, but we hope it works.<br>Please wake up, we miss you.',
    'Put... the bunny... back... in the box.',
    'What\'s in the changelist? A shark or something?',
  ];

  const random = Math.floor(Math.random() * quotes.length);
  $('#easter-egg').append('<p> « ' + quotes[random] + ' »</p>');
}