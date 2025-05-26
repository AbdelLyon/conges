import { create } from 'zustand';

import { User } from '@/services/types';



type UserStore = {

   currentUser: User | null;
   setCurrentUser: (user: User) => void;


};

export const useUserStore = create<UserStore>((set) => ({
   currentUser: null,
   setCurrentUser: (currentUser) => set({ currentUser })
}));