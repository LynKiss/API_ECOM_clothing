export type SuperAdminJwtPayload = {
  _id: string;
  username: string;
  email: string;
  authType: 'super_admin';
};

export type SuperAdminRequestUser = {
  _id: string;
  username: string;
  email: string;
  authType: 'super_admin';
};
