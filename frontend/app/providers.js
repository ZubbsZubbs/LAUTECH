"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { Toaster } from "sonner";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
        <Toaster position="top-right" />
      </ThemeProvider>
    </Provider>
  );
}
