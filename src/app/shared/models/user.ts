export interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
