import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetSales } from 'src/api/sales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  customEmptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  useTable,
} from 'src/components/table';

import SaleTableFiltersResult from '../sale-table-filters-result';
import SaleTableRow from '../sale-table-row';
import SaleTableToolbar from '../sale-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'orderno', label: 'OrdeNo' },
  { id: 'customerDetail', label: 'orderinfo' },
  { id: 'date', label: 'Date' },
  { id: 'subtotal', label: 'SubTotal' },
  { id: 'discount', label: 'Discount' },
  { id: 'tip', label: 'Tip' },
  { id: 'tax', label: 'Tax' },
  { id: 'created_by', label: 'Created By' },
  { id: 'status', label: 'Status' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  emailAddress: '',
  phoneNumber: '',
};

// ----------------------------------------------------------------------

export default function SaleListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [limit, setLimit] = useState(5);
  const [tablepage, setTablePage] = useState(1);

  const { sales, salesLoading, salesEmpty, totaldocuments } = useGetSales({
    page: table.page + 1,
    per_page: table.rowsPerPage,
    expand: 'true',
  });

  const [currentCustomer, setCurrentCustomer] = useState();

  const confirm = useBoolean();
  const upload = useBoolean();
  const navigate = useNavigate();

  // code for pagination
  const handlePageChange = useCallback(
    (event, newPage) => {
      // Call the original onChangePage function
      table.onChangePage(event, newPage);

      setLimit((newPage + 1) * table.rowsPerPage);
    },
    [table]
  );

  //  here i m fetching category data and set data
  useEffect(() => {
    if (sales.length) {
      setTableData(sales);
    }
  }, [sales]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || salesEmpty;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  // edit Category Row

  const handleEditRow = useCallback(
    (id) => {
      upload.onTrue();
      const data = tableData.find((item) => item._id === id);
      setCurrentCustomer(data);
      navigate(`/dashboard/sale/${id}/edit`);
    },
    [upload, tableData, navigate]
  );

  // this is a code for delete a row
  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const response = await axiosInstance.delete(endpoints.customer.delete(id));
        if (response.status === 200) {
          const deleteRow = tableData.filter((row) => row._id !== id);
          setTableData(deleteRow);
          table.onUpdatePageDeleteRow(dataInPage.length);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [dataInPage.length, table, tableData]
  );

  // code for delete multiple rows
  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* this is  my category head code  */}
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Sale',
              href: paths.dashboard.sale.root,
            },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <SaleTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <SaleTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={3}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {salesLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered.map((row) => (
                        <SaleTableRow
                          key={row._id}
                          row={row}
                          selected={table.selected.includes(row._id)}
                          onSelectRow={() => table.onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          onEditRow={() => handleEditRow(row._id)}
                          onViewRow={() => handleEditRow(row._id)}
                        />
                      ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={customEmptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {/* pagination */}
          <TablePaginationCustom
            count={totaldocuments}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={(event) => {
              const newRowsPerPage = event.target.value;
              table.onChangeRowsPerPage(event);
              setLimit(newRowsPerPage);
            }}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      {/* <CreateCustomerDialog open={upload.value} onClose={handleClose} title={`${!currentCustomer ? 'Create Customer' : 'Edit Customer'}`} currentCustomer={currentCustomer} /> */}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, phoneNumber, emailAddress } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  inputData = inputData.filter((customer) => {
    const nameMatch = name
      ? customer?.customer?.name.toLowerCase().includes(name.toLowerCase())
      : true;
    const emailAddressMatch = emailAddress
      ? customer?.customer?.email?.toLowerCase().includes(emailAddress.toLowerCase())
      : true;
    const phoneNumberMatch = phoneNumber
      ? customer?.customer?.phone.toString().includes(phoneNumber.toString())
      : true;
    const orderNoMatch = name ? customer?.order_no?.toString().includes(name.toString()) : true;
    return nameMatch || emailAddressMatch || phoneNumberMatch || orderNoMatch;
  });

  return inputData;
}
