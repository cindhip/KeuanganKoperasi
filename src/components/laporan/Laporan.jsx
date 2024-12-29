import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas-pro";

const Laporan = () => {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [bulan, setBulan] = useState(12);
  const [tahun, setTahun] = useState(2024);
  const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

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

    const groupedInstallmentsByDate = expense
    .filter((item) => item.type === "memberLoan")
    .reduce((acc, current) => {
      current.memberLoan.installments.forEach((installment) => {
        const date = new Date(installment.date).toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += installment.nominal;
      });
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
    ...Object.keys(groupedInstallmentsByDate),
    ...Object.keys(groupedOperationalByDate),
    ...Object.keys(groupedLoansByDate),
    ...Object.keys(groupedOtherExpenseByDate),
  ]);

  const formatCurrency = (num) => `Rp. ${num.toLocaleString("id-ID")}`;

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const years = [2023, 2024, 2025];

  const filterByMonthAndYear = (data, bulan, tahun) => {
    return Object.entries(data)
      .filter(([date]) => {
        const dateObj = new Date(date);
        const month = dateObj.getMonth() + 1; // getMonth() returns 0-11, so add 1
        const year = dateObj.getFullYear();
        return month === bulan && year === tahun;
      })
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  };

  const filteredSales = filterByMonthAndYear(groupedSalesByDate, bulan, tahun);
  const filteredSavings = filterByMonthAndYear(groupedSavingsByDate, bulan, tahun);
  const filteredOtherIncome = filterByMonthAndYear(groupedOtherIncomeByDate, bulan, tahun);
  const filteredInstallments = filterByMonthAndYear(groupedInstallmentsByDate, bulan, tahun);
  const filteredOperational = filterByMonthAndYear(groupedOperationalByDate, bulan, tahun);
  const filteredLoans = filterByMonthAndYear(groupedLoansByDate, bulan, tahun);
  const filteredOtherExpense = filterByMonthAndYear(groupedOtherExpenseByDate, bulan, tahun);

  const allFilteredDates = new Set([
    ...Object.keys(filteredSales),
    ...Object.keys(filteredSavings),
    ...Object.keys(filteredOtherIncome),
    ...Object.keys(filteredInstallments),
    ...Object.keys(filteredOperational),
    ...Object.keys(filteredLoans),
    ...Object.keys(filteredOtherExpense),
  ]);

  // Total //
  const calculateTotal = (filteredData) => {
    return Object.values(filteredData).reduce((sum, value) => sum + value, 0);
  };
  const totalSales = calculateTotal(filteredSales);
  const totalSavings = calculateTotal(filteredSavings);
  const totalOtherIncome = calculateTotal(filteredOtherIncome);
  const totalInstallments = calculateTotal(filteredInstallments);
  const totalOperational = calculateTotal(filteredOperational);
  const totalLoans = calculateTotal(filteredLoans);
  const totalOtherExpense = calculateTotal(filteredOtherExpense);

  const totalIncome = totalSales + totalSavings + totalOtherIncome + totalInstallments;
  const totalExpense = totalOperational + totalLoans + totalOtherExpense;

  // PDF //
  const captureRef = useRef(null);

  const handleCapture = () => {
    const element = captureRef.current; // Ambil elemen yang ingin diambil gambarnya
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "screenshot.png";
      link.click();
    });
  };

  return (
    <div>
      <div className="p-10 mb-10 bg-[#212C5F] rounded-xl text-center">
        <p className="text-3xl font-bold">Laporan Keuangan</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1"
              data-theme="light"
            >
              {namaBulan[bulan - 1]}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              data-theme="light"
            >
              {months.map((month, index) => (
                <li key={index}>
                  <a onClick={() => setBulan(index + 1)}>{month}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1"
              data-theme="light"
            >
              {tahun}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              data-theme="light"
            >
              {years.map((year) => (
                <li key={year}>
                  <a onClick={() => setTahun(year)}>{year}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button className="btn" data-theme="light" onClick={handleCapture}>
          Download
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full rounded-xl mt-5" ref={captureRef}>
        <table className="table table-lg" data-theme="cupcake">
          {/* head */}
          <thead className="text-center" data-theme="dracula">
            <tr>
              <th rowSpan={2}>No</th>
              <th rowSpan={2}>Tanggal</th>
              <th colSpan={4}>Pemasukan</th>
              <th colSpan={3}>Pengeluaran</th>
            </tr>
            <tr>
              <th>Penjualan</th>
              <th>Simpanan</th>
              <th>Lain-lain</th>
              <th>Angsuran</th>
              <th>Operasional</th>
              <th>Pinjaman</th>
              <th>Lain-lain</th>
            </tr>
          </thead>
          <tbody>
            {[
              ...(bulan == "Bulan" && tahun == "Tahun"
                ? allDates
                : allFilteredDates),
            ]
              .sort()
              .map((date, index) => {
                const penjualan = groupedSalesByDate[date] || 0;
                const simpanan = groupedSavingsByDate[date] || 0;
                const lainLainPemasukan = groupedOtherIncomeByDate[date] || 0;
                const angsuran = groupedInstallmentsByDate[date] || 0;
                const operasional = groupedOperationalByDate[date] || 0;
                const pinjaman = groupedLoansByDate[date] || 0;
                const lainLainPengeluaran =
                  groupedOtherExpenseByDate[date] || 0;
                return (
                  <tr key={date}>
                    <th className="border-r border-slate-200">{index + 1}</th>
                    <td className="border-r border-slate-200">
                      {new Date(date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="border-r border-slate-200">
                      {formatCurrency(penjualan)}
                    </td>
                    <td className="border-r border-slate-200">
                      {formatCurrency(simpanan)}
                    </td>
                    <td className="border-r border-slate-200">
                      {formatCurrency(lainLainPemasukan)}
                    </td>
                    <td className="border-r border-slate-200">
                      {formatCurrency(angsuran)}
                    </td>
                    <td className="border-r border-slate-200">
                      {formatCurrency(operasional)}
                    </td>
                    <td className="border-r border-slate-200">
                      {formatCurrency(pinjaman)}
                    </td>
                    <td>{formatCurrency(lainLainPengeluaran)}</td>
                  </tr>
                );
              })}

            <tr>
              <td colSpan={2} className="border-r border-slate-200 font-bold">
                Total
              </td>
              <td colSpan={3} className="border-r text-center">
              {formatCurrency(totalIncome)}
              </td>
              <td colSpan={3} className="text-center">
                {formatCurrency(totalExpense)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="w-96 mt-5 px-4 py-3 bg-white rounded-lg flex flex-row justify-between">
        <p className="text-xl font-semibold text-base-100">Laba/Rugi :</p>
        <p className="text-xl font-semibold text-base-100">{formatCurrency(totalIncome - totalExpense)}</p>
      </div>
    </div>
  );
};

export default Laporan;
