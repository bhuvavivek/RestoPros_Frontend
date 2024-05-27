import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { Autocomplete, Grid } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';



// ----------------------------------------------------------------------


const DurationOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
  { label: 'Custom', value: 'manual' }
]

export default function OverallReportTableToolbar({
  filters,
  onFilters,
  setDuration,
  setSearch,
  //
  duration,
  PaymentOption,
  setPaymentMode,
  paymentMode,
  OrderTypeOption,
  orderType,
  setOrderType,
  dateError
}) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('orderNo', event.target.value);
      setSearch(event.target.value);
    },
    [onFilters, setSearch]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >

        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={OrderTypeOption}
            sx={{ width: 180 }}
            value={orderType}
            onChange={(event, value) => setOrderType(value)}
            renderInput={(params) => <TextField {...params} label="Order Type" />}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={PaymentOption}
            sx={{ width: 180 }}
            value={paymentMode}
            onChange={(event, value) => setPaymentMode(value)}
            renderInput={(params) => <TextField {...params} label="Payment Method" />}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={DurationOptions}
            sx={{ width: 180 }}
            value={duration}
            onChange={(event, value) => setDuration(value)}
            renderInput={(params) => <TextField {...params} label="Duration" />}
          />
        </Grid>

        {duration?.value === 'manual' && (<DatePicker
          label="Start date"
          value={filters.startDate}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 150 },
          }}
        />)
        }
        {duration?.value === 'manual' && (<DatePicker
          label="End date"
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
            },
          }}
          sx={{
            maxWidth: { md: 150 },
          }}
        />)
        }

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1.5 }}>
          <TextField
            fullWidth
            value={filters.orderNo}
            onChange={handleFilterName}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />


        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

OverallReportTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  setSearch: PropTypes.func,
  setDuration: PropTypes.func,
  duration: PropTypes.object,
  dateError: PropTypes.bool,
  PaymentOption: PropTypes.array,
  setPaymentMode: PropTypes.func,
  paymentMode: PropTypes.object,
  OrderTypeOption: PropTypes.array,
  setOrderType: PropTypes.func,
  orderType: PropTypes.object
};
