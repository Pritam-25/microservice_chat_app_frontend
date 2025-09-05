import { create } from "zustand"

type UserStore = {
  users: string[],
  updateUsers: (users: string[]) => void
}

const useUserStore = create<UserStore>((set) => ({
  users: [],
  updateUsers: (users) => set({ users: users })
}))

export default useUserStore