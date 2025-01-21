export const generateEmailSuggestions = (data) => {
    const { nombre_user, apellido_pat, apellido_mat, phone_user } = data;
    const firstLetter = apellido_pat.charAt(0);
    const secondLetter = apellido_mat.charAt(0);
    const randomNumbers = phone_user.slice(0, 3);
    return `${nombre_user}.${firstLetter}${secondLetter}${randomNumbers}@gmail.com`;
};

export const generatePasswordSuggestions = (data) => {
    const specialCharacters = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const { apellido_pat, apellido_mat, phone_user } = data;
    const firstLetter = apellido_pat.charAt(0);
    const secondLetter = apellido_mat.charAt(0);
    const randomNumbers = phone_user.slice(3, 6) + phone_user.slice(-1);
    const randomSpecialCharacter = specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));
    return `${firstLetter}${secondLetter}${randomNumbers}${randomSpecialCharacter}`;
};

export const generateProfileSuggestion = (userInfo) => {
    const { nombre_user, id_User } = userInfo;
    const randomNumber = Math.floor(100 + Math.random() * 900);
    return `${nombre_user}_${id_User}_${randomNumber}`;
};

export const generatePasswordSuggestion = (userInfo) => {
    const specialCharacters = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    const randomSpecialCharacter = specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));
    return `Pass${randomNumbers}${randomSpecialCharacter}`;
};