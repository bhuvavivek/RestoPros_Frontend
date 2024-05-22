import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
import { InputAdornment, InputLabel, MenuItem, Select } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Stack } from '@mui/system';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';

export default function SaleOrderDialog({ title = ' Payment', open, saleinfo, onClose, refetch, ...other }) {



  const newPaymentSchema = Yup.object().shape({
    discount: Yup.number().required('Discount is  required'),
    tip: Yup.number().required('Tip Amount is  required'),
    tax: Yup.number().required('Tax Amount is required'),
    paymentMode: Yup.string().required('Payment mode is required'),
    subtotal: Yup.number().required('Subtotal is required'),
    total: Yup.number().required('total is required')
  });

  const defaultValues = useMemo(() => ({
    paymentMode: 'online',
    discount: 0,
    tip: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  }), [])


  const methods = useForm({
    resolver: yupResolver(newPaymentSchema),
    defaultValues,
  });



  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const discount = watch('discount');
  const tip = watch('tip');
  const tax = watch('tax');
  const subtotal = watch('subtotal');

  useEffect(() => {
    if (saleinfo) {
      setValue('subtotal', saleinfo.subtotal)
      setValue('tax', saleinfo.tax)
      setValue('tip', saleinfo.tip)
      setValue('discount', saleinfo.discount)
    }
  }, [saleinfo, setValue])

  useEffect(() => {
    let total = Number(subtotal);
    total += total * Number(tax) / 100;
    total -= total * Number(discount) / 100;
    total += Number(tip);

    if (total <= 0) {
      total = 0; // If total is less than 0, set it to 0
    }

    setValue('total', total);
  }, [discount, tip, tax, subtotal, setValue, saleinfo]);


  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axiosInstance.post(endpoints.orderBill.create, {
        tax: data.tax,
        tip: data.tip,
        order_id: saleinfo._id,
        discount: data.discount,
        payment_method: data.paymentMode
      })

      if (response.status === 200) {
        enqueueSnackbar('Payment Made Successfully', { variant: 'success' })
        refetch();
        handlePopupClose()
      }
    } catch (error) {
      enqueueSnackbar('Please Try Again!!', { variant: 'error' })
      console.error(error);
    }
  });


  const handlePopupClose = () => {
    onClose();
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handlePopupClose} {...other}>
      <FormProvider onSubmit={onSubmit} methods={methods}>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
            {title}
          </DialogTitle>
          <Iconify icon="ep:close-bold" onClick={handlePopupClose} sx={{ cursor: "pointer", mr: 4 }} />
        </Stack>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
          >
            <Stack>
              <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
              <Controller
                name='paymentMode'
                defaultValue='online'
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    labelId="payment-mode-label"
                    inputProps={{ 'aria-label': 'Payment Mode' }}
                  >
                    <MenuItem value='online'>
                      Online / Card
                    </MenuItem>
                    <MenuItem value='cash'>
                      Cash
                    </MenuItem>
                  </Select>
                )}
              />
            </Stack>

            {/* discount */}

            <Stack direction='row' spacing={2} >
              <Controller
                name="discount"
                control={control}
                render={({ field }) => (
                  <RHFTextField
                    {...field}
                    label="Discount Rate"
                    type='number'
                    onKeyPress={
                      (event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Iconify icon="ic:baseline-percent" />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Controller
                name="tax"
                control={control}
                render={({ field }) => (
                  <RHFTextField
                    {...field}
                    label="Enter Tax amount"
                    onKeyPress={
                      (event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }
                    }
                    type='number'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Iconify icon="ic:baseline-percent" />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />

            </Stack>
            <Stack direction='row' spacing={2} >
              <Controller
                name="tip"
                control={control}
                render={({ field }) => (
                  <RHFTextField
                    {...field}
                    label="Enter Tip Amount"
                    onKeyPress={
                      (event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }
                    }
                    type='number'
                  />
                )}
              />
              <Controller
                name="subtotal"
                control={control}
                render={({ field }) => (
                  <RHFTextField
                    {...field}
                    label="SubTotal Amount"
                    type='number'
                    disabled
                  />
                )}
              />
            </Stack>

            <Controller
              name="total"
              control={control}
              render={({ field }) => (
                <div style={{ color: 'red' }}>
                  <RHFTextField
                    {...field}
                    label="Total Amount"
                    type='number'
                    disabled
                  />
                </div>
              )}
            />
          </Box>
          <DialogActions>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </DialogActions>
        </DialogContent>

      </FormProvider>
    </Dialog >
  );
}

SaleOrderDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  currentCustomer: PropTypes.object,
  saleinfo: PropTypes.array,
  refetch: PropTypes.func
};
