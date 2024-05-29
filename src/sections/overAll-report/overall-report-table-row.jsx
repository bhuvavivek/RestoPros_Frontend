import { format } from 'date-fns';
import PropTypes from 'prop-types';

import { ListItemText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';

import { fCurrency, fPercent } from 'src/utils/format-number';

import Label from 'src/components/label';


// ----------------------------------------------------------------------

export default function OverallReportTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const {
    order_no,
    grand_total,
    subtotal,
    discount,
    tax,
    tip,
    status,
    createdAt,
    discountedAmount,
    taxAmount
  } = row;




  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
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



        <TableCell> {fCurrency(grand_total)} </TableCell>
        <TableCell> {fCurrency(subtotal)} </TableCell>
        <TableCell> {fPercent(discount)} </TableCell>
        <TableCell> {fCurrency(discountedAmount)} </TableCell>
        <TableCell> {fPercent(tax)} </TableCell>
        <TableCell> {fCurrency(taxAmount)} </TableCell>
        <TableCell> {tip} </TableCell>

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
      </TableRow>

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

OverallReportTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
