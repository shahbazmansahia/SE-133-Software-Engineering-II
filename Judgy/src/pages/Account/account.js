import React from 'react';

import AuthUserContext from '../../components/withAuth/AuthUserContext';
import { PasswordForgetForm } from '../PasswordForget/passwordForget';
import PasswordChangeForm from '../PasswordChange/passwordChange';
import withAuthorization from '../../components/withAuth/withAuthorization';
import Sidebar from '../../components/sidebar/sidebar';

// Setting Page; the options rendered on the setting page

const AccountPage = () =>
<div className="page-centered">
  <Sidebar />
  <div style={{flexGrow: 1}}>
  <AuthUserContext.Consumer>
    {authUser =>
      <div>
        <h1>Account: {authUser.email}</h1> // account name
        <PasswordForgetForm />            //  option in case user wishes to change password
        <PasswordChangeForm />
      </div>
    }
  </AuthUserContext.Consumer>
  </div>
  </div>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
