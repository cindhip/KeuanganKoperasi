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
  LineChart,
  Line,
} from "recharts";

const AreaChartGraph = () => {
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

  const groupedSalesByDate = income
    .filter((item) => item.type === "sale")
    .reduce((acc, current) => {
      const date = new Date(current.sale.dateTransaction)
        .toISOString()
        .split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += current.sale.nominal;
      return acc;
    }, {});

  const groupedSavingsByDate = income
    .filter((item) => item.type === "saving")
    .reduce((acc, current) => {
      const date = new Date(current.saving.depositDate)
        .toISOString()
        .split("T")[0];
      const totalDeposit =
        current.saving.principalDeposit +
        current.saving.mandatoryDeposit +
        current.saving.voluntaryDeposit; // Jumlahkan semua deposit
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += totalDeposit;
      return acc;
    }, {});

  const groupedOtherIncomeByDate = income
    .filter((item) => item.type === "otherIncome")
    .reduce((acc, current) => {
      const date = new Date(current.otherIncome.date)
        .toISOString()
        .split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += current.otherIncome.nominal;
      return acc;
    }, {});

  const groupedOperationalByDate = expense
    .filter((item) => item.type === "operational")
    .reduce((acc, current) => {
      const date = new Date(current.operational.transactionDate)
        .toISOString()
        .split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += current.operational.nominal;
      return acc;
    }, {});

  const groupedLoansByDate = expense
    .filter((item) => item.type === "memberLoan")
    .reduce((acc, current) => {
      const date = new Date(current.memberLoan.borrowingDate)
        .toISOString()
        .split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += current.memberLoan.nominal;
      return acc;
    }, {});

  const groupedOtherExpenseByDate = expense
    .filter((item) => item.type === "otherExpense")
    .reduce((acc, current) => {
      const date = new Date(current.otherExpense.date)
        .toISOString()
        .split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += current.otherExpense.nominal;
      return acc;
    }, {});

  const allDates = new Set([
    ...Object.keys(groupedSalesByDate),
    ...Object.keys(groupedSavingsByDate),
    ...Object.keys(groupedOtherIncomeByDate),
    ...Object.keys(groupedOperationalByDate),
    ...Object.keys(groupedLoansByDate),
    ...Object.keys(groupedOtherExpenseByDate),
  ]);

  const areaChartData = Array.from(allDates)
    .sort()
    .map((date) => {
      const totalIncome =
        (groupedSalesByDate[date] || 0) +
        (groupedSavingsByDate[date] || 0) +
        (groupedOtherIncomeByDate[date] || 0);

      const totalExpense =
        (groupedOperationalByDate[date] || 0) +
        (groupedLoansByDate[date] || 0) +
        (groupedOtherExpenseByDate[date] || 0);

      return {
        name: date, // Tanggal untuk sumbu X
        income: totalIncome, // Total Income
        expense: totalExpense, // Total Expense
      };
    });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={areaChartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="income"
          stroke="green"
          fill="green"
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="red"
          fill="red"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AreaChartGraph;
