const validateEmail = (email) => {
    return email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/);
};
module.exports.validateEmail = validateEmail

const isValidReqBody = (value) => {
    return Object.keys(value).length > 0
}
module.exports.isValidReqBody=isValidReqBody;

function isValid (data) {
    if(typeof data !== "string" || data.trim().length == "") return false
    else return true
}
module.exports.isValid=isValid;