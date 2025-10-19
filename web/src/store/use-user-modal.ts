import { create } from "zustand";
import type { TabType } from "../app/(dashboard)/_components/modal/types";

type UserModalState = {
  isOpen: boolean;
  activeTab: TabType;
  openModal: (tab?: TabType) => void;
  closeModal: () => void;
  setActiveTab: (tab: TabType) => void;
};

export const useSystemUserModal = create<UserModalState>((set) => ({
  isOpen: false,
  activeTab: "profile",
  openModal: (tab = "profile") => set({ isOpen: true, activeTab: tab }),
  closeModal: () => set({ isOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
