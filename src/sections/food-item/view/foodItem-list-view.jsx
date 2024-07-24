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
import { useGetQueryParamsData } from 'src/hooks/use-query';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetCategories } from 'src/api/category';
import { useGetFoodItems } from 'src/api/food-items';

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

import FoodItemTableFiltersResult from 'src/sections/food-item/food-item-filters-result';
import FoodItemTableRow from 'src/sections/food-item/food-item-table-row';
import FoodItemTableToolbar from 'src/sections/food-item/food-item-table-toolbar';

import CreateFoodItemDialog from '../create-food-item';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'MenuItem' },
  { id: 'categoryName', label: 'CategoryName' },
  { id: 'price', label: 'Price' },
  { id: 'description', label: 'Description', width: 160 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  description: '',
  categoryName: '',
  category: [],
};

// ----------------------------------------------------------------------

export default function FoodItemListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [limit, setLimit] = useState(5);
  const [custmPaginationQuery, setPaginationQuery] = useState({ limit });
  const expandedQuery = useGetQueryParamsData(custmPaginationQuery);
  const [search, setSearch] = useState();

  const { FoodItems, FoodItemsLoading, FoodItemsEmpty, totalDocuments } = useGetFoodItems({
    page: table.page + 1,
    limit: table.rowsPerPage,
    expand: 'true',
    ...(search && { search }),
  });
  const { categories } = useGetCategories();

  const [editData, setEditData] = useState(null);

  const confirm = useBoolean();
  const upload = useBoolean();

  // category Filter options
  const CATEGORY_OPTIONS = categories?.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  // code for pagination
  const handlePageChange = useCallback(
    (event, newPage) => {
      // Call the original onChangePage function
      table.onChangePage(event, newPage);

      setLimit((newPage + 1) * table.rowsPerPage);
    },
    [table]
  );

  // handle popupclose
  const handleClose = () => {
    setEditData(null);
    upload.onFalse();
  };

  //  here i m fetching category data and set data
  useEffect(() => {
    if (FoodItems.length) {
      setTableData(FoodItems);
    }
  }, [FoodItems]);

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

  const notFound = (!dataFiltered.length && canReset) || FoodItemsEmpty;

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
        const response = await axiosInstance.delete(endpoints.foodItem.delete(id));
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

  // edit Menu

  const handleEditRow = useCallback(
    (id) => {
      upload.onTrue();
      const data = tableData.find((item) => item._id === id);
      setEditData(data);
    },
    [upload, tableData]
  );

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
              name: 'FoodItem',
              href: paths.dashboard.foodItem,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={upload.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Item
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <FoodItemTableToolbar
            filters={filters}
            setSearch={setSearch}
            onFilters={handleFilters}
            categoryOptions={CATEGORY_OPTIONS}
          />

          {canReset && (
            <FoodItemTableFiltersResult
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
                  {FoodItemsLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered.map((row) => (
                        <FoodItemTableRow
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
                    emptyRows={customEmptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
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

      <CreateFoodItemDialog
        open={upload.value}
        onClose={handleClose}
        editData={editData}
        title={`${editData != null ? 'Edit Menu' : 'Create Menu'}`}
        categories={categories}
        expandedQuery={expandedQuery}
      />

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
      const descriptionMatch = description
        ? menu?.description.toLowerCase().includes(description?.toLowerCase())
        : true;
      const categoryMatch = categoryName
        ? menu.categories?.some((item) =>
            item.name.toLowerCase().includes(categoryName.toLowerCase())
          )
        : true;

      return nameMatch || descriptionMatch || categoryMatch;
    });
  }

  if (category?.length > 0 && category) {
    inputData = inputData.filter((item) =>
      item.categories?.some((categoryItem) => category.includes(categoryItem.name))
    );
  }

  return inputData;
}
