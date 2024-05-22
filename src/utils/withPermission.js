import { Redirect } from 'react-router-dom';

import { useProfileContext } from 'src/sections/me/context';

function withPermission(WrappedComponent, requiredPermissions) {
  return function WithPermission(props) {
    const { profile } = useProfileContext(); // get the profile from context

    if (profile.permissions.include(requiredPermissions)) {
      return <WrappedComponent {...props} />;
    }
    return <Redirect to="/dashboard" />;
  };
}

export default withPermission;
