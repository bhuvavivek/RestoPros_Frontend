import { Redirect } from 'react-router-dom';

import { useProfileContext } from 'src/sections/me/context';

function withPermission(WrappedComponent, requiredPermissions) {
  return function WithPermission(props) {
    const { profile } = useProfileContext(); // get the profile from context

    if (requiredPermissions.some((permission) => profile.permissions.includes(permission))) {
      return <WrappedComponent {...props} />;
    }
    return <Redirect to="/dashboard" />;
  };
}

export default withPermission;
