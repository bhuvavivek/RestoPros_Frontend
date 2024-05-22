import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  // user: null,
  loading: true,
  isAuthenticated: false,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
      isAuthenticated: action.payload.isAuthenticated,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
      isAuthenticated: true,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
      isAuthenticated: true
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
      isAuthenticated: false,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        console.log('inside a if')

        const response = await axios.get(endpoints.profile.userprofile);

        const { user } = response.data;
        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              accessToken,
            },
            isAuthenticated: {
              isAuthenticated: true
            }
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
            isAuthenticated: false
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
          isAuthenticated: false
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password, isAdmin) => {
    const data = {
      email,
      password,
    };

    const Loginpath = isAdmin ? endpoints.auth.adminlogin : endpoints.auth.userLogin;
    const response = await axios.post(Loginpath, data);

    const { token } = response.data;

    setSession(token);
    sessionStorage.setItem(STORAGE_KEY, token);
    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          token
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    sessionStorage.removeItem(STORAGE_KEY);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.isAuthenticated ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      // user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
