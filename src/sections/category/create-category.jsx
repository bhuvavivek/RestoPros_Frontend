import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
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
import { Upload } from 'src/components/upload';

export default function CreateCategoryDialog({ title = 'Create Category', open, onClose, editData, ...other }) {
  const [file, setFile] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editData) {
      setCategoryName(editData.name || '')
      setDescription(editData.description || '')
      setFile(editData.image || null)
    }

  }, [editData])


  useEffect(() => {
    if (!open) {
      setFile(null);
    }
  }, [open]);

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setFile(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
  }, []);

  const handlePopupClose = () => {
    setCategoryName('')
    setDescription('')
    setFile(null)
    onClose()
  }

  const handleSubmit = async () => {
    const isEdit = editData !== null;
    try {
      const formData = new FormData();
      formData.append('name', categoryName);
      formData.append('description', description);
      formData.append('image', file);

      const response = isEdit
        ? await axiosInstance.put(endpoints.category.edit(editData._id), formData)
        : await axiosInstance.post(endpoints.category.add, formData);

      const isSuccess = isEdit ? response.status === 200 : response.status === 201;

      if (isSuccess) {
        const newCategoryData = {
          name: categoryName,
          description,
          image: file,
        };

        // Trigger revalidation to update the cache
        mutate(
          endpoints.category.list,
          async (data) => ({
            ...data,
            categories: [...data.categories, newCategoryData],
          }),
          false
        );

        setCategoryName(null);
        setDescription(null);
        setFile(null);
        enqueueSnackbar(isEdit ? "Category Updated" : "Category Created", 'success');
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
        <TextField fullWidth name="categoryName" label="Category name" sx={{ mb: 3 }} value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
        <TextField fullWidth name="description" label="Category description" sx={{ mb: 3 }} value={description} onChange={(e) => setDescription(e.target.value)} />
        <Upload name="image" file={file} onDrop={handleDropSingleFile} onDelete={() => setFile(null)} />
        <DialogActions>
          <Button variant="contained" startIcon={<Iconify icon="eva:cloud-upload-fill" />} onClick={handleSubmit}>
            {editData != null ? "Edit Category" : "Create Category"}
          </Button>
        </DialogActions>
      </DialogContent>

    </Dialog >
  );
}

CreateCategoryDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  editData: PropTypes.object,
};
