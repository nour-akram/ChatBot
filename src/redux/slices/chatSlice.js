import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import API_BASE_URL from "../../../api/config";
import { logout } from "./authSlice";


export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async (_, thunkAPI) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${API_BASE_URL}/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch chat history"
      );
    }
  }
);

export const addChat = createAsyncThunk(
  "chat/addChat",
  async (chatData, thunkAPI) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(`${API_BASE_URL}/chats`, chatData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add chat"
      );
    }
  }
);

export const updateChat = createAsyncThunk(
  "chat/updateChat",
  async ({ id, title }, thunkAPI) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.patch(
        `${API_BASE_URL}/chats/${id}`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update chat"
      );
    }
  }
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (id, thunkAPI) => {
    try {
      const token = Cookies.get("accessToken");
      await axios.delete(`${API_BASE_URL}/chats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete chat"
      );
    }
  }
);

export const addMessageToChat = createAsyncThunk(
  "chat/addMessageToChat",
  async ({ chatId, message }, thunkAPI) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/chats/${chatId}/messages`,
        {
          content: message.content,
          senderType: message.senderType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { chatId, updatedMessages: response.data.messages };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add message"
      );
    }
  }
);


const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatHistory: [],
    selectedChat: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      ////////////////////////////addChat//////////////////////
      .addCase(addChat.fulfilled, (state, action) => {
        state.chatHistory.push(action.payload);
      })
      .addCase(addChat.rejected, (state, action) => {
        state.error = action.payload;
      })
      /////////////////////////////logout//////////////////////
      .addCase(logout, (state) => {
        state.chatHistory = [];
        state.loading = false;
        state.error = null;
      })
      /////////////////////////////updateChat//////////////////////
      .addCase(updateChat.fulfilled, (state, action) => {
        const updatedChat = action.payload;
        const index = state.chatHistory.findIndex(
          (chat) => chat._id === updatedChat._id
        );
        if (index !== -1) {
          state.chatHistory[index] = updatedChat;
        }
      })
      .addCase(updateChat.rejected, (state, action) => {
        state.error = action.payload;
      })
      /////////////////////////////deleteChat//////////////////////
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chatHistory = state.chatHistory.filter(
          (chat) => chat._id !== action.payload
        );
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.error = action.payload;
      })
      /////////////////////////////addMessageToChat//////////////////////
      .addCase(addMessageToChat.fulfilled, (state, action) => {
        const { chatId, updatedMessages } = action.payload;
        const chat = state.chatHistory.find((chat) => chat._id === chatId);
        if (chat) {
          chat.messages = updatedMessages;
        }
        if (state.selectedChat && state.selectedChat._id === chatId) {
          state.selectedChat.messages = updatedMessages;
        }
      })
      .addCase(addMessageToChat.rejected, (state, action) => {
        state.error = action.payload;
      })
     
  },
});

export const { setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
