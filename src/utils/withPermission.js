import { Redirect } from 'react-router-dom';

import { useProfileContext } from 'src/sections/me/context';

function withPermission(WrappedComponent, requiredPermissions) {
  return function WithPermission(props) {
    const { profile } = useProfileContext();

    if (requiredPermissions.some((permission) => profile.permissions.includes(permission))) {
      return <WrappedComponent {...props} />;
    }
    return <Redirect to="/maindashboard" />;
  };
}

export default withPermission;
