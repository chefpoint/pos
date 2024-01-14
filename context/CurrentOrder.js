import { useState, createContext, useContext } from 'react';
import { Appstate } from './Appstate';
import orderManager from '../services/orderManager';

export const CurrentOrder = createContext();

export default function CurrentOrderProvider({ children }) {
  //

  const { device } = useContext(Appstate);

  // Order
  const [items, setItems] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [customer, setCustomer] = useState();
  const [card, setCard] = useState(null);
  const [totals, setTotals] = useState(null);
  const [payment, setPayment] = useState(null);

  // CONTEXT
  const contextValue = {
    // Current order items
    items: items,
    hasItems: !(items === null || items === undefined || items.length < 1),

    // Current order discounts
    discounts: discounts,
    hasDiscounts: !(discounts === null || discounts === undefined || discounts.length < 1),

    // Current order customer
    customer: customer,
    hasCustomer: !(customer === null || customer === undefined),
    setCustomer: (c) => {
      setCustomer(c);
      setCard(null);
    },

    // Current order card
    card: card,
    hasCard: !(card === null || card === undefined),
    setCard: setCard,

    // Current order total
    totals: totals,
    // total_string: (value) => value.toFixed(2) + '€',

    // Current order payment
    payment: payment,
    setPayment: setPayment,

    // Helper functions
    addItem: function (product, variation, qty) {
      const updatedOrderItems = orderManager.addProductVariationToCurrentOrder(items, product, variation, qty);
      setItems(updatedOrderItems);
      const validDiscounts = orderManager.getValidDiscountsForCurrentOrder(updatedOrderItems, device.discounts);
      setDiscounts(validDiscounts);
      const updatedOrderTotals = orderManager.calculateOrderTotals(updatedOrderItems, validDiscounts);
      setTotals(updatedOrderTotals);
    },

    changeItem: function (orderItem, product, variation, qty) {
      let updatedOrderItems = orderManager.removeItemFromCurrentOrder(items, orderItem);
      updatedOrderItems = orderManager.addProductVariationToCurrentOrder(updatedOrderItems, product, variation, qty);
      setItems(updatedOrderItems);
      const validDiscounts = orderManager.getValidDiscountsForCurrentOrder(updatedOrderItems, device.discounts);
      setDiscounts(validDiscounts);
      const updatedOrderTotals = orderManager.calculateOrderTotals(updatedOrderItems, validDiscounts);
      setTotals(updatedOrderTotals);
    },

    removeItem: function (orderItem) {
      const updatedOrderItems = orderManager.removeItemFromCurrentOrder(items, orderItem);
      setItems(updatedOrderItems);
      const validDiscounts = orderManager.getValidDiscountsForCurrentOrder(updatedOrderItems, device.discounts);
      setDiscounts(validDiscounts);
      const updatedOrderTotals = orderManager.calculateOrderTotals(updatedOrderItems, validDiscounts);
      setTotals(updatedOrderTotals);
    },

    clear: function () {
      setItems([]);
      setDiscounts([]);
      setCustomer();
      setCard();
      setTotals();
      setPayment();
    },
  };

  return <CurrentOrder.Provider value={contextValue}>{children}</CurrentOrder.Provider>;
}
