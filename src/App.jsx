import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/Header";
import ChatBody from "./components/ChatBody";
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  const [selectedModel, setSelectedModel] = useState(
    "meta-llama/llama-4-maverick"
  );

  return (
    <Provider store={store}>
      <Header
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      <ChatBody selectedModel={selectedModel} />
    </Provider>
  );
};

export default App;
