import React, { useState, useEffect } from "react";
import axios from "axios";

const MinMax = () => {
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

  const incomeNominal = income
  .map(item => {
    if (item.type === 'sale') {
      return item.sale.nominal;
    } else if (item.type === 'otherIncome') {
      return item.otherIncome.nominal;
    } else if (item.type === 'saving') {
      return item.saving.principalDeposit + item.saving.mandatoryDeposit + item.saving.voluntaryDeposit;
    }
    return null;
  });

  const expenseNominal = expense
  .map(item => {
    if (item.type === 'operational') {
      return item.operational.nominal;
    } else if (item.type === 'memberLoan') {
      return item.memberLoan.nominal;
    } else if (item.type === 'otherExpense') {
      return item.otherExpense.nominal;
    }
    return null;
  })

  const minIncome = Math.min(...incomeNominal)
  const maxIncome = Math.max(...incomeNominal)
  const minExpense = Math.min(...expenseNominal)
  const maxExpense = Math.max(...expenseNominal)

  return (
    <>
      <div className="mt-3">
        <div className="flex flex-row justify-between items-center px-4 text-slate-200">
          <p>Min</p>
          <p className="text-lg">Pemasukan</p>
          <p>Max</p>
        </div>
        <div className="w-full p-4 bg-white rounded-xl flex flex-row justify-between items-center text-sm">
          <p className="font-semibold">Rp. {minIncome.toLocaleString()}</p>
          <p className="font-semibold">Rp. {maxIncome.toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex flex-row justify-between items-center px-4 text-slate-200">
          <p>Min</p>
          <p className="text-lg">Pengeluaran</p>
          <p>Max</p>
        </div>
        <div className="w-full p-4 bg-white rounded-xl flex flex-row justify-between items-center text-sm">
          <p className="font-semibold">Rp. {minExpense.toLocaleString()}</p>
          <p className="font-semibold">Rp. {maxExpense.toLocaleString()}</p>
        </div>
      </div>
    </>
  );
};

export default MinMax;
