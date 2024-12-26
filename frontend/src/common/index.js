const url = "http://localhost:5000/api";

const ENDPOINT = {
  auth: {
    signup: `${url}/auth/signup`,
    login: `${url}/auth/login`,
    user: `${url}/auth/user`,
    logout: `${url}/auth/logout`,
  },
  task: {
    add: `${url}/task/add`,
    update: `${url}/task/update`,
    delete: `${url}/task`,
    all: `${url}/task/all`,
  },
};

export default ENDPOINT;
