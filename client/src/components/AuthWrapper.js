"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import RouteGuard from "../guards/RouteGuard";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";

export default function AuthWrapper() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouteGuard>
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        </RouteGuard>
      </PersistGate>
    </Provider>
  );
}
