import React, { useEffect, useState } from "react";
import axios from "axios";

const Pinjaman = () => {
  const [allAnggota, setAllAnggota] = useState([]);
  const [anggota, setAnggota] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/member/");
      setAllAnggota(response.data);
      setAnggota(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (search === "") {
      setAnggota(allAnggota);
    } else {
      const filtered = allAnggota.filter((item) => {
        return item.name.toLowerCase().includes(search.toLowerCase());
      });
      setAnggota(filtered);
    }
  }, [search, allAnggota]);

  return (
    <div>
      <div className="p-10 mb-10 bg-[#212C5F] rounded-xl text-center">
        <p className="text-3xl font-bold">Catatan Simpan Pinjam Anggota</p>
      </div>

      <label
        className="input input-bordered flex items-center gap-2 w-72 mb-5"
        data-theme="light"
      >
        <input
          type="text"
          className="grow"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      {/* Tabel */}
      <div className="overflow-x-auto w-full rounded-xl">
        <table className="table table-lg" data-theme="cupcake">
          {/* head */}
          <thead className="text-center" data-theme="dracula">
            <tr>
              <th>Nama Anggota</th>
              <th>Status Anggota</th>
              <th>Simpanan</th>
              <th>Pinjaman</th>
              <th>Status Pinjaman</th>
            </tr>
          </thead>
          <tbody>
            {anggota.map((anggota) => {
              const totalLoans = anggota.loans.reduce((total, loan) => {
                return total + loan.memberLoan.nominal;
              }, 0);

              const totalInstallments = anggota.loans.reduce((total, loan) => {
                const installmentsTotal = loan.memberLoan.installments.reduce(
                  (sum, installment) => sum + installment.nominal,
                  0
                );

                return total + installmentsTotal;
              }, 0);

              const totalSavings = anggota.savings.reduce((total, saving) => {
                return (
                  total +
                  saving.saving.principalDeposit +
                  saving.saving.mandatoryDeposit +
                  saving.saving.voluntaryDeposit
                );
              }, 0);

              return (
                <>
                  <tr>
                    <th
                      className="border-r border-slate-200"
                      onClick={() => console.log(totalInstallments)}
                    >
                      {anggota.name}
                    </th>
                    <td className="border-r border-slate-200">
                      {anggota.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </td>
                    <td className="border-r border-slate-200">
                      Rp. {totalSavings.toLocaleString()}
                    </td>
                    <td className="border-r border-slate-200">
                      Rp. {totalLoans.toLocaleString()}
                    </td>
                    <td className="border-r border-slate-200">
                      {totalInstallments == totalLoans
                        ? "Lunas"
                        : "Belum Lunas"}
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pinjaman;
