import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Stack } from '@mui/system';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';

export default function CreateCustomerDialog({ title = 'Create Service', open, onClose, currentCustomer, ...other }) {


  const NewCustomerSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email must be a valid email address'),
    phoneNumber: Yup.number().required('Phone number is required'),
  });

  const defaultValues = useMemo(() => ({
    name: currentCustomer?.name || '',
    email: currentCustomer?.email,
    phoneNumber: currentCustomer?.phone,
  }), [currentCustomer])


  const methods = useForm({
    resolver: yupResolver(NewCustomerSchema),
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

  useEffect(() => {
    setValue('name', currentCustomer?.name || '');
    setValue('email', currentCustomer?.email);
    setValue('phoneNumber', currentCustomer?.phone)
  }, [currentCustomer, setValue])


  const onSubmit = handleSubmit(async (data) => {
    try {

      const requestData = {
        name: data.name,
        email: data.email,
        phone: data.phoneNumber,
      }

      const URL = !currentCustomer ? endpoints.customer.add : endpoints.customer.edit(currentCustomer._id);

      const response = !currentCustomer ? await axiosInstance.post(URL, requestData) : await axiosInstance.put(URL, requestData);

      const StatusCode = !currentCustomer ? 201 : 200;
      if (response.status === StatusCode) {
        reset();
        enqueueSnackbar(!currentCustomer ? 'Create success!' : 'Update success!');
        onClose();
      }
    } catch (error) {
      enqueueSnackbar('Please Try Again!!', { variant: 'error' })
      console.error(error);
    }
  });




  const handlePopupClose = () => {
    reset();
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
            <RHFTextField name="name" label="Customer Name" />
            <RHFTextField name="email" label="Email Address" />
            <RHFTextField name="phoneNumber" label="Phone Number" />
          </Box>
          <DialogActions>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentCustomer ? 'Create Customer' : 'Save Changes'}
              </LoadingButton>
            </Stack>

          </DialogActions>
        </DialogContent>

      </FormProvider>
    </Dialog >
  );
}

CreateCustomerDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  currentCustomer: PropTypes.object,
};
