import React from 'react';

//This code simply executes and deals with the logout process once a user
// decides to log out of their account


import { auth } from '../../firebase';
import { MenuItem } from 'material-ui/Menu';

//

const LogoutButton = () =>
  <MenuItem
    type="button"
    onClick={auth.doLogout} //listener; =~ controller portion
  >
    Logout
  </MenuItem>

export default LogoutButton;
