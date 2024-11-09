import {PhoneNumbers} from "@pages/numbers";

$(document).ready(async () => {
    const phoneNumbers: PhoneNumbers = new PhoneNumbers();
    await phoneNumbers.renderNumbers();
});