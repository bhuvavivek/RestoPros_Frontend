import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';

import { getStorage, useLocalStorage } from 'src/hooks/use-local-storage';

import { FoodCartContext } from './food-cart-context';



// ----------------------------------------------------------------------


const STORAGE_KEY = 'foodCheckout';

const initialState = {
  items: [],
  total: 0,
  totalItems: 0,
  pickedTable: {},
  orderType: 'dinning',
  customerId: '',
};

export function FoodCartProvider({ children }) {


  const { state, update, reset } = useLocalStorage(STORAGE_KEY, initialState)


  const calculateTotal = useCallback(() => {
    let total = 0;
    if (state.items) {
      total = state.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    }
    update('total', total);
  }, [state.items, update]);


  const onGetCart = useCallback(() => {
    const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    update('totalItems', totalItems);
    calculateTotal();
  }, [state.items, update, calculateTotal]);

  useEffect(() => {
    const restored = getStorage(STORAGE_KEY);
    if (restored) {
      onGetCart();
    }
  }, [onGetCart]); // Only call onGetCart when state.items changes



  const onAddToCart = useCallback(
    (newItem) => {
      let updatedItems = state.items.map((item) => {
        if (item._id === newItem._id) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      if (!updatedItems.some((item) => item._id === newItem._id)) {
        updatedItems = [...updatedItems, { ...newItem, quantity: 1 }];
      }

      update('items', updatedItems);
      calculateTotal();
    },
    [update, state.items, calculateTotal]
  );

  const onDeleteCart = useCallback(
    (itemId) => {
      const updatedItems = state.items.filter((item) => item._id !== itemId);

      update('items', updatedItems);
      calculateTotal();
    },
    [update, state.items, calculateTotal]
  );

  const onIncreaseQuantity = useCallback(
    (itemId) => {
      const updatedItems = state.items.map((item) => {
        if (item._id === itemId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      calculateTotal();
      update('items', updatedItems);
    },
    [update, state.items, calculateTotal]
  );

  const onDecreaseQuantity = useCallback(
    (itemId) => {
      let updatedItems = state.items.map((item) => {
        if (item._id === itemId) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
      // Filter out items with quantity of 0 or less
      updatedItems = updatedItems.filter(item => item.quantity > 0);
      update('items', updatedItems);
      calculateTotal();
    },
    [update, state.items, calculateTotal]
  );

  const onReset = useCallback(() => {

    reset();
    // router.replace(paths.product.root);

  }, [reset]);

  // for set and update a table
  const setPickedTable = useCallback(
    (table) => {
      update('pickedTable', table);
    },
    [update]
  );

  // for set and update orderType

  const setOrderType = useCallback((orderType) => {
    update('orderType', orderType);
  }, [update])

  // for set a customerId

  const setCustomerId = useCallback((customerId) => {
    update('customerId', customerId)
  }, [update])

  const memoizedValue = useMemo(
    () => ({
      ...state,
      //
      onAddToCart,
      onDeleteCart,
      //
      onIncreaseQuantity,
      onDecreaseQuantity,

      //
      onReset,

      //
      setPickedTable,
      setOrderType,
      setCustomerId
    }),
    [

      onAddToCart,
      onDecreaseQuantity,
      onDeleteCart,

      onIncreaseQuantity,

      onReset,
      state,
      setPickedTable,
      setOrderType,
      setCustomerId
    ]
  );

  return <FoodCartContext.Provider value={memoizedValue}>{children}</FoodCartContext.Provider>;
}

FoodCartProvider.propTypes = {
  children: PropTypes.node,
};
