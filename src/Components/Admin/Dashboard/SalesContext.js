import { createContext, useContext } from 'react';

export const SalesTabContext = createContext();
export const useSalesTab = () => useContext(SalesTabContext);
