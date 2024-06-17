import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

import { AuthContext } from '../context/jwt'; // replace with your actual UserContext import

function PermissionGuard({ children, permission }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);

  const getPathAfterLogin = useCallback(() => {
    if (user?.type === 'admin') {
      return PATH_AFTER_LOGIN;
    }

    for (let i = 0; i < user?.permissions?.length; i++) {
      switch (user.permissions[i]) {
        case 'DASHBOARD':
          return PATH_AFTER_LOGIN;
        case 'SALES':
          return SALE_PATH;
        case 'CATEGORY':
          return CATEGORY_PATH;
        case 'MENU':
          return MENU_PATH;
        case 'TABLE':
          return TABLE_PATH;
        case 'CUSTOMER':
          return CUSTOMER_PATH;
        case 'ORDER':
          return SALE_ORDER_PATH;
        case 'ROLE':
          return USER_PERMISSION_PATH;
        case 'USER':
          return USER_PATH;
        case 'REPORT':
          return OVERALL_REPORT_PATH;
        default:
          continue;
      }
    }
    return PATH_AFTER_LOGIN;
  }, [user]);

  const check = useCallback(() => {
    const pathAfterLogin = getPathAfterLogin();

    if (user?.type !== 'admin' && permission?.some((p) => !user?.permissions?.includes(p))) {
      console.log(pathAfterLogin);
      navigate(pathAfterLogin);
    } else {
      setChecked(true);
    }
  }, [user, permission, navigate, getPathAfterLogin]);

  useEffect(() => {
    check();
  }, [check]);

  if (user?.type !== 'admin' && !checked) {
    return null;
  }

  return <>{children}</>;
}

PermissionGuard.propTypes = {
  children: PropTypes.node.isRequired,
  permission: PropTypes.array.isRequired,
};

export default PermissionGuard;
