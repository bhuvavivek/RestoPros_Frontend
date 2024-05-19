import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import { FormControlLabel, Switch, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetRoles } from 'src/api/roles';
import { useGetPermissions } from 'src/api/userpermission';

import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
} from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------


const MuiSwitchLarge = styled(Switch)(({ theme }) => ({
  width: 68,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      transform: "translateX(30px)",
    },
  },
  "& .MuiSwitch-thumb": {
    width: 32,
    height: 32,
  },
  "& .MuiSwitch-track": {
    borderRadius: 20 / 2,
  },
}));



export default function UserNewEditForm({ currentUser, id }) {
  const router = useRouter();

  const { roles } = useGetRoles()

  const { enqueueSnackbar } = useSnackbar();

  const { permissions } = useGetPermissions();

  const [enabledPermissions, setEnabledPermissions] = useState([]);


  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    password: Yup.string().required('Password is required'),
    role: Yup.object().shape({
      _id: Yup.string().required('Role ID is required'),
      type: Yup.string().required('Role type is required'),
    }).required('Role is required'),
  });

  const EditUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email must be a valid email address'),
    phoneNumber: Yup.number(),
    role: Yup.object().shape({
      _id: Yup.string(),
      type: Yup.string(),
    }),
  })

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      role: currentUser?.type || '',
    }),
    [currentUser]
  );

  const userSchema = id ? EditUserSchema : NewUserSchema;


  const methods = useForm({
    resolver: yupResolver(userSchema),
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

  const values = watch();


  useEffect(() => {
    if (currentUser) {
      setValue('name', currentUser?.name || "");
      setValue('email', currentUser?.email || "");
      setValue('phoneNumber', currentUser?.phone_no);
      setValue('role', currentUser?.type);
      setEnabledPermissions(currentUser?.permissions?.map((permission) => permission._id) || []);
    }
  }, [currentUser, setValue])


  const onSubmit = handleSubmit(async (data) => {
    try {

      const URL = id ? endpoints.user.edit(id) : endpoints.user.add;

      const RequestData = {
        email: data.email,
        password: data.password,
        phone_no: data.phoneNumber,
        name: data.name,
        type: data.role?._id,
        permissions: enabledPermissions
      }

      const response = id ? await axiosInstance.put(URL, RequestData) : await axiosInstance.post(URL, RequestData);

      const StatusCode = id ? 200 : 201;
      if (response.status === StatusCode) {
        setEnabledPermissions([])
        reset();
        enqueueSnackbar(id ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.users.root);
      }

    } catch (error) {
      enqueueSnackbar('Please Try Again!!', { variant: 'error' })
      console.error(error);
    }
  });


  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>

        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField name="password" label="Password" />
              <RHFAutocomplete
                name="role"
                label="Select a Role"
                options={roles}
                getOptionLabel={(role) => role?.type || ''}
                isOptionEqualToValue={(option, value) => option.type === value.type}
                renderOption={(_props_, _role_) => (
                  <li {..._props_} key={_role_._id}>
                    {_role_.type}
                  </li>
                )}
              />


            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>

        <Grid container spacing={3}>
          {permissions.map((permission) => (
            <Grid item xs={12} sm={6} md={3} key={permission._id}>
              <Card sx={{ paddingRight: '20px', paddingLeft: '20px' }}>
                <Stack direction="row" alignItems="center" justifyContent='space-between' spacing={2} sx={{ my: 2 }}>
                  <Typography variant="body1">{permission.type}</Typography>
                  <FormControlLabel
                    control={
                      <MuiSwitchLarge
                        color="primary"
                        checked={enabledPermissions.includes(permission._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEnabledPermissions(prevpermissions => [...prevpermissions, permission._id]);
                          } else {
                            setEnabledPermissions(prevpermissions => prevpermissions.filter(permissionId => permissionId !== permission._id));
                          }
                        }}
                      />
                    }
                  />
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
  id: PropTypes.string,
};
