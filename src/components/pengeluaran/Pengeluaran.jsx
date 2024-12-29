import React, { useState } from "react";
import Operasional from "./tab/Operasional"
import Pinjaman from "./tab/Pinjaman"
import PengeluaranLain from "./tab/PengeluaranLain"

const Pengeluaran = () => {
  const [activeTab, setActiveTab] = useState("operasional");

  const renderTab = () => {
    switch (activeTab) {
      case "operasional":
        return <Operasional />;
      case "pinjaman":
        return <Pinjaman />;
      case "pengeluaran-lain":
        return <PengeluaranLain />;
      default:
        return <Operasional />;
    }
  };
  return (
    <>
      <h1 className="text-3xl font-bold mb-5">Transaksi Pengeluaran</h1>
      <div role="tablist" className="tabs tabs-boxed w-96">
        <a
          role="tab"
          className={`tab ${activeTab === "operasional" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("operasional")}
        >
          Operasional
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === "pinjaman" ? "tab-active" : ""} w-40`}
          onClick={() => setActiveTab("pinjaman")}
        >
          Pinjaman Anggota
        </a>
        <a
          role="tab"
          className={`tab ${
            activeTab === "pengeluaran-lain" ? "tab-active" : ""
          } w-40`}
          onClick={() => setActiveTab("pengeluaran-lain")}
        >
          Pengeluaran Lain
        </a>
      </div>

      <div className="py-10 px-1">{renderTab()}</div>
    </>
  );
};

export default Pengeluaran;
