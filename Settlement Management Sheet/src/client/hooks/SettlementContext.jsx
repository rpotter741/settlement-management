import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const SettlementContext = createContext();

const SettlementProvider = ({ children }) => {
  const [settlementData, setSettlementData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettlementData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/settlement", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSettlementData(response.data);
      } catch (err) {
        console.error("Failed to fetch settlement data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettlementData();
  }, []);

  return (
    <SettlementContext.Provider
      value={{ settlementData, setSettlementData, loading }}
    >
      {children}
    </SettlementContext.Provider>
  );
};

export { SettlementContext, SettlementProvider };
