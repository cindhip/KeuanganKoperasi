import React from "react";
import AreaChartGraph from "./charts/AreaChartGraph";
import RadialChart from "./charts/RadialChart";
import MinMax from "./squares/MinMax";
import Balance from "./squares/Balance";

const Beranda = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-5">
        Dashboard Manajemen Keuangan Koperasi
      </h1>
      <div className="flex flex-row gap-10 text-slate-800">
        <div className="w-3/4">
          <div className="w-full px-5 h-[480px] bg-white rounded-xl flex justify-center items-center">
            <AreaChartGraph />
          </div>
          <Balance />
        </div>

        <div className="w-1/4">
          <div className="w-full h-[640px] p-3 bg-white rounded-xl flex flex-col justify-center items-center">
            <RadialChart />
          </div>
          <MinMax />
        </div>
      </div>
    </>
  );
};

export default Beranda;
