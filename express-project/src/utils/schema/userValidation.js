export const userValidationSchema = {
    username: {
        notEmpty: {
            errorMessage: "Username cannot be empty"
        },
        
        isLength: {
            options: { min: 3, max: 20 },
            errorMessage: "Username length should be between 3 and 20 characters"
        }
    },
    displayName: {
        notEmpty: true,
    }
}