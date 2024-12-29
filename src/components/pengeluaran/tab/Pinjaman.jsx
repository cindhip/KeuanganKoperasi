import React, { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "../../lib/Toast";

const Pinjaman = () => {
  const [pinjaman, setPinjaman] = useState([]);
  const [member, setMember] = useState([]);
  const [form, setForm] = useState({
    type: "memberLoan",
    memberLoan: {
      member: "",
      borrowingDate: "",
      dueDate: "",
      nominal: 0,
    },
  });
  const [formEdit, setFormEdit] = useState({
    id: "",
    type: "memberLoan",
    memberLoan: {
      member: "",
      borrowingDate: "",
      dueDate: "",
      nominal: 0,
    },
  });

  const fetchPinjaman = async () => {
    const response = await axios.get("http://localhost:5000/api/expense");
    setPinjaman(response.data);
  };

  const fetchAnggota = async () => {
    const response = await axios.get(`http://localhost:5000/api/member`);
    setMember(response.data);
  };

  useEffect(() => {
    fetchAnggota();
    fetchPinjaman();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const key = name.split(".")[1];
    setForm((prevForm) => ({
      ...prevForm,
      memberLoan: {
        ...prevForm.memberLoan,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (
      form.memberLoan.member === "" ||
      form.memberLoan.borrowingDate === "" ||
      form.memberLoan.dueDate === "" ||
      form.memberLoan.nominal === 0
    ) {
      showToast("error", "Data tidak boleh kosong");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/expense", form);
      fetchPinjaman();

      const getLatestLoanId = await axios.get(
        `http://localhost:5000/api/expense`
      );
      const getExpenseId =
        getLatestLoanId.data[getLatestLoanId.data.length - 1]._id;
      console.log(getExpenseId);

      await axios.put(
        `http://localhost:5000/api/member/${form.memberLoan.member}/loans`,
        { loans: `${getExpenseId}` }
      );
      showToast("success", "Data berhasil ditambahkan");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expense/${id}`);
      fetchPinjaman();
      fetchAnggota();
      showToast("success", "Data berhasil dihapus");
    } catch (error) {
      console.log(error);
    }
  };

  // Edit
  const handleFormEditChange = (e) => {
    const { name, value } = e.target;
    setFormEdit((prevFormEdit) => ({
      ...prevFormEdit,
      memberLoan: {
        ...prevFormEdit.memberLoan,
        [name]: value,
      },
    }));
  };

  const handleSubmitEdit = async () => {
    console.log(formEdit);
    try {
      await axios.put(
        `http://localhost:5000/api/expense/${formEdit.id}`,
        formEdit
      );
      fetchPinjaman();
      showToast("success", "Data berhasil diubah");
      document.getElementById("modal_edit_loan").close();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (item) => {
    setFormEdit({
      id: item._id,
      type: "memberLoan",
      memberLoan: {
        member: item.memberLoan.member,
        borrowingDate: item.memberLoan.borrowingDate.slice(0, 10),
        dueDate: item.memberLoan.dueDate.slice(0, 10),
        nominal: item.memberLoan.nominal,
      },
    });

    document.getElementById("modal_edit_loan").showModal();
  };

  return (
    <div className="flex">
      <div className="flex flex-col gap-5 min-w-80 items-end">
        <select
          className="select select-bordered w-full max-w-sm"
          data-theme="light"
          name="memberLoan.member"
          onChange={handleFormChange}
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
          placeholder="Tanggal Pinjam"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="memberLoan.borrowingDate"
          onChange={handleFormChange}
        />
        <input
          type="date"
          placeholder="Jangka Waktu Pinjam"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="memberLoan.dueDate"
          onChange={handleFormChange}
        />
        <input
          type="text"
          placeholder="Nominal Pinjam"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="memberLoan.nominal"
          onChange={handleFormChange}
        />

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
                Nama Anggota
              </th>
              <th rowSpan={2} className="text-sm">
                Tanggal Pinjam
              </th>
              <th rowSpan={2} className="text-sm">
                Jatuh Tempo
              </th>
              <th colSpan={3} className="text-sm">
                Pinjaman
              </th>
              <th rowSpan={2} className="text-sm">
                Status
              </th>
              <th rowSpan={2} className="text-sm">
                Aksi
              </th>
            </tr>
            <tr>
              <th>Nominal</th>
              <th>Angsuran</th>
              <th>Sisa</th>
            </tr>
          </thead>
          <tbody>
            {pinjaman
              .filter((item) => item.type == "memberLoan")
              .map((item) => {
                const totalInstallments = item.memberLoan.installments.reduce(
                  (total, installment) => total + installment.nominal,
                  0
                );
                return (
                  <>
                    <tr>
                      <th className="border-r border-slate-200">
                        {item.memberLoan.member.name}
                      </th>
                      <td className="border-r border-slate-200">
                        {item.memberLoan.borrowingDate
                          .slice(0, 10)
                          .split("-")
                          .reverse()
                          .join("-")}
                      </td>
                      <td className="border-r border-slate-200">
                        {item.memberLoan.dueDate
                          .slice(0, 10)
                          .split("-")
                          .reverse()
                          .join("-")}
                      </td>
                      <td className="border-r border-slate-200">
                        Rp. {item.memberLoan.nominal.toLocaleString()}
                      </td>
                      <td
                        className="border-r border-slate-200"
                        onClick={() => console.log(totalInstallments)}
                      >
                        Rp. {totalInstallments.toLocaleString()}
                      </td>
                      <td className="border-r border-slate-200">
                        Rp.{" "}
                        {(
                          item.memberLoan.nominal -
                          totalInstallments
                        ).toLocaleString()}
                      </td>
                      <td className="border-r border-slate-200">
                        {item.memberLoan.nominal - totalInstallments > 0 ? "Belum Lunas" : "Lunas"}
                      </td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-secondary min-h-0 h-8"
                          onClick={() => handleEditClick(item)}
                        >
                          Edit
                        </button>
                        <button className="btn btn-error min-h-0 h-8" onClick={() => handleDelete(item._id)}>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  </>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Modal Edit */}
      <dialog id="modal_edit_loan" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-center mb-5">
            Edit Data Pinjaman
          </h3>

          <div className="flex flex-col gap-5">
            <input
              type="date"
              name="borrowingDate"
              value={formEdit.memberLoan.borrowingDate}
              onChange={handleFormEditChange}
              className="input input-bordered w-full max-w-lg"
              placeholder="Tanggal Pinjam"
            />
            <input
              type="date"
              placeholder="Jangka Waktu Pinjam"
              className="input input-bordered w-full max-w-lg"
              name="dueDate"
              value={formEdit.memberLoan.dueDate}
              onChange={handleFormEditChange}
            />
            <input
              type="text"
              placeholder="Nominal Pinjam"
              className="input input-bordered w-full max-w-lg"
              name="nominal"
              value={formEdit.memberLoan.nominal}
              onChange={handleFormEditChange}
            />
            <button className="btn btn-primary" onClick={handleSubmitEdit}>
              Edit Data
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Pinjaman;
