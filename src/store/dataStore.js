import { create } from 'zustand';

export const useDataStore = create((set, get) => ({
  districts: [],
  neighborhoods: [],
  loading: false,
  error: null,
  initialized: false,

  fetchAllData: async () => {
    if (get().initialized) return;

    set({ loading: true, error: null });

    try {
      const { getAllItems } = await import('../api/crudApi.js');

      const [districtsRes, neighborhoodsRes] = await Promise.all([
        getAllItems("index.php", { tableName: "districts", operation: "show" }),
        getAllItems("index.php", { tableName: "neighborhoods", operation: "show" })
      ]);

      set({
        districts: districtsRes?.data || districtsRes || [],
        neighborhoods: neighborhoodsRes?.data || neighborhoodsRes || [],
        loading: false,
        initialized: true
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));