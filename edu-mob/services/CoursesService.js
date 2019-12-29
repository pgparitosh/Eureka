import axios from "axios";
import { DOMAIN } from "../constants/applicationConstants";

const instance = axios.create({
  baseURL: DOMAIN,
  timeout: 2000,
  headers: { "Content-Type": "application/json" }
});

const CoursesService = {
  // The below method is used to sign up a new user
  async getCourseList(inputObj) {
    return instance({
      method: "post",
      url: "frontside/api/GetCourseList",
      data: inputObj
    })
      .then(response => {
        return response.data;
      })
      .catch(e => console.log(e));
  },
  async getChapteresList(inputObj) {
    return instance({
      method: "post",
      url: "frontside/api/GetChaptersList",
      data: inputObj
    })
      .then(response => {
        return response.data;
      })
      .catch(e => console.log(e));
  },
  async getVideosList(inputObj) {
    return instance({
      method: "post",
      url: "frontside/api/GetVideosList",
      data: inputObj
    })
      .then(response => {
        return response.data;
      })
      .catch(e => console.log(e));
  },
  async getDocumentsList(inputObj) {
    return instance({
      method: "post",
      url: "frontside/api/GetAttachmentsList",
      data: inputObj
    })
      .then(response => {
        return response.data;
      })
      .catch(e => console.log(e));
  },
};

export default CoursesService;
