import {PhoneNumbers} from "@app/js/pages/numbers";

$(document).ready(async () => {
    const phoneNumbers: PhoneNumbers = new PhoneNumbers();
    await phoneNumbers.renderNumbers();
});