import React, { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "../../lib/Toast";

const Angsuran = () => {
  const [installment, setInstallment] = useState(null);
  const [member, setMember] = useState([]);
  const [memberLoans, setMemberLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [form, setForm] = useState({
    date: "",
    nominal: "",
    installmentNumber: "1",
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/expense/");
      setInstallment(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAnggota = async () => {
    const response = await axios.get(`https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/member`);
    setMember(response.data);
  };

  const fetchMemberLoans = async (memberId) => {
    try {
      const response = await axios.get(
        `https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/member/${memberId}`
      );
      const loans = response.data.loans;
      setMemberLoans(loans);

      const loansNotPaid = loans.filter((loan) => {
        const installments = loan?.memberLoan?.installments || [];
        const totalInstallments = installments.reduce((total, installment) => {
          return total + (installment.nominal || 0);
        }, 0);

        return loan?.memberLoan?.nominal > totalInstallments;
      });

      setFilteredLoans(loansNotPaid);
    } catch (error) {
      console.error("Error fetching member loans:", error);
    }
  };

  const handleSelectMember = (e) => {
    const memberId = e.target.value;
    console.log(memberId);
    setSelectedMember(memberId);

    fetchMemberLoans(memberId);
  };

  const handleSubmit = async () => {

    if (
      form.date === "" ||
      form.nominal === "" ||
      form.installmentNumber === ""
    ) {
      showToast("error", "Data tidak boleh kosong");
      return;
    }

    try {
      await axios.put(
        `https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/expense/${memberLoans[0]._id}/installment`,
        form
      );
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchData();
    fetchAnggota();
  }, []);

  return (
    <div className="flex">
      <div className="flex flex-col gap-5 min-w-80 items-end">
        <select
          className="select select-bordered w-full max-w-sm"
          data-theme="light"
          name="selectedMember"
          value={selectedMember}
          onChange={handleSelectMember}
        >
          <option disabled selected>
            Pilih Anggota
          </option>
          {member.map((item) => (
            <option value={item._id}>{item.name}</option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Tanggal Angsuran"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="date"
          value={form.date}
          onChange={handleEditForm}
        />
        <input
          type="text"
          placeholder="Nominal Angsuran"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="nominal"
          value={form.nominal}
          onChange={handleEditForm}
        />
        <select
          className="select select-bordered w-full max-w-sm"
          data-theme="light"
          name="installmentNumber"
          value={form.installmentNumber}
          onChange={handleEditForm}
        >
          <option disabled selected>
            Angsuran Ke-
          </option>
          {[...Array(12).keys()].map((i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Tambah Data
        </button>
      </div>

      <div className="divider divider-horizontal"></div>

      {/* Tabel */}
      <div className="overflow-x-auto w-full rounded-xl">
        <table className="table table-lg" data-theme="cupcake">
          {/* head */}
          <thead className="text-center" data-theme="dracula">
            <tr>
              <th rowSpan={2} className="text-sm">
                Nama
              </th>
              <th rowSpan={2} className="text-sm">
                Tanggal
              </th>
              <th colSpan={2} className="text-sm">
                Angsuran
              </th>
            </tr>
            <tr>
              <th>Jumlah</th>
              <th>Angsuran Ke-</th>
            </tr>
          </thead>
          <tbody>
            {installment
              ?.filter((item) => item.type === "memberLoan")
              ?.map((item) =>
                item.memberLoan?.installments?.map((installment) => (
                  <tr key={installment._id}>
                    <th className="border-r border-slate-200">
                      {item.memberLoan?.member?.name || "Nama Tidak Ditemukan"}
                    </th>
                    <td className="border-r border-slate-200">
                      {installment?.date
                        ? new Date(installment.date).toLocaleDateString()
                        : "Tanggal Tidak Ditemukan"}
                    </td>
                    <td className="border-r border-slate-200">
                      Rp. {installment?.nominal?.toLocaleString() || 0}
                    </td>
                    <td className="border-r border-slate-200">
                      {installment?.installmentNumber || "N/A"}
                    </td>
                  </tr>
                ))
              ) || (
              <tr>
                <td colSpan="4">Data tidak tersedia</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Angsuran;
