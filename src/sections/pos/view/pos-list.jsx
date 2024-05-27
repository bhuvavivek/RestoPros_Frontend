import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { Autocomplete, Button, InputAdornment, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/system';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetCategories } from 'src/api/category';
import { useGetCustomers } from 'src/api/customers';
import { useGetFoodItems } from 'src/api/food-items';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import CreateCustomerDialog from 'src/sections/customer/create-customer';

import { useFoodCartContext } from '../context';
import PosCartView from '../pos-cart';
import PosCategoryDetail from '../pos-category-list';
import PosItemDetail from '../pos-item-list';
import PosItemSkeleton from '../pos-item-skeleton';
import PosTableDialog from '../pos-popup';




export default function PosListView({ id, sale }) {

  const settings = useSettingsContext()

  const { categories } = useGetCategories();

  const [selectedCategory, setSelectedCategory] = useState(null);
  // const expandedQuery = useGetQueryParamsData({ category: selectedCategory ? selectedCategory._id : null });



  const defaultFilter = {
    search: ''
  }

  const [filter, setFilters] = useState(defaultFilter);
  const queryParameters = { expand: true, limit: 1000 };

  if (filter.search) {
    queryParameters.search = filter.search;
  } else if (selectedCategory) {
    queryParameters.category = selectedCategory._id;
  }

  const { FoodItems, FoodItemsLoading } = useGetFoodItems(queryParameters);

  const [customerSearch, setCustomerSearch] = useState();

  const { customers } = useGetCustomers({ limit: 50, ...(customerSearch && { search: customerSearch }) });
  const [open, setOpen] = useState(false);

  const { pickedTable, setCustomerId, orderType, customerId, items, onReset, setPickedTable, setOrderType, onAddMultipleToCart, onClearItems } = useFoodCartContext()

  const [customerOptions, setCustomerOptions] = useState(customers);



  const [isKot, setIsKot] = useState(false)
  const handlesetIsKot = (value) => setIsKot(value);

  const upload = useBoolean();
  const navigate = useNavigate('');


  useEffect(() => {
    if (id && sale) {
      onClearItems()
      onReset();
      setPickedTable(sale?.table);
      setOrderType(sale?.type);
      setCustomerId(sale?.customer?._id);

      const filteredItems = [];
      sale?.orderList?.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          filteredItems.push(item);
        }
      });
      onAddMultipleToCart(filteredItems)
      console.log(filteredItems)
    }
  }, [id, sale]);

  useEffect(() => {
    if (customerSearch && customerSearch.trim() !== "") {
      setCustomerOptions(customers.filter(
        customer =>
          // customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
          customer.phone.toString().toLowerCase().includes(customerSearch.toString().toLowerCase())
      ));
    } else {
      setCustomerOptions(customers);
    }
  }, [customerSearch, customers])



  useEffect(() => {
    if (pickedTable) {
      if (Object?.keys(pickedTable)?.length === 0 && !id) {
        setOpen(true);
      }
    }
  }, [pickedTable, id])


  const closePopUp = () => {
    setOpen(false);
  }



  // select the category
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);

  }


  // function for createOrder

  const handleOrderSubmit = async () => {
    try {

      let response;

      if (id && sale) {

        // for update order
        const UpdateOrders = items.map((item) => {
          const existsInSale = sale?.orderList?.some(saleItem => saleItem._id === item._id);

          return {
            item_id: existsInSale ? item.item_id : item._id,
            quantity: item.quantity,
            ...(existsInSale && { _id: item._id }),
          };
        });

        response = await axiosInstance.patch(endpoints.sales.addItem(id), {
          type: orderType,
          table_id: pickedTable?._id,
          customer_id: customerId,
          Orders: UpdateOrders
        });
      } else {

        // for new order
        const NewOrders = items.map((item) => ({
          item_id: item?._id,
          quantity: item?.quantity
        }));


        response = await axiosInstance.post('/api/order/create', {
          type: orderType,
          table_id: pickedTable._id,
          customer_id: customerId,
          Orders: NewOrders
        });
      }

      const statuscode = id ? 200 : 201;

      if (response.status === statuscode) {
        if (isKot) {
          const orderId = response?.data?.data?.OrderData?._id
          navigate(`/${orderId}/order-bill`)
          setIsKot(false);
        }
        enqueueSnackbar(`Order ${id ? 'Updated' : 'Created'} Successfully!!`)
        if (id) {
          navigate(`/dashboard/sale/${id}/edit`)
        }
        onReset()
      }
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Please Try Again Order Not Created!!', { variant: 'error' })
    }
  }


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}  >
      {/* pos search bar menu */}
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', lg: 'row' }} // Adjusted this line
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filter.search}
            onChange={(event) => setFilters({ ...filter, search: event.target.value })}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <Autocomplete
            disablePortal
            options={customers}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="SelectCustomer" />}
            onChange={(event, value) => setCustomerId(value?._id)}
            onInputChange={(event, newInputValue) => {
              setCustomerSearch(newInputValue);
            }}
            filterOptions={(options, params) => {
              const filtered = options.filter((option) => (
                option.name?.toLowerCase().includes(params.inputValue.toLowerCase()) ||
                option?.email?.toLowerCase().includes(params.inputValue.toLowerCase()) ||
                option?.phone?.toString().includes(params.inputValue)
              ));

              return filtered;
            }}
          />

        </Stack>

        <Stack direction='row' sx={{ width: 1 }} alignItems="center" spacing={2}>
          <Button
            onClick={
              () => {
                setOpen(true);
              }
            }
            sx={{ fontSize: '15px', paddingTop: '10px', paddingBottom: '10px', width: 1 }}
            variant="contained"
          >
            Edit Table
          </Button>
          <Button
            onClick={upload.onTrue}
            sx={{ fontSize: '15px', paddingTop: '10px', paddingBottom: '10px', width: { xs: 1, lg: '480px' } }}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Customer
          </Button>
          <Button
            variant="contained"
            sx={{ fontSize: '15px', paddingTop: '10px', paddingBottom: '10px', width: 1 }}
            onClick={handleOrderSubmit}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
      {/* PosCate categoryDetail component */}
      <PosCategoryDetail list={categories} handleCategorySelect={handleCategorySelect} />


      <Grid container spacing={2}>

        {/* PosItemDetail component taking 8 columns */}
        <Grid item xs={8}>
          <Box
            sx={{
              height: '100%',
              maxHeight: '500px',
              overflowY: 'auto',
              '&::-webskit-scrollbar': {
                display: 'none'
              }
            }}
          >
            {FoodItemsLoading ? <PosItemSkeleton /> : <PosItemDetail FoodItems={FoodItems} />}
          </Box>
        </Grid>

        {/* Another component taking 4 columns */}
        <Grid item xs={4} >
          <PosCartView handlesetIsKot={handlesetIsKot} isKot={isKot} />
        </Grid>
      </Grid>

      <PosTableDialog open={open} onClose={closePopUp} />
      <CreateCustomerDialog open={upload.value} onClose={upload.onFalse} title="Create Customer" />


    </Container>



  );
}



PosListView.propTypes = {
  id: PropTypes.string,
  sale: PropTypes.object
}
