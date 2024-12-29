import React, { useEffect, useState } from "react";
import axios from "axios";

const Balance = () => {
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
  return (
    <>
      <div className="w-full flex flex-row justify-center mt-10 px-10 gap-10">
        <div className="w-full p-3 py-5 bg-white  rounded-xl flex flex-col justify-center items-center">
          <p className="text-3xl font-semibold">Pemasukan</p>
          <p className="text-xl font-semibold text-base-100">
            Rp. {(sale + saving + otherIncome).toLocaleString()}
          </p>
        </div>
        <div className="w-full p-3 py-5 bg-white rounded-xl flex flex-col justify-center items-center">
          <p className="text-3xl font-semibold">Pengeluaran</p>
          <p className="text-xl font-semibold text-base-100">
            Rp. {(operational + memberLoan + otherExpense).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-2/4 p-3 py-10 bg-white rounded-xl flex flex-col justify-center items-center mt-10">
          <p className="text-2xl font-semibold">Sisa Saldo Koperasi</p>
          <p className="text-3xl font-bold text-base-100">
            Rp.{" "}
            {(
              sale +
              saving +
              otherIncome -
              (operational + memberLoan + otherExpense)
            ).toLocaleString()}
          </p>
        </div>
      </div>
    </>
  );
};

export default Balance;
