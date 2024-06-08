import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { mutate } from 'swr';

import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
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

export default function CreateFoodItemDialog({
  title = 'Create Menu',
  open,
  onClose,
  categories,
  expandedQuery,
  editData,
  ...other
}) {
  const [file, setFile] = useState(null);
  const [foodItemName, setFoodItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(null);
  const [categoryData, setCategoryData] = useState();

  // code for styling
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    if (!open) {
      setFile(null);
    }
  }, [open]);

  useEffect(() => {
    if (editData) {
      setFile(editData?.pictures[0]?.image || null);
      setFoodItemName(editData.name || '');
      setDescription(editData.description || '');
      setPrice(editData.price || '');
      setCategoryData(editData.categories?.[0]?._id || null);
    }
  }, [editData]);

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
    setFoodItemName();
    setDescription('');
    setFile(null);
    setCategoryData();
    setPrice();
    onClose();
  };

  const handleSubmit = async () => {
    const isEdit = editData !== null;
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('images', file);
      formData.append('images', file);
      formData.append('name', foodItemName);
      formData.append('price', price);
      formData.append('categories', categoryData);
      formData.append('categories', categoryData);

      const response = isEdit
        ? await axiosInstance.put(endpoints.foodItem.edit(editData._id), formData)
        : await axiosInstance.post(endpoints.foodItem.add, formData);

      if (response.status === 200) {
        const newItemData = {
          description,
          pictures: [file],
          price,
          name: foodItemName,
          categories: categoryData,
        };

        const mutateKey = expandedQuery
          ? [endpoints.foodItem.list, { params: expandedQuery }]
          : endpoints.foodItem.list;

        mutate(
          mutateKey,
          async (currentData) => ({
            ...currentData,
            menu: [...currentData.menu, newItemData],
          }),
          false
        );

        setDescription('');
        setFile(null);
        setPrice('');
        setCategoryData();
        setFoodItemName('');
        enqueueSnackbar(isEdit ? 'Item Updated' : 'Item Created', 'success');
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategoryData(value);
    console.log(value);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handlePopupClose} {...other}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{title}</DialogTitle>
        <Iconify
          icon="ep:close-bold"
          onClick={handlePopupClose}
          sx={{ cursor: 'pointer', mr: 4 }}
        />
      </Stack>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <TextField
          fullWidth
          name="foodItemName"
          label="Item Name"
          sx={{ mb: 3 }}
          value={foodItemName}
          onChange={(e) => setFoodItemName(e.target.value)}
        />

        <TextField
          fullWidth
          name="price"
          label="Price"
          sx={{ mb: 3 }}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Stack sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-multiple-name-label">Select Category</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={categoryData}
              onChange={handleChange}
              input={<OutlinedInput label="Select Category" />}
              MenuProps={MenuProps}
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <TextField
          fullWidth
          name="description"
          label="Item description"
          sx={{ mb: 3 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Upload
          name="image"
          file={file}
          onDrop={handleDropSingleFile}
          onDelete={() => setFile(null)}
        />
        <DialogActions>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={handleSubmit}
          >
            Create Item
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

CreateFoodItemDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  expandedQuery: PropTypes.object,
  categories: PropTypes.array,
  editData: PropTypes.object,
};
