import {
    defineRule
} from "vee-validate";

defineRule("required", (value, [name, isSelect]) => {
    if (!value || value.length <= 0) {
        if (name) {
            if (!isSelect || isSelect == false) {
                return `Please enter ${name}`;
            } else {
                return `Please select ${name}`;
            }
        }
        return "This field is required";
    }
    return true;
});

defineRule("message", (value, [name]) => {
    if (value && value == "select") {
        return `Please select ${name}`;
    }
    return true;
});

defineRule("email", (value) => {
    if (
        value &&
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
        )
    ) {
        return "Please enter valid email";
    }
    return true;
});

defineRule("phone", (value) => {
    if (value && !/^[0-9]{10,13}$/.test(value)) {
        return "Please enter valid mobile number";
    }
    return true;
});

defineRule("pincode", (value) => {
    if (value && !/^[0-9]{6}$/.test(value)) {
        return "Please enter a valid 6-digit pincode";
    }
    return true;
});



defineRule("pincode", (value) => {
    if (value && !/^[0-9]{6}$/.test(value)) {
        return "Please enter valid pin code";
    }
    return true;
});


defineRule("minLength", (value, [limit]) => {
    if (value.length < limit) {
        return `This field must be at least ${limit} characters`;
    }
    return true;
});

defineRule("password", (value) => {
    if (value && !/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value)) {
        return "Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters";
    }
    return true;
});

defineRule("confirmed", (value, [target]) => {
    if (value === target) {
        return true;
    }
    return "Passwords must match";
});

defineRule("numeric", (value) => {
    if (value && !/^\d+(\.\d{1,5})?$/.test(value)) {
        return "Please enter numeric values only";
    }
    return true;
});

defineRule("minValue", (value, [limit]) => {
    if (parseFloat(value) < parseFloat(limit)) {
        return `This field minimum value is  ${limit}`;
    }
    return true;
});
