import React, { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "../../lib/Toast";

const Operasional = () => {
  const [operational, setOperational] = useState([]);
  const [form, setForm] = useState({
    type: "operational",
    operational: {
      information: "",
      transactionDate: "",
      nominal: 0,
      category: "",
      additionalInformation: "",
    },
  });
  const [formEdit, setFormEdit] = useState({
    id: "",
    type: "operational",
    operational: {
      information: "",
      transactionDate: "",
      nominal: 0,
      category: "",
      additionalInformation: "",
    },
  });

  const fetchOperational = async () => {
    const response = await axios.get("http://localhost:5000/api/expense");
    setOperational(response.data);
  };

  useEffect(() => {
    fetchOperational();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const key = name.split(".")[1];
    setForm((prevForm) => ({
      ...prevForm,
      operational: {
        ...prevForm.operational,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if(
      form.operational.information === "" ||
      form.operational.transactionDate === "" ||
      form.operational.nominal === 0 ||
      form.operational.category === ""
    ) {
      showToast("error", "Data tidak boleh kosong");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/expense", form);
      fetchOperational();
      showToast("success", "Data berhasil ditambahkan");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expense/${id}`);
      fetchOperational();
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
      operational: {
        ...prevFormEdit.operational,
        [name]: value,
      },
    }));
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/expense/${formEdit.id}`,
        formEdit
      );
      fetchOperational();
      showToast("success", "Data berhasil diubah");
      document.getElementById("modal_edit_operational").close();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (item) => {
    console.log(item);
    setFormEdit({
      id: item._id,
      type: "operational",
      operational: {
        information: item.operational.information,
        transactionDate: item.operational.transactionDate,
        nominal: item.operational.nominal,
        category: item.operational.category,
        additionalInformation: item.operational.additionalInformation,
      },
    });

    document.getElementById("modal_edit_operational").showModal();
  };

  return (
    <div className="flex">
      {/* Input */}
      <div className="flex flex-col gap-5 min-w-80 items-end">
        <input
          type="text"
          placeholder="Keterangan"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="operational.information"
          onChange={handleFormChange}
        />
        <input
          type="date"
          placeholder="Tanggal Transaksi"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="operational.transactionDate"
          onChange={handleFormChange}
        />
        <input
          type="text"
          placeholder="Nominal Pengeluaran"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="operational.nominal"
          onChange={handleFormChange}
        />
        <select
          className="select select-bordered w-40 max-w-sm"
          data-theme="light"
          name="operational.category"
          onChange={handleFormChange}
        >
          <option disabled selected>
            Pilih Kategori
          </option>
          <option value="biaya administrasi">Biaya administrasi</option>
          <option value="operasional usaha">Operasional usaha</option>
          <option value="biaya umum">Biaya umum</option>
        </select>
        <textarea
          className="textarea textarea-bordered textarea-md w-full max-w-sm min-h-40"
          placeholder="Keterangan Tambahan"
          data-theme="light"
          name="operational.additionalInformation"
          onChange={handleFormChange}
        ></textarea>

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
              <th>Keterangan</th>
              <th>Tanggal Transaksi</th>
              <th>Nominal</th>
              <th>Kategori</th>
              <th>Keterangan Tambahan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {operational
              .filter((item) => item.type == "operational")
              .map((item) => (
                <>
                  <tr>
                    <th className="border-r border-slate-200">
                      {item.operational.information}
                    </th>
                    <td className="border-r border-slate-200">
                      {item.operational.transactionDate
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </td>
                    <td className="border-r border-slate-200">
                      Rp. {item.operational.nominal.toLocaleString()}
                    </td>
                    <td className="border-r border-slate-200">
                      {item.operational.category}
                    </td>
                    <td className="border-r border-slate-200">
                      {item.operational.additionalInformation !== ""
                        ? item.operational.additionalInformation
                        : "-"}
                    </td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-secondary min-h-0 h-8"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-error min-h-0 h-8"
                        onClick={() => handleDelete(item._id)}
                      >
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
      <dialog id="modal_edit_operational" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-center mb-5">
            Ubah Data Operasional
          </h3>

          <div className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Nama Pelanggan"
              className="input input-bordered w-full max-w-lg"
              name="information"
              value={formEdit.operational.information}
              onChange={handleFormEditChange}
            />

            <input
              type="date"
              placeholder="Tanggal Transaksi"
              className="input input-bordered w-full max-w-lg"
              name="transactionDate"
              value={formEdit.operational.transactionDate.slice(0, 10)}
              onChange={handleFormEditChange}
            />

            <input
              type="text"
              placeholder="Nominal Pengeluaran"
              className="input input-bordered w-full max-w-lg"
              name="nominal"
              value={formEdit.operational.nominal}
              onChange={handleFormEditChange}
            />

            <select
              className="select select-bordered w-40 max-w-lg"
              name="category"
              onChange={handleFormEditChange}
            >
              <option disabled selected>
                Pilih Kategori
              </option>
              <option value="biaya administrasi">Biaya administrasi</option>
              <option value="operasional usaha">Operasional usaha</option>
              <option value="biaya umum">Biaya umum</option>
            </select>

            <textarea
              className="textarea textarea-bordered textarea-md w-full max-w-lg min-h-40"
              placeholder="Keterangan Tambahan"
              name="additionalInformation"
              value={formEdit.operational.additionalInformation}
              onChange={handleFormEditChange}
            ></textarea>

            <button className="btn btn-primary" onClick={handleSubmitEdit}>
              Simpan Perubahan
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

export default Operasional;
