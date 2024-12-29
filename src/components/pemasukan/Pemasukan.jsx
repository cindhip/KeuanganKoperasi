import React, { useState } from "react";
import Penjualan from "./tab/Penjualan";
import Simpanan from "./tab/Simpanan";
import PendapatanLain from "./tab/PendapatanLain";
import Angsuran from "./tab/Angsuran";

const Pemasukan = () => {
  const [activeTab, setActiveTab] = useState("penjualan");

  const renderTab = () => {
    switch (activeTab) {
      case "penjualan":
        return <Penjualan />;
      case "simpanan":
        return <Simpanan />;
      case "pendapatan-lain":
        return <PendapatanLain />;
      case "angsuran":
        return <Angsuran />;
      default:
        return <Penjualan />;
    }
  };
  return (
    <>
      <h1 className="text-3xl font-bold mb-5">Transaksi Pemasukan</h1>
      <div role="tablist" className="tabs tabs-boxed w-[35rem]">
        <a
          role="tab"
          className={`tab ${activeTab === "penjualan" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("penjualan")}
        >
          Penjualan
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === "simpanan" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("simpanan")}
        >
          Simpanan Anggota
        </a>
        <a
          role="tab"
          className={`tab ${
            activeTab === "pendapatan-lain" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("pendapatan-lain")}
        >
          Pendapatan lain
        </a>
        <a
          role="tab"
          className={`tab ${
            activeTab === "angsuran" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("angsuran")}
        >
          Angsuran Anggota
        </a>
      </div>

      <div className="py-10 px-1">{renderTab()}</div>
    </>
  );
};

export default Pemasukan;
