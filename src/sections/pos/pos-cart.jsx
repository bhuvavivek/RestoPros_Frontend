import PropTypes from 'prop-types';

import { Avatar, Card, FormControlLabel, ListItem, ListItemText, Switch, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

import { fCurrency } from 'src/utils/format-number';

import PosIncrementerButton from "./common/pos-incrementer-button";
import { useFoodCartContext } from './context';




export default function PosCartView({ sx, handleCategorySelect, isKot, handlesetIsKot, ...other }) {

  const { items, onIncreaseQuantity, onDecreaseQuantity, onDeleteCart, total } = useFoodCartContext();


  return (

    <Box sx={{
      height: '100%', maxHeight: '500px', overflowY: 'auto', '&::-webskit-scrollbar': {
        display: 'none'
      }
    }}>
      <Card sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        p: (theme) => theme.spacing(3, 2, 3, 3),
      }}>
        <FormControlLabel
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
          control={
            <Switch
              size='medium'
              value={isKot}
              onChange={(e) => {
                handlesetIsKot(e.target.checked);
              }}
            />
          }
          label={<Typography variant="h6"> Want KOT ?</Typography>}
        />
        {items?.map((item) => <FoodItemCardList key={item._id} item={item} onIncreaseQuantity={onIncreaseQuantity} onDecreaseQuantity={onDecreaseQuantity} onDeleteCart={onDeleteCart} />)}
        <Stack direction="row" justifyContent="space-around" alignItems="center" sx={{ width: 1, marginTop: 3, gap: 15 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Total
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {fCurrency(total) || '$0'}
          </Typography>
        </Stack>
      </Card>
    </Box>

  );
}

PosCartView.propTypes = {
  sx: PropTypes.object,
  handleCategorySelect: PropTypes.func,
  handlesetIsKot: PropTypes.func,
  isKot: PropTypes.bool
};


function FoodItemCardList({ item, onIncreaseQuantity, onDecreaseQuantity, onDeleteCart }) {

  return (
    <ListItem onClick={() => onDeleteCart(item._id)} sx={{ cursor: 'pointer' }}>
      <Avatar alt='demo' src={item?.pictures?.length > 0 ? item?.pictures[0] : 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} sx={{ width: 48, height: 48, mr: 2 }} />

      <ListItemText
        primary={item?.name || item?.menuItems?.itemName}
        secondary={
          <>
            {fCurrency(item?.price)}
          </>
        }
        primaryTypographyProps={{
          noWrap: true,
          typography: 'subtitle2',
        }}
        secondaryTypographyProps={{
          mt: 0.5,
          noWrap: true,
          display: 'flex',
          component: 'span',
          alignItems: 'center',
          typography: 'caption',
          color: 'text.disabled',
        }}
      />

      <Stack direction="row">
        <Stack spacing={1}>
          <PosIncrementerButton
            name="quantity"
            quantity={item.quantity} // Use quantity state
            disabledDecrease={item.quantity <= 1}
            onIncrease={(event) => {
              event.stopPropagation();
              onIncreaseQuantity(item._id);
            }} // Update quantity state
            onDecrease={(event) => {
              event.stopPropagation();
              onDecreaseQuantity(item._id)
            }} // Update quantity state
          />

        </Stack>
      </Stack>

    </ListItem>
  )
}

FoodItemCardList.propTypes = {
  item: PropTypes.shape({
    price: PropTypes.number,
    quantity: PropTypes.number,
    name: PropTypes.string,
    pictures: PropTypes.string,
    _id: PropTypes.string,

    // Add other properties of item here as needed
  }),
  onIncreaseQuantity: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  onDeleteCart: PropTypes.func,
};
