import PropTypes from 'prop-types';
import { useContext } from 'react';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { AuthContext } from 'src/auth/context/jwt';
import {
  PATH_AFTER_LOGIN,
} from 'src/config-global';

// ----------------------------------------------------------------------

export default function LoginButton({ sx }) {

  return (
    <Button component={RouterLink} to={PATH_AFTER_LOGIN} variant="outlined" sx={{ mr: 1, ...sx }}>
      Login
    </Button>
  );
}
LoginButton.propTypes = {
  sx: PropTypes.object,
};
