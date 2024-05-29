
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Stack from '@mui/system/Stack';


export default function SaleOrderTimer({ startTime }) {

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {

    const startDate = startTime ? new Date(startTime) : new Date();
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeDifference = now - startDate;
      setElapsedTime(timeDifference);
    }, 1000)


    return () => clearInterval(intervalId);

  }, [startTime])


  const formatElapsedTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formatNumber = (number) => (number < 10 ? `0${number}` : `${number}`);

    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
  }


  return (
    <Stack>
      {formatElapsedTime(elapsedTime)}
    </Stack>
  );
}


SaleOrderTimer.propTypes = {
  startTime: PropTypes.string
}
