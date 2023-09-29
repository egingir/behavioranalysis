import { createContext } from 'react';

export const StoreContext = createContext({
  isAdmin: false,
  users: [],
  testRegisters: [],
  behaviortests: [],
  behaviors1: [],
  UpdateBehaviors1: () => {},
  UpdateBehaviortests: () => {},
  UpdateUsers: () => {},
  UpdateEverything: (school) => {},
  UpdateRegister: (registerInfo) => {},

});


