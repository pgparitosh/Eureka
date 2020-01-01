import axios from "axios";
import { DOMAIN } from "../constants/applicationConstants";

const instance = axios.create({
  baseURL: DOMAIN,
  timeout: 2000,
  headers: { "Content-Type": "application/json" }
});

const AuthService = {
  
    // The below method is used to sign up a new user
    async signUp(inputObj) {
    return instance({
      method: "post",
      url: "frontside/api/register",
      data: inputObj
    })
      .then(response => {
        return response.data;
      })
      .catch(e => console.log(e));
  },

  // the below method is used to log in for an exisiting user
  async login(inputObj) {
    return instance({
      method: "post",
      url: "frontside/api/login",
      data: inputObj
    })
      .then(response => {
        return response.data;
      })
      .catch(e => console.log(e));
  },

  // the below method is used to help getting back a forgotten password
  async forgotPassword(inputObj) {
    return instance({
      method: "post",
      url: "frontside/api/ForgotPassword",
      data: inputObj
    })
      .then(response => {
        return response.data;
      })
      .catch(e => console.log(e));
  },

  // the below method is used to verify the OTP
  async verifyOtp(inputObj) {
    return instance({
      method: "post",
      url: "frontside/api/VerifyOTPNumber",
      data: inputObj
    })
      .then(response => {
        return response.data;
      })
      .catch(e => console.log(e));
  },

  // the below method is used to change a password
  async changePassword(inputObj) {
    return instance({
      method: "post",
      url: "frontside/api/ChangePassword",
      data: inputObj
    })
      .then(response => {
        return response.data;
      })
      .catch(e => console.log(e));
  },

  // the below method is used to get the banners on the welcome screen
  async getBanners() {
    return instance({
      method: "get",
      url: "frontside/api/GetBanners"
    })
      .then(response => {
        return response.data;
      })
      .catch(e => console.log(e));
  }
};

export default AuthService;
