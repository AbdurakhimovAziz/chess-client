export interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type UserDetails = Pick<
  User,
  '_id' | 'firstName' | 'lastName' | 'email'
>;

