import PropTypes from 'prop-types';
import { useContext } from 'react';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { AuthContext } from 'src/auth/context/jwt';
import {
  CATEGORY_PATH,
  CUSTOMER_PATH,
  MENU_PATH,
  OVERALL_REPORT_PATH,
  PATH_AFTER_LOGIN,
  SALE_ORDER_PATH,
  SALE_PATH,
  TABLE_PATH,
  USER_PATH,
  USER_PERMISSION_PATH,
} from 'src/config-global';

// ----------------------------------------------------------------------

export default function LoginButton({ sx }) {
  const { user } = useContext(AuthContext);

  let path_after_login;

  if (user?.type !== 'admin') {
    switch (true) {
      case user?.permissions?.includes('DASHBOARD'):
        path_after_login = PATH_AFTER_LOGIN;
        break;
      case user?.permissions?.includes('SALES'):
        path_after_login = SALE_PATH;
        break;
      case user?.permissions?.includes('CATEGORY'):
        path_after_login = CATEGORY_PATH;
        break;
      case user?.permissions?.includes('MENU'):
        path_after_login = MENU_PATH;
        break;
      case user?.permissions?.includes('TABLE'):
        path_after_login = TABLE_PATH;
        break;
      case user?.permissions?.includes('CUSTOMER'):
        path_after_login = CUSTOMER_PATH;
        break;
      case user?.permissions?.includes('ORDER'):
        path_after_login = SALE_ORDER_PATH;
        break;
      case user?.permissions?.includes('ROLE'):
        path_after_login = USER_PERMISSION_PATH;
        break;
      case user?.permissions?.includes('USER'):
        path_after_login = USER_PATH;
        break;
      case user?.permissions?.includes('REPORT'):
        path_after_login = OVERALL_REPORT_PATH;
        break;
      default:
        path_after_login = PATH_AFTER_LOGIN;
    }
  } else {
    path_after_login = PATH_AFTER_LOGIN;
  }

  return (
    <Button component={RouterLink} href={path_after_login} variant="outlined" sx={{ mr: 1, ...sx }}>
      Login
    </Button>
  );
}

LoginButton.propTypes = {
  sx: PropTypes.object,
};
