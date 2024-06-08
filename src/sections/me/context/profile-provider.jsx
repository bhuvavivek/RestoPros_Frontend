import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { endpoints } from 'src/utils/axios';

import { ProfileContext } from './my-profile';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'profileCheckout';

const initialState = {
  profile: {},
};

export function ProfileProvider({ children }) {
  const { state, update, reset } = useLocalStorage(STORAGE_KEY, initialState);

  useEffect(() => {
    // replace with your actual API endpoint
    axios
      .get(endpoints.profile.userprofile)
      .then((response) => {
        update(response.data);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }, [update]); // empty dependency array means this effect runs once on mount

  const memoizedValue = useMemo(
    () => ({
      profile: state,
      logout: () => {
        reset(); // clear local storage on logout
      },
    }),
    [state, reset]
  );

  return <ProfileContext.Provider value={memoizedValue}>{children}</ProfileContext.Provider>;
}

ProfileProvider.propTypes = {
  children: PropTypes.node,
};
