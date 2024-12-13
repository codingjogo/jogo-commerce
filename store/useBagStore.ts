import { create } from 'zustand';

interface BagItem {
  id: string;
  image: string;
  name: string;
  category: string;
  price: number;
  color: string;
  size: string;
  size_id:string;
  quantity: number;
  maxStock: number;
}

interface BagStore {
  bagItems: BagItem[];
  setItemsInBagStore: (items: BagItem[]) => void;
  addItemToBagStore: (item: BagItem) => void;
  updateItemInBagStore: (id: string, updatedData: Partial<BagItem>) => void;
  removeItemInBagStore: (id: string) => void;
}

export const useBagStore = create<BagStore>((set) => ({
  bagItems: [],
  setItemsInBagStore: (items) => set({ bagItems: items }),
  addItemToBagStore: (item) =>
    set((state) => ({ bagItems: [...state.bagItems, item] })),
  updateItemInBagStore: (id, updatedData) =>
    set((state) => ({
      bagItems: state.bagItems.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      ),
    })),
  removeItemInBagStore: (id) =>
    set((state) => ({
      bagItems: state.bagItems.filter((item) => item.id !== id),
    })),
}));
