import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fNumber, fPercent } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function DashboardWidgetSummery({ title, percent, total, lasttotal, lasttime, sx, ...other }) {


  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{title}</Typography>

        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
          <Iconify
            width={24}
            icon={
              percent < 0
                ? 'solar:double-alt-arrow-down-bold-duotone'
                : 'solar:double-alt-arrow-up-bold-duotone'
            }
            sx={{
              mr: 1,
              color: 'success.main',
              ...(percent < 0 && {
                color: 'error.main',
              }),
            }}
          />

          <Typography component="div" variant="subtitle2">
            {percent > 0 && '+'}

            {fPercent(percent)}
          </Typography>
        </Stack>

        <Typography variant="h3">{fNumber(total)}</Typography>

        <Typography variant="h4">{fNumber(lasttotal)} {" "} {lasttime} </Typography>

      </Box>

    </Card>
  );
}

DashboardWidgetSummery.propTypes = {
  percent: PropTypes.number,
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  lasttotal: PropTypes.number,
  lasttime: PropTypes.string,
};
