const url = "https://task-manager-backend-3dp6.onrender.com/api";

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
