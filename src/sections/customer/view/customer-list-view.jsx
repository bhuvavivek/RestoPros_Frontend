


import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useState } from 'react';

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

import { useGetCustomers } from 'src/api/customers';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  useTable,
} from 'src/components/table';

import CreateCustomerDialog from '../create-customer';
import CustomerTableFiltersResult from '../customer-table-filters-result';
import CustomerTableRow from '../customer-table-row';
import CustomerTableToolbar from '../customer-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'CustomerName' },
  { id: 'email', label: 'EmailAddress' },
  { id: 'phone', label: 'PhoneNumber', width: 160 },
  { id: '', width: 88 },
];


const defaultFilters = {
  name: '',
  emailAddress: '',
  phoneNumber: ''
};

// ----------------------------------------------------------------------

export default function CustomerListView() {


  const table = useTable();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [search, setSearch] = useState()
  const [filters, setFilters] = useState(defaultFilters);

  const [limit, setLimit] = useState(5);
  const { customers, customersLoading, customersEmpty, totalDocuments } = useGetCustomers({ limit, ...(search && { search }) });

  const [currentCustomer, setCurrentCustomer] = useState();

  const confirm = useBoolean();
  const upload = useBoolean();




  // handle popupclose
  const handleClose = () => {
    setCurrentCustomer()
    upload.onFalse()
  }

  // code for pagination
  const handlePageChange = useCallback((event, newPage) => {
    // Call the original onChangePage function
    table.onChangePage(event, newPage);

    setLimit((newPage + 1) * table.rowsPerPage)

  }, [table]);

  //  here i m fetching category data and set data
  useEffect(() => {
    if (customers.length) {
      setTableData(customers);
    }
  }, [customers]);

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

  const notFound = (!dataFiltered.length && canReset) || customersEmpty;

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
      const data = tableData.find(item => item._id === id);
      setCurrentCustomer(data);
    },
    [upload, tableData]
  );



  // this is a code for delete a row
  const handleDeleteRow = useCallback(
    async (id) => {

      try {
        const response = await axiosInstance.delete(endpoints.customer.delete(id))
        if (response.status === 200) {
          const deleteRow = tableData.filter((row) => row._id !== id);
          setTableData(deleteRow);
          table.onUpdatePageDeleteRow(dataInPage.length);
        }
      } catch (error) {
        console.log(error)
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
    setSearch();
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
              name: 'Service',
              href: paths.dashboard.product.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={upload.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Customer
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>

          <CustomerTableToolbar
            filters={filters}
            onFilters={handleFilters}
            setSearch={setSearch}
          />

          {canReset && (
            <CustomerTableFiltersResult
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
                  {customersLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <CustomerTableRow
                            key={row._id}
                            row={row}
                            selected={table.selected.includes(row._id)}
                            onSelectRow={() => table.onSelectRow(row._id)}
                            onDeleteRow={() => handleDeleteRow(row._id)}
                            onEditRow={() => handleEditRow(row._id)}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {/* pagination */}
          <TablePaginationCustom
            count={totalDocuments}
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

      <CreateCustomerDialog open={upload.value} onClose={handleClose} title={`${!currentCustomer ? 'Create Customer' : 'Edit Customer'}`} currentCustomer={currentCustomer} />


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
    const nameMatch = name ? customer?.name?.toLowerCase().includes(name.toLowerCase()) : true;
    const emailAddressMatch = emailAddress ? customer?.email?.toLowerCase().includes(emailAddress.toLowerCase()) : true;
    const phoneNumberMatch = phoneNumber ? customer?.phone?.toString().includes(phoneNumber.toString()) : true;
    return nameMatch || emailAddressMatch || phoneNumberMatch;
  });


  return inputData;


}
