import React, { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "../../lib/Toast";

const PengeluaranLain = () => {
  const [pengeluaran, setPengeluaran] = useState([]);
  const [form, setForm] = useState({
    type: "otherExpense",
    otherExpense: {
      expenseType: "",
      date: "",
      nominal: "",
      recipient: "",
      file: "",
    },
  });
  const [formEdit, setFormEdit] = useState({
    type: "otherExpense",
    otherExpense: {
      expenseType: "",
      date: "",
      nominal: "",
      recipient: "",
      file: "",
    },
  })

  const fetchPengeluaran = async () => {
    const response = await axios.get("https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/expense");
    setPengeluaran(response.data);
  };

  useEffect(() => {
    fetchPengeluaran();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const key = name.split(".")[1];
    setForm((prevForm) => ({
      ...prevForm,
      otherExpense: {
        ...prevForm.otherExpense,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (
      form.otherExpense.expenseType === "" ||
      form.otherExpense.date === "" ||
      form.otherExpense.nominal === "" ||
      form.otherExpense.recipient === "" ||
      form.otherExpense.file === ""
    ) {
      showToast("error", "Data tidak boleh kosong");
      return;
    }
    try {
      await axios.post("https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/expense", form);
      fetchPengeluaran();
      showToast("success", "Data berhasil ditambahkan");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/expense/${id}`);
      fetchPengeluaran();
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
      otherExpense: {
        ...prevFormEdit.otherExpense,
        [name]: value,
      },
    }));
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.put(
        `https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/expense/${formEdit.id}`,
        formEdit
      );
      fetchPengeluaran();
      showToast("success", "Data berhasil diubah");
      document.getElementById("modal_edit_expense").close();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (item) => {
    setFormEdit({
      id: item._id,
      type: "otherExpense",
      otherExpense: {
        expenseType: item.otherExpense.expenseType,
        date: item.otherExpense.date.slice(0, 10),
        nominal: item.otherExpense.nominal,
        recipient: item.otherExpense.recipient,
        file: item.otherExpense.file,
      },
    });

    document.getElementById("modal_edit_expense").showModal();
  };

  return (
    <div className="flex">
      <div className="flex flex-col gap-5 min-w-80 items-end">
        <select
          className="select select-bordered w-full max-w-sm"
          data-theme="light"
          name="otherExpense.expenseType"
          onChange={handleFormChange}
        >
          <option disabled selected>
            Jenis Pengeluaran
          </option>
          <option value="biaya investasi">Biaya investasi</option>
          <option value="biaya tak terduga">Biaya tak terduga</option>
          <option value="biaya sosial dan budaya">Biaya sosial dan budaya</option>
          <option value="biaya pajak dan retribusi">Biaya pajak dan retribusi</option>
        </select>
        <input
          type="date"
          placeholder="Tanggal Pengeluaran"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="otherExpense.date"
          onChange={handleFormChange}
        />
        <input
          type="text"
          placeholder="Jumlah Pengeluaran"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="otherExpense.nominal"
          onChange={handleFormChange}
        />
        <input
          type="text"
          placeholder="Penerima"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="otherExpense.recipient"
          onChange={handleFormChange}
        />
        <input
          type="file"
          label="Bukti Pendukung"
          className="file-input file-input-bordered w-full max-w-xs"
          data-theme="light"
          name="otherExpense.file"
          onChange={handleFormChange}
        />

        <button className="btn btn-primary" onClick={handleSubmit}>Tambah Data</button>
      </div>

      <div className="divider divider-horizontal"></div>

      {/* Tabel */}
      <div className="overflow-x-auto w-full rounded-xl">
        <table className="table table-lg" data-theme="cupcake">
          {/* head */}
          <thead className="text-center" data-theme="dracula">
            <tr>
              <th>Jenis Pengeluaran</th>
              <th>Tanggal</th>
              <th>Jumlah</th>
              <th>Penerima</th>
              <th>Bukti</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pengeluaran.filter(item => item.type == "otherExpense").map((item) => (
              <>
                <tr>
                  <th className='border-r border-slate-200'>{item.otherExpense.expenseType}</th>
                  <td className='border-r border-slate-200'>{item.otherExpense.date.slice(0, 10).split("-").reverse().join("-")}</td>
                  <td className='border-r border-slate-200'>Rp. {item.otherExpense.nominal.toLocaleString()}</td>
                  <td className='border-r border-slate-200'>{item.otherExpense.recipient}</td>
                  <td className='border-r border-slate-200'>{item.otherExpense.file.length > 30 ? item.otherExpense.file.slice(0, 30) + "..." : item.otherExpense.file}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Edit */}
      <dialog id="modal_edit_expense" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-center mb-5">
            Edit Data Pengeluaran
          </h3>

          <div className="flex flex-col gap-5">
            <select
              className="select select-bordered w-full max-w-lg"
              name="expenseType"
              onChange={handleFormEditChange}
            >
              <option disabled selected>
                Jenis Pengeluaran
              </option>
              <option value="biaya investasi">Biaya investasi</option>
              <option value="biaya tak terduga">Biaya tak terduga</option>
              <option value="biaya sosial dan budaya">Biaya sosial dan budaya</option>
              <option value="biaya pajak dan retribusi">Biaya pajak dan retribusi</option>
            </select>
            <input
              type="date"
              placeholder="Tanggal Pengeluaran"
              className="input input-bordered w-full max-w-lg"
              name="date"
              onChange={handleFormEditChange}
              value={formEdit.otherExpense.date}
            />
            <input
              type="text"
              placeholder="Jumlah Pengeluaran"
              className="input input-bordered w-full max-w-lg"
              name="nominal"
              onChange={handleFormEditChange}
              value={formEdit.otherExpense.nominal}
            />
            <input
              type="text"
              placeholder="Penerima"
              className="input input-bordered w-full max-w-lg"
              name="recipient"
              onChange={handleFormEditChange}
              value={formEdit.otherExpense.recipient}
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
  )
}

export default PengeluaranLain