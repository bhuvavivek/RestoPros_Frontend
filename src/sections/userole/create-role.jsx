import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { mutate } from 'swr';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/system';

import axiosInstance, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';

export default function CreateRoleDialog({ title = 'Create Role', open, onClose, editData, ...other }) {

  const [roleName, setroleName] = useState('');

  useEffect(() => {
    if (editData) {
      setroleName(editData.name || '')
    }
  }, [editData])




  const handlePopupClose = () => {
    setroleName('')
    onClose()
  }

  const handleSubmit = async () => {
    const isEdit = editData !== null;
    try {



      const response = isEdit
        ? await axiosInstance.put(endpoints.role.edit(editData._id), {
          type: roleName
        })
        : await axiosInstance.post(endpoints.role.add, {
          type: roleName
        });

      const isSuccess = isEdit ? response.status === 200 : response.status === 201;

      if (isSuccess) {
        const newRoleData = {
          type: roleName,
        };

        // Trigger revalidation to update the cache
        mutate(
          endpoints.role.list,
          async (data) => ({
            ...data,
            roles: [...data.roles, newRoleData],
          }),
          false
        );
        setroleName('');
        enqueueSnackbar(isEdit ? "Role Updated" : "Role Created", 'success');
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };




  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handlePopupClose} {...other}>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
          {title}
        </DialogTitle>
        <Iconify icon="ep:close-bold" onClick={handlePopupClose} sx={{ cursor: "pointer", mr: 4 }} />
      </Stack>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <TextField fullWidth name="roleName" label="Role Name" sx={{ mb: 3 }} value={roleName} onChange={(e) => setroleName(e.target.value)} />
        <DialogActions>
          <Button variant="contained" startIcon={<Iconify icon="eva:cloud-upload-fill" />} onClick={handleSubmit}>
            {editData != null ? "Edit Role" : "Create Role"}
          </Button>
        </DialogActions>
      </DialogContent>

    </Dialog >
  );
}

CreateRoleDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  editData: PropTypes.object,
};
