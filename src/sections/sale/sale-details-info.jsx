import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


// ----------------------------------------------------------------------

export default function SaleDetailsInfo({ customer, table, createdBy }) {


  const renderCustomer = (
    <>
      <CardHeader
        title="Customer Info"
      // action={
      //   <IconButton>
      //     <Iconify icon="solar:pen-bold" />
      //   </IconButton>
      // }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={customer?.name}
          src="img/something"
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{customer?.name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{customer?.email}</Box>

          <Box>
            Phone number:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {customer?.phone}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      <CardHeader
        title="Table info"

      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Created by
          </Box>
          {createdBy?.name}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Table Name
          </Box>
          {table?.name}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Table No.
          </Box>
          <Link underline="always" color="inherit">
            {table?.table_no}
          </Link>
        </Stack>
      </Stack>
    </>
  );


  return (
    <Card>
      {renderCustomer}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderDelivery}



    </Card>
  );
}

SaleDetailsInfo.propTypes = {
  customer: PropTypes.object,
  createdBy: PropTypes.object,
  table: PropTypes.object,
};
