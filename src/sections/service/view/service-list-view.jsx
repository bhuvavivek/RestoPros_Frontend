


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

import { useGetServices } from 'src/api/service';

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

import CreateServiceDialog from '../create-service';
import ServiceTableFiltersResult from '../service-table-filters-result';
import ServiceTableRow from '../service-table-row';
import ServiceTableToolbar from '../service-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Service TableName' },
  { id: 'description', label: 'Description' },
  { id: 'tableno', label: 'Table No', width: 160 },
  { id: '', width: 88 },
];


const defaultFilters = {
  name: '',
  description: '',
  tableno: ''
};

// ----------------------------------------------------------------------

export default function ServiceListView() {


  const table = useTable();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const { services, servicesLoading, servicesEmpty } = useGetServices();

  const [editData, setEditData] = useState(null);

  const confirm = useBoolean();
  const upload = useBoolean();


  // category Filter options
  const PUBLISH_OPTIONS = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];


  // handle popupclose
  const handleClose = () => {
    setEditData(null)
    upload.onFalse()
  }


  //  here i m fetching category data and set data
  useEffect(() => {
    if (services.length) {
      setTableData(services);
    }
  }, [services]);

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

  const notFound = (!dataFiltered.length && canReset) || servicesEmpty;

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
      setEditData(data);
    },
    [upload, tableData]
  );



  // this is a code for delete a row
  const handleDeleteRow = useCallback(
    async (id) => {

      try {
        const response = await axiosInstance.delete(endpoints.service.delete(id))
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
              New Service
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>

          <ServiceTableToolbar
            filters={filters}
            onFilters={handleFilters}
            publishOptions={PUBLISH_OPTIONS}

          />

          {canReset && (
            <ServiceTableFiltersResult
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
                  {servicesLoading ? (
                    [...Array(10)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                        .slice(
                          table.page * 10,
                          table.page * 10 + 10
                        )
                        .map((row) => (
                          <ServiceTableRow
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
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={10}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            iscustomer
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <CreateServiceDialog open={upload.value} onClose={handleClose} editData={editData} title={`${editData != null ? 'Edit Service' : 'Create Service'}`} />


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
  const { name, description, tableno } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  inputData = inputData.filter((service) => {
    const nameMatch = name ? service.name.toLowerCase().includes(name.toLowerCase()) : true;
    const descriptionMatch = description ? service.description.toLowerCase().includes(description.toLowerCase()) : true;
    const tableNoMatch = tableno ? service.table_no.toString().includes(tableno.toString()) : true;
    return nameMatch || descriptionMatch || tableNoMatch;
  });


  return inputData;


}
