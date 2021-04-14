var configJson = null;

function initClever() {
    loadConfig();

    togglePublicMode();
}

function loadConfig() {
    $.getJSON("./assets/data/config.json", function (data) {
        configJson = data;

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
        }
        
        // Calling this here will allow us to prefill
        // the ticket field at page load (if possible).
        handlePasteOnTicket();
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
    let mainDescription;
    let optionalDescription;

    if (isPublicChangelist()) {
        mainDescription = 'Information relevant to the public';
        optionalDescription = 'Information relevant to the development team';
    } else {
        mainDescription = 'Information relevant to the development team';
        optionalDescription = 'More detailed information';
    }

    $('#cl-main-description-field').attr('placeholder', mainDescription);
    $('#cl-optional-description-field').attr('placeholder', optionalDescription);
}

function handlePasteOnTicket() {
    navigator.clipboard.readText().then(
        clipText => {
            const urlRegex = "/" + configJson["ticket"]["url_regex"] + "/";

            var ticketSplit = clipText.split(eval(urlRegex));

            // Remove empty strings
            ticketSplit = ticketSplit.filter(item => item);

            if (ticketSplit.length > 2) {
                // Given the regex we defined before, we'll end up with at least three groups.
                // The first one will contain "http" or "https".
                // The second one will contain the ticket domain.
                // The third one will contain the string we're looking for.
                $('#cl-ticket-field').val(ticketSplit[2]);

                updatePreview();
            } else {
                console.log("Failed to properly match the regex for the ticket field. Groups are: " + ticketSplit);
            }
        }
    );
}

function updatePreview() {
    if (!configJson) {
        console.log("There's no valid config JSON");
        return;
    }

    const cookiesLifetimeInDays = 7;

    var template = configJson["format"][isPublicChangelist() ? "public" : "private"];

    const clVisibility = $('#cl-visibility-field').val();

    const clType = $('#cl-type-field').val();
    document.cookie = setCookie("cl_type", clType, cookiesLifetimeInDays);

    const clCategory = $('#cl-category-field').val();
    document.cookie = setCookie("cl_category", clCategory, cookiesLifetimeInDays);

    let clTickets = "";
    const allTickesField = $('#cl-ticket-field').val();
    if (allTickesField) {
        const tickeRegex = "/" + configJson["ticket"]["regex"] + "/g";
        var processedTickets = allTickesField.match(eval(tickeRegex));
        if (processedTickets) {
            for (i = 0; i < processedTickets.length; i++) {
                clTickets += processedTickets[i] + ' ';
            }
        }
    }

    const clReleaseNote = $('#cl-main-description-field').val();

    const clOptionalInfo = $('#cl-optional-description-field').val();

    // The changelog generator doesn't support Unicode characters.
    // Also, remove all unnecessary spaces and end of lines.
    const preview = eval("`" + template + "`").replace(/[^\x00-\x7F]/g, "").trim();

    $('#cl-preview-field').val(preview);
}