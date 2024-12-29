import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

const RadialChart = () => {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);

  const fetchData = async () => {
    try {
      const fetchIncome = await axios.get("https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/income/");
      setIncome(fetchIncome.data);
      const fetchExpense = await axios.get(
        "https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/expense/"
      );
      setExpense(fetchExpense.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sale = income
    .filter((item) => item.type == "sale")
    .reduce((acc, item) => acc + item.sale.nominal, 0);
  const saving = income
    .filter((item) => item.type == "saving")
    .reduce(
      (acc, item) =>
        acc +
        (item.saving.principalDeposit +
          item.saving.mandatoryDeposit +
          item.saving.voluntaryDeposit),
      0
    );
  const otherIncome = income
    .filter((item) => item.type == "otherIncome")
    .reduce((acc, item) => acc + item.otherIncome.nominal, 0);
  const operational = expense
    .filter((item) => item.type == "operational")
    .reduce((acc, item) => acc + item.operational.nominal, 0);
  const memberLoan = expense
    .filter((item) => item.type == "memberLoan")
    .reduce((acc, item) => acc + item.memberLoan.nominal, 0);
  const otherExpense = expense
    .filter((item) => item.type == "otherExpense")
    .reduce((acc, item) => acc + item.otherExpense.nominal, 0);

  // Chart Data

  const radialChartData = [
    {
      name: "Penjualan",
      uv: sale,
      pv: "dsa",
      fill: "#d00000",
    },
    {
      name: "Simpanan",
      uv: saving,
      pv: "dsa",
      fill: "#dc2f02",
    },
    {
      name: "Simpanan Lain",
      uv: otherIncome,
      pv: "dsa",
      fill: "#e85d04",
    },
    {
      name: "Pengeluaran Operasional",
      uv: operational,
      pv: "dsa",
      fill: "#f48c06",
    },
    {
      name: "Pinjaman Anggota",
      uv: memberLoan,
      pv: "dsa",
      fill: "#faa307",
    },
    {
      name: "Pengeluaran Lain",
      uv: otherExpense,
      pv: "dsa",
      fill: "#ffba08",
    },
  ];

  const style = {
    top: "78%",
    transform: "translate(0, -50%)",
    lineHeight: "2.5rem",
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        cx="50%"
        cy="30%"
        innerRadius="15%"
        outerRadius="100%"
        barSize={15}
        data={radialChartData}
      >
        <RadialBar
          minAngle={15}
          label={{ position: "insideStart", fill: "#fff" }}
          background
          clockWise
          dataKey="uv"
        />
        <Legend
          iconSize={10}
          iconType="circle"
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={style}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default RadialChart;
