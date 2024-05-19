import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';


// ----------------------------------------------------------------------

export default function PosCategoryDetail({ list, sx, handleCategorySelect, ...other }) {

  return (
    <Box sx={{ py: 2, ...sx, width: '100%' }} {...other}>
      <Box sx={{
        display: 'flex', gap: '20px', overflowX: 'auto', '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}>
        {list?.map((item) => (
          <PosItem
            key={item._id}
            item={item}
            onClick={() => handleCategorySelect(item)}
          />
        ))}
      </Box>

    </Box>




  );
}

PosCategoryDetail.propTypes = {
  list: PropTypes.array,
  sx: PropTypes.object,
  handleCategorySelect: PropTypes.func,
};

// ----------------------------------------------------------------------

function PosItem({ item, onClick }) {
  const { image, name } = item;

  return (

    <IconButton onClick={onClick} sx={{ width: 'fit-content' }} disableRipple>
      <Paper
        sx={{
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.neutral',
          cursor: 'pointer',
          width: 'fit-content',
          px: 2
        }}
      >
        <Stack
          spacing={2}
          sx={{
            px: 1.5,
            pb: 2,
            pt: 1.5,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={image} sx={{ width: 56, height: 56 }} />
            <ListItemText
              primary={name}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
                color: 'white',
              }}
            />
          </Stack>

        </Stack>
      </Paper>
    </IconButton>

  );
}

PosItem.propTypes = {
  item: PropTypes.object,
  onClick: PropTypes.func
};
