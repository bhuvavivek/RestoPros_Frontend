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

import { useGetCategories } from 'src/api/category';
import { useGetMostSoldReport } from 'src/api/report';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { convertToUTCDate } from 'src/components/custom-date-range-picker';
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

import SoldReportTableFiltersResult from '../sold-report-filters-result';
import SoldReportTableRow from '../sold-report-table-row';
import SoldReportTableToolbar from '../sold-report-table-toolbar';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'MenuItem' },
  { id: 'description', label: 'Description' },
  { id: 'count', label: 'Count' },
  { id: '', width: 88 },
];


const defaultFilters = {
  name: '',
  description: '',
  categoryName: '',
  category: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function SoldReportListView() {


  const table = useTable();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [duration, setDuration] = useState();
  const [search, setSearch] = useState();
  const [categoryId, setCategoryId] = useState();

  const { soldReport, soldLoading, soldEmpty } = useGetMostSoldReport({
    ...(duration && { duration: duration.value }),
    ...(search && { name: search }),
    ...(categoryId && { category: categoryId.value }),
    ...((duration && duration.value === 'manual') ? (filters.startDate && { startDate: convertToUTCDate(filters.startDate) }) : {}),
    ...((duration && duration.value === 'manual') ? (filters.endDate && { endDate: convertToUTCDate(filters.endDate) }) : {})
  });
  const { categories } = useGetCategories();


  const confirm = useBoolean();
  const upload = useBoolean();


  // category Filter options
  const CATEGORY_OPTIONS = categories?.map((category) => ({
    value: category._id,
    label: category.name,
  }))




  // // code for pagination
  // const handlePageChange = useCallback((event, newPage) => {
  //   // Call the original onChangePage function
  //   table.onChangePage(event, newPage);

  //   setLimit((newPage + 1) * table.rowsPerPage)

  // }, [table]);




  //  here i m fetching category data and set data
  useEffect(() => {
    if (soldReport.length) {
      setTableData(soldReport);
    }
  }, [soldReport]);


  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

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

  const notFound = (!dataFiltered.length && canReset) || soldEmpty;

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

  // this is a code for delete a row
  const handleDeleteRow = useCallback(
    async (id) => {

      try {
        const response = await axiosInstance.delete(endpoints.foodItem.delete(id))
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
    setSearch()
    setCategoryId()
    setDuration()
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>

        {/* this is  my category head code  */}
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.mainDashboard },
            {
              name: 'sold-report',
              href: paths.dashboard.report.soldReport,
            },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>

          <SoldReportTableToolbar
            filters={filters}
            setSearch={setSearch}
            onFilters={handleFilters}
            categoryOptions={CATEGORY_OPTIONS}
            setDuration={setDuration}
            setCategoryId={setCategoryId}
            categoryId={categoryId}
            duration={duration}
            dateError={dateError}
          />

          {canReset && (
            <SoldReportTableFiltersResult
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
                  {soldLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
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
                          <SoldReportTableRow
                            key={row._id}
                            row={row}
                            selected={table.selected.includes(row._id)}
                            onSelectRow={() => table.onSelectRow(row._id)}
                            onDeleteRow={() => handleDeleteRow(row._id)}
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


  const { name, description, categoryName, category } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((menu) => {
      const nameMatch = name ? menu?.name.toLowerCase().includes(name?.toLowerCase()) : true;
      const descriptionMatch = description ? menu?.description.toLowerCase().includes(description?.toLowerCase()) : true;
      const categoryMatch = categoryName ? menu.categories?.some((item) => item.name.toLowerCase().includes(categoryName.toLowerCase())) : true;

      return nameMatch || descriptionMatch || categoryMatch;
    });
  }

  if (category?.length > 0 && category) {
    inputData = inputData.filter((item) =>
      item.categories?.some(categoryItem => category.includes(categoryItem.name))
    );
  }

  return inputData;
}
