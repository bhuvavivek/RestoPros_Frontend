import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/jwt'; // replace with your actual UserContext import

function PermissionGuard({ children, permission }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate()

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!user?.permissions?.includes(permission)) {
      navigate("/dashboard/mainDashboard");
    } else {
      setChecked(true);
    }
  }, [user, permission, navigate]);

  useEffect(() => {
    check();
  }, [check]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

PermissionGuard.propTypes = {
  children: PropTypes.node.isRequired,
  permission: PropTypes.string.isRequired,
};

export default PermissionGuard;
