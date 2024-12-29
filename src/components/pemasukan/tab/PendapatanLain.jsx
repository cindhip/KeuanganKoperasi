import React, { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "../../lib/Toast";

const PendapatanLain = () => {
  const [pendapatan, setPendapatan] = useState([]);
  const [form, setForm] = useState({
    type: "otherIncome",
    otherIncome: {
      incomeType: "",
      date: "",
      nominal: "",
      incomeSource: "",
      file: "",
    },
  });
  const [formEdit, setFormEdit] = useState({
    type: "otherIncome",
    otherIncome: {
      incomeType: "",
      date: "",
      nominal: "",
      incomeSource: "",
      file: "",
    },
  });

  const fetchPendapatan = async () => {
    const response = await axios.get("https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/income");
    setPendapatan(response.data);
  };

  useEffect(() => {
    fetchPendapatan();
  }, []);

  const totalPendapatan = pendapatan.reduce((total, item) => {
    if (item.type === "otherIncome") {
      return total + item.otherIncome.nominal;
    }
    return total;
  }, 0);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const key = name.split(".")[1];
    setForm((prevForm) => ({
      ...prevForm,
      otherIncome: {
        ...prevForm.otherIncome,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (
      form.otherIncome.incomeType === "" ||
      form.otherIncome.date === "" ||
      form.otherIncome.nominal === "" ||
      form.otherIncome.incomeSource === ""
    ) {
      showToast("error", "Data tidak boleh kosong");
      return;
    }
    try {
      await axios.post("https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/income", form);
      fetchPendapatan();
      showToast("success", "Data berhasil ditambahkan");
    } catch (error) {
      console.log(error);
    }
  };

  // Edit
  const handleFormEditChange = (e) => {
    const { name, value } = e.target;
    setFormEdit((prevFormEdit) => ({
      ...prevFormEdit,
      otherIncome: {
        ...prevFormEdit.otherIncome,
        [name]: value,
      },
    }));
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.put(
        `https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/income/${formEdit.id}`,
        formEdit
      );
      fetchPendapatan();
      showToast("success", "Data berhasil diubah");
      document.getElementById("modal_edit_income").close();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (item) => {
    setFormEdit({
      id: item._id,
      type: "otherIncome",
      otherIncome: {
        incomeType: item.otherIncome.incomeType,
        date: item.otherIncome.date.slice(0, 10),
        nominal: item.otherIncome.nominal,
        incomeSource: item.otherIncome.incomeSource,
        file: item.otherIncome.file,
      },
    });

    document.getElementById("modal_edit_income").showModal();
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/income/${id}`);
      fetchPendapatan();
      showToast("success", "Data berhasil dihapus");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      <div className="flex flex-col gap-5 min-w-80 items-end">
        <select
          className="select select-bordered w-full max-w-sm"
          data-theme="light"
          name="otherIncome.incomeType"
          onChange={handleFormChange}
        >
          <option disabled selected>
            Jenis Pendapatan
          </option>
          <option value="bantuan">Bantuan</option>
          <option value="denda">Denda</option>
          <option value="investasi">Investasi</option>
        </select>
        <input
          type="date"
          placeholder="Tanggal Setoran"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="otherIncome.date"
          onChange={handleFormChange}
        />
        <input
          type="text"
          placeholder="Jumlah Pendapatan"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="otherIncome.nominal"
          onChange={handleFormChange}
        />
        <input
          type="text"
          placeholder="Sumber Pendapatan"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="otherIncome.incomeSource"
          onChange={handleFormChange}
        />
        <input
          type="file"
          label="Upload File"
          className="file-input file-input-bordered w-full max-w-xs"
          data-theme="light"
          name="otherIncome.file"
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
              <th>Jenis Pendapatan</th>
              <th>Sumber Pendapatan</th>
              <th>Tanggal</th>
              <th>Jumlah</th>
              <th>Bukti</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pendapatan
              .filter((item) => item.type == "otherIncome")
              .map((item) => (
                <>
                  <tr>
                    <th className="border-r border-slate-200">
                      {item.otherIncome.incomeType}
                    </th>
                    <td className="border-r border-slate-200">
                      {item.otherIncome.incomeSource}
                    </td>
                    <td className="border-r border-slate-200">
                      {item.otherIncome.date
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </td>
                    <td className="border-r border-slate-200">
                      Rp. {item.otherIncome.nominal.toLocaleString()}
                    </td>
                    <td className="border-r border-slate-200">
                      {item.otherIncome.file.length > 30 ? item.otherIncome.file.slice(0, 30) + "..." : item.otherIncome.file}
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
              ))}
            <tr>
              <td className="border-r border-slate-200 font-bold">
                Total Pendapatan
              </td>
              <td colSpan={5} className="text-center">
                Rp. {totalPendapatan.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal Edit */}
      <dialog id="modal_edit_income" className="modal">
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
                Jenis Pendapatan
              </option>
              <option value="bantuan">Bantuan</option>
              <option value="denda">Denda</option>
              <option value="investasi">Investasi</option>
            </select>
            <input
              type="date"
              placeholder="Tanggal Setoran"
              className="input input-bordered w-full max-w-lg"
              name="date"
              onChange={handleFormEditChange}
              value={formEdit.otherIncome.date}
            />
            <input
              type="text"
              placeholder="Jumlah Pendapatan"
              className="input input-bordered w-full max-w-lg"
              name="nominal"
              onChange={handleFormEditChange}
              value={formEdit.otherIncome.nominal}
            />
            <input
              type="text"
              placeholder="Sumber Pendapatan"
              className="input input-bordered w-full max-w-lg"
              name="incomeSource"
              onChange={handleFormEditChange}
              value={formEdit.otherIncome.incomeSource}
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

export default PendapatanLain;
