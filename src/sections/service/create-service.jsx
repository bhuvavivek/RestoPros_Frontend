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

export default function CreateServiceDialog({ title = 'Create Service', open, onClose, editData, ...other }) {

  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [tableNo, setTableNo] = useState('');

  useEffect(() => {
    if (editData) {
      setServiceName(editData.name || '')
      setDescription(editData.description || '')
      setTableNo(editData.table_no || '')
    }
  }, [editData])



  const handlePopupClose = () => {
    setServiceName('')
    setDescription('')
    setTableNo('')
    onClose()
  }

  const handleSubmit = async () => {
    const isEdit = editData !== null;
    try {
      const formData = new FormData();
      formData.append('name', serviceName);
      formData.append('description', description);
      formData.append('table_no', tableNo)

      const response = isEdit
        ? await axiosInstance.put(endpoints.service.edit(editData._id), formData)
        : await axiosInstance.post(endpoints.service.add, formData);

      const isSuccess = isEdit ? response.status === 200 : response.status === 201;

      if (isSuccess) {
        const newServiceData = {
          name: serviceName,
          description,
          table_no: tableNo
        };

        // Trigger revalidation to update the cache
        mutate(
          endpoints.category.list,
          async (data) => ({
            ...data,
            data: [...data.data, newServiceData],
          }),
          false
        );

        setServiceName(null);
        setDescription(null);
        setTableNo(null);
        enqueueSnackbar(isEdit ? "Service Updated" : "Service Created", 'success');
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
        <TextField fullWidth name="serviceName" label="Service name" sx={{ mb: 3 }} value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
        <TextField fullWidth name="description" label="Category description" sx={{ mb: 3 }} value={description} onChange={(e) => setDescription(e.target.value)} />
        <TextField fullWidth name="table_no" label="Table No" sx={{ mb: 3 }} value={tableNo} onChange={(e) => setTableNo(e.target.value)} />
        <DialogActions>
          <Button variant="contained" startIcon={<Iconify icon="eva:cloud-upload-fill" />} onClick={handleSubmit}>
            {editData != null ? "Edit Service" : "Create Service"}
          </Button>
        </DialogActions>
      </DialogContent>

    </Dialog >
  );
}

CreateServiceDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  editData: PropTypes.object,
};
