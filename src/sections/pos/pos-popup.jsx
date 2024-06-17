import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { LoadingIcon } from 'yet-another-react-lightbox';

import { Card, CardContent, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Stack } from '@mui/system';

import { useGetServices } from 'src/api/service';

import Iconify from 'src/components/iconify';

import { useFoodCartContext } from './context';

export default function PosTableDialog({
  title = 'Choose Table ',
  open,
  onClose,
  editData,
  ...other
}) {
  const { setOrderType } = useFoodCartContext();

  const handlePopupClose = () => {
    onClose();
  };

  const handleBookWithoutTable = () => {
    setOrderType('BookWithoutTable');
    onClose();
  };

  const { services, servicesError, refetch, servicesLoading } = useGetServices();

  if (servicesError) {
    console.log('Please Wait Sometime');
  }

  const handleOrderPickup = () => {
    setOrderType('pickup');
    onClose();
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (servicesLoading) {
    return <LoadingIcon />;
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} {...other}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{title}</DialogTitle>
        <Iconify
          icon="ep:close-bold"
          sx={{ cursor: 'pointer', mr: 4 }}
          onClick={handlePopupClose}
        />
      </Stack>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <Box>
          <Grid container spacing={3}>
            {services?.map((item) => (
              <TableCard key={item._id} item={item} handlePopupClose={onClose} />
            ))}
          </Grid>
        </Box>
        <DialogActions>
          <Button variant="contained" onClick={handleOrderPickup}>
            Pickup
          </Button>
          <Button variant="contained" onClick={handleBookWithoutTable}>
            Book Without Table
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

PosTableDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  editData: PropTypes.object,
};

function TableCard({ item, handlePopupClose }) {
  const { setPickedTable, pickedTable } = useFoodCartContext();

  const statusColor = item.status ? '#83f28f' : '#FFCCCB';

  const [activeColor, setActiveColor] = useState(statusColor || 'tranparent');

  useEffect(() => {
    if (item?._id === pickedTable?._id) {
      setActiveColor('#FFFFED');
    } else {
      setActiveColor(statusColor);
    }
  }, [item._id, pickedTable, item.status, statusColor]);
  return (
    <Grid item xs={4} key={item._id}>
      <Card
        sx={{ background: activeColor, boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' }}
        onClick={() => {
          if (item.status) {
            setPickedTable(item);
            handlePopupClose();
          }
        }}
      >
        <CardContent>
          <Typography variant="h6">{item.name}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

TableCard.propTypes = {
  item: PropTypes.object,
  handlePopupClose: PropTypes.func,
};
