function initClever() {
    loadConfig();

    togglePublicMode();

    // Calling this here will allow us to prefill
    // the JIRA field at page load (if possible).
    handlePasteOnJira();
}

function loadConfig() {
    $.getJSON("./assets/data/config.json", function (data) {
        // Load the types of changelist
        var types_field = document.getElementById("cl-type-field");
        data["types"].forEach(function (cl_type) {
            var option = document.createElement("option");
            option.text = cl_type;
            types_field.add(option);
        });

        // Load the project's categories
        var categories_field = document.getElementById("cl-category-field");
        data["categories"].forEach(function (cl_category) {
            var option = document.createElement("option");
            option.text = cl_category;
            categories_field.add(option);
        });

        //Load 'About' info
        if (data["about_url"]) {
            document.getElementById("clever-about-href").href = data["about_url"];
        }

        // Load 'Contact' info
        var contactObj = data["contact"];
        if (contactObj) {
            var contactUrl = "mailto:";
            if (contactObj["to"]) {
                contactUrl += contactObj["to"];
            }
            contactUrl = contactUrl + "?";
            if (contactObj["cc"]) {
                contactUrl += "cc=" + contactObj["cc"];
            }
            if (contactObj["subject"]) {
                contactUrl += "&subject=" + contactObj["subject"];
            }

            document.getElementById("clever-contact-href").href = contactUrl;
        }

        prefillFromCookies();
        
        var quotesObj = data["quotes"];
        if (quotesObj && quotesObj.length > 0) {
            const random = Math.floor(Math.random() * quotesObj.length);
            $('#cl-easter-egg').append('<p> « ' + quotesObj[random] + ' »</p>');
        } else {
            //$('#cl-easter-egg').append('<p> « :( »</p>');
        }
    });
}

function prefillFromCookies() {
    var typeFieldCookie = getCookie('cl_type');
    if (typeFieldCookie) {
        $('#cl-type-field').val(typeFieldCookie);
    }

    var categoryFieldCookie = getCookie('cl_category');
    if (categoryFieldCookie) {
        $('#cl-category-field').val(categoryFieldCookie);
    }

    $('#cl-type-field').trigger('change');
    $('#cl-category-field').trigger('change');
}

function isPublicChangelist() {
    return $('#cl-visibility-field').val().toLowerCase() === "public";
}

function togglePublicMode() {
    if (isPublicChangelist()) {
        $('#cl-main-description-field').attr('placeholder', 'Information relevant to the public');
        $('#cl-optional-description-field').attr('placeholder', 'Information relevant to the development team');
    } else {
        $('#cl-main-description-field').attr('placeholder', 'Information relevant to the development team');
        $('#cl-optional-description-field').attr('placeholder', 'More detailed information');
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
                $('#cl-jira-field').val(jiraSplit[2]);

                updatePreview();
            } else {
                console.log("Failed to properly match the regex for the JIRA field. Groups are: " + jiraSplit);
            }
        }
    );
}

function updatePreview() {
    const cookiesLifetimeInDays = 7;

    var clType = $('#cl-type-field').val();
    document.cookie = setCookie("cl_type", clType, cookiesLifetimeInDays);

    var text = '';
    if (clType) {
        text += clType.substring(0, 3).toUpperCase() + ' ';
    }

    var jiraId = $('#cl-jira-field').val();
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

    var category = $('#cl-category-field').val();
    document.cookie = setCookie("cl_category", category, cookiesLifetimeInDays);
    if (category) {
        text += '[' + category + ']';
    }

    var releaseNote = $('#cl-main-description-field').val();

    if (isPublic) {
        text += '[' + releaseNote + ']\n\n';
    } else {
        text += ' ' + releaseNote + '\n\n';
    }

    var optionalInfo = $('#cl-optional-description-field').val();
    if (optionalInfo) {
        text += optionalInfo;
    }

    // The changelog generator doesn't support Unicode characters.
    // Also, remove all unnecessary spaces and end of lines.
    $('#cl-preview-field').val(text.replace(/[^\x00-\x7F]/g, "").trim());
}

function checkRegex() {
    const regex = /([A-Z]{3}) (([A-Z]{3,5}-[0-9]+) )*(!P\[(.+?)\]\[.+\]|!X\[(.+?)\])/g;
    return $('#cl-preview-field').val().match(regex);
}