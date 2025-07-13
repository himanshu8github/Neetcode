const validatorLib = require('validator');

const validator = (data) => {

    const mandatoryField = ['firstName', 'emailId', 'password'];

    const isAllowed = mandatoryField.every( (k) => Object.keys(data).includes(k));

    if(!isAllowed)
        throw new Error("Some field is missing");

    if(!validatorLib.isEmail(data.emailId))
        throw new Error ("Invalid Email");

    if(!validatorLib.isStrongPassword(data.password))
        throw new Error ("Week Password");

}

module.exports = validator;