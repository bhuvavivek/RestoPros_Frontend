import { format } from 'date-fns';
import PropTypes from 'prop-types';

import { Checkbox } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';

import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';


// ----------------------------------------------------------------------

export default function SaleTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const {
    order_no,
    subtotal,
    discount,
    tax,
    tip,
    status,
    created_by,
    table,
    createdAt,
    customer
  } = row;


  const handleCheckboxClick = (event) => {
    event.stopPropagation();
    onSelectRow();
  };


  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected} onClick={onViewRow} >

        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={handleCheckboxClick} />
        </TableCell>

        <TableCell>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {order_no}
          </Box>
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={customer?.name}
            secondary={table?.table_no}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(createdAt), 'dd MMM yyyy')}
            secondary={format(new Date(createdAt), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell> {fCurrency(subtotal)} </TableCell>
        <TableCell> {discount} </TableCell>
        <TableCell> {tip} </TableCell>
        <TableCell> {tax} </TableCell>


        <TableCell sx={{ whiteSpace: 'nowrap' }}>{created_by?.name}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'completed' && 'success') ||
              (status === 'pending' && 'warning') ||
              (status === 'cancelled' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer_id.name}</TableCell> */}

        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow >

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >


        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

SaleTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func
};
