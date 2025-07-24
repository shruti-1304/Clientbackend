// messages
 
const messages = {
  USER: {
    CREATED: "User created sucessfully...",
    NOT_FOUND: "User not found",
    UPADATED_USER: "User updated successfully",
    DELETED_USER: "User deleted successfully",
    FETCHED_USER: "User fetched successfully",
    USER_FOUND:"User found successfully "
  },
  AUTH: {
    REGISTER_SUCCESS: "Registration successful.",
    LOGIN_SUCCESS: "user login successfully",
    LOGIN_FAILED: "Invalid Credenrials",
    USER_NOT_FOUND: "user not found",
    UNAUTHORIZED: "unauthorized user",
    USER_ALREADY_CREATED: "user already created",
    TOKEN_MISSING: "Authentication token is missing.",
    EMAIL_SEND :"Email has been send",
    EMAIL_NOT_SEND :"Email has not been send",
    
  },
  GENERAL: {
    SERVER_ERROR: "something went wrong",
    BAD_REQUEST: "invalid request",
    VALIDATION: "validation failed",
    TOKEN_INVALID: "Invalid or expired token.",
  },
  OTP:{
    FIELDS_REQUIRED :"All fields are required",
    PASSWORD_MATCH: "Passwords do not match",
    PASSWORD_CREATED :"Password reset successful",
    OTP_VERIFIED:"OTP verified successfully",
    OTP_EXPIRED : "Invalid or expired Otp",
    OTP_SENT: "OTP sent to your email"
  },
  PASSWORD:{
     OLD_PASS :"old password is not correct"
  },  
  POST :{
    POST_CREATED : "Post created successfully",
    POST_LIST :"Post list"
  }
};
 
module.exports = messages;
 