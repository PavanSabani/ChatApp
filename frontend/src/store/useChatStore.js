import {create} from "zustand"
import toast from "react-hot-toast"
import {axiosInstance} from "../lib/axios";


export const useChatStore = create((set)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessagesloading:false,


    getUser:async () => {
        set({isUserLoading:true});
        try {
            const res = await axiosInstance.get("/messages/users"); 
            set({users:res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false});
        }
    },

    getMessages:async (userId) => {
        set({isMessagesloading:true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`); 
            set({messages:res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesloading:false});
        }
    },
    

    // optimize this later
    setSelectedUser:async (selectedUser) => set({selectedUser}),


}))