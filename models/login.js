import { instance } from "@/utils/axios.utils";

const login = {
     login: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = `login/`;
      instance()
        .post(url, body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          console.log("errorsss: ", error);
          if (error.response) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },
}

export default login;