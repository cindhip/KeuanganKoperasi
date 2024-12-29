import React, { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "../../lib/Toast";

const Penjualan = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [form, setForm] = useState({
    type: "sale",
    sale: {
      customerName: "",
      dateTransaction: "",
      description: "",
      category: "",
      nominal: 0,
    },
  });

  const [formEdit, setFormEdit] = useState({
    id: "",
    type: "sale",
    sale: {
      customerName: "",
      dateTransaction: "",
      description: "",
      category: "",
      nominal: 0,
    },
  });

  const fetchPenjualan = async () => {
    const response = await axios.get("http://localhost:5000/api/income");
    setPenjualan(response.data);
  };

  useEffect(() => {
    fetchPenjualan();
  }, []);

  const totalPenjualan = penjualan.reduce((total, item) => {
    if (item.type === "sale") {
      return total + item.sale.nominal;
    }
    return total;
  }, 0);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const key = name.split(".")[1];
    setForm((prevForm) => ({
      ...prevForm,
      sale: {
        ...prevForm.sale,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (
      form.sale.customerName === "" ||
      form.sale.dateTransaction === "" ||
      form.sale.nominal === 0 ||
      form.sale.category === "" ||
      form.sale.description === ""
    ) {
      showToast("error", "Data tidak boleh kosong");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/income", form);
      fetchPenjualan();
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
      sale: {
        ...prevFormEdit.sale,
        [name]: value,
      },
    }));
  };

    const handleSubmitEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/income/${formEdit.id}`, formEdit);
      fetchPenjualan();
      showToast("success", "Data berhasil diubah");
      document.getElementById("modal_edit_sale").close();
    } catch (error) {
      console.log(error);
    }
  }

  const handleEditClick = (item) => {
    setFormEdit({
      id: item._id,
      type: "sale",
      sale: {
        customerName: item.sale.customerName || "",
        dateTransaction: item.sale.dateTransaction.slice(0, 10) || "",
        description: item.sale.description || "",
        category: item.sale.category || "",
        nominal: item.sale.nominal || 0,
      },
    });
    document.getElementById("modal_edit_sale").showModal();
  };
  
  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/income/${id}`);
      fetchPenjualan();
      showToast("success", "Data berhasil dihapus");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      {/* Input */}
      <div className="flex flex-col gap-5 min-w-80 items-end">
        <input
          type="text"
          placeholder="Nama Pelanggan"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="sale.customerName"
          onChange={handleFormChange}
        />
        <input
          type="date"
          placeholder="Tanggal Transaksi"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="sale.dateTransaction"
          onChange={handleFormChange}
        />
        <input
          type="text"
          placeholder="Nominal Barang/Jasa"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="sale.nominal"
          onChange={handleFormChange}
        />
        <select
          className="select select-bordered w-40 max-w-sm"
          data-theme="light"
          name="sale.category"
          onChange={handleFormChange}
        >
          <option disabled selected>
            Pilih Kategori
          </option>
          <option value="sembako">Sembako</option>
          <option value="produk olahan">Produk Olahan</option>
        </select>
        <textarea
          className="textarea textarea-bordered textarea-md w-full max-w-sm min-h-40"
          placeholder="Deskripsi Barang"
          data-theme="light"
          name="sale.description"
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
              <th>Nama Pelanggan</th>
              <th>Tanggal Transaksi</th>
              <th>Deskripsi</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {penjualan
              .filter((item) => item.type == "sale")
              .map((item) => (
                <>
                  <tr>
                    <th
                      className="border-r border-slate-200"
                      onClick={() => console.log(item)}
                    >
                      {item.sale.customerName}
                    </th>
                    <td className="border-r border-slate-200">
                      {item.sale.dateTransaction
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </td>
                    <td className="border-r border-slate-200">
                      {item.sale.description}
                    </td>
                    <td className="border-r border-slate-200">
                      {item.sale.category}
                    </td>
                    <td className="border-r border-slate-200">
                      Rp. {item.sale.nominal.toLocaleString()}
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
                Total Penjualan
              </td>
              <td colSpan={5} className="text-center">
                Rp. {totalPenjualan.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <dialog id="modal_edit_sale" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-center mb-5">
            Ubah Data Penjualan
          </h3>

          <div className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Nama Pelanggan"
              className="input input-bordered w-full max-w-lg"
              name="customerName"
              value={formEdit.sale.customerName}
              onChange={handleFormEditChange}
            />

            <input
              type="date"
              placeholder="Tanggal Transaksi"
              className="input input-bordered w-full max-w-lg"
              name="dateTransaction"
              value={formEdit.sale.dateTransaction}
              onChange={handleFormEditChange}
            />

            <input
              type="text"
              placeholder="Deskripsi"
              className="input input-bordered w-full max-w-lg"
              name="description"
              value={formEdit.sale.description}
              onChange={handleFormEditChange}
            />

            <input
              type="text"
              placeholder="Kategori"
              className="input input-bordered w-full max-w-lg"
              name="category"
              value={formEdit.sale.category}
              onChange={handleFormEditChange}
            />

            <input
              type="number"
              placeholder="Nominal"
              className="input input-bordered w-full max-w-lg"
              name="nominal"
              value={formEdit.sale.nominal}
              onChange={handleFormEditChange}
            />

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

export default Penjualan;
