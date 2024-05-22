import { Redirect } from 'react-router-dom';

import { useProfileContext } from 'src/sections/me/context';

function withPermission(WrappedComponent, requiredPermissions) {
  return function WithPermission(props) {
    const { profile } = useProfileContext();

    if (profile.permissions.include(requiredPermissions)) {
      return <WrappedComponent {...props} />;
    }
    return <Redirect to="/maindashboard" />;
  };
}

export default withPermission;
