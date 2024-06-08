import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';

import { useFoodCartContext } from './context';

// ------------------------------------------------------

export default function PosItemDetail({ FoodItems }) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
      }}
    >
      {FoodItems?.map((item) => (
        <PosItem key={item._id} item={item} />
      ))}
    </Box>
  );
}

PosItemDetail.propTypes = {
  FoodItems: PropTypes.array,
};

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

function PosItem({ item }) {
  const { name, price, pictures } = item;
  const { onAddToCart } = useFoodCartContext();
  return (
    <Card
      onClick={() => {
        onAddToCart(item);
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: (theme) => theme.spacing(3, 2, 3, 3),
      }}
    >
      <Avatar
        alt={name}
        src={pictures.length > 0 && pictures[0]}
        sx={{ width: 48, height: 48, mr: 2 }}
      />

      <ListItemText
        primary={name}
        secondary={<>{fCurrency(price)}</>}
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
    </Card>
  );
}

PosItem.propTypes = {
  item: PropTypes.object,
};
