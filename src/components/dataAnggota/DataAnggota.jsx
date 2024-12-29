import React, { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "../lib/Toast";

const DataAnggota = () => {
  const [allAnggota, setAllAnggota] = useState([]);
  const [anggota, setAnggota] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    entryDate: Date.now(),
    address: "",
    phone: "",
    status: "active",
    memberNumber: 0,
  })
  const [formEdit, setFormEdit] = useState({
    name: "",
    entryDate: "",
    address: "",
    phone: "",
    status: "",
    memberNumber: 0,
  })

  const fetchData = async () => {
    try {
      const response = await axios.get("https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/member/");
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  const handleSubmit = async () => {
    if(
      form.name === "" ||
      form.entryDate === "" ||
      form.address === "" ||
      form.phone === "" ||
      form.memberNumber === 0
    ) {
      showToast("error", "Data tidak boleh kosong");
      return;
    }
    try {
      await axios.post("https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/member/", form);
      fetchData();
      showToast("success", "Data berhasil ditambahkan");
    } catch (error) {
      console.log(error);
    }
  }

  // Edit
  const handleFormEditChange = (e) => {
    const { name, value } = e.target;
    setFormEdit((prevFormEdit) => ({
      ...prevFormEdit,
      [name]: value,
    }))
  }

  const handleSubmitEdit = async () => {
    try {
      await axios.put(`https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/member/${formEdit.id}`, formEdit);
      fetchData();
      showToast("success", "Data berhasil diubah");
      document.getElementById("modal_edit_member").close();
    } catch (error) {
      console.log(error);
    }
  }

  const handleEditClick = (item) => {
    setFormEdit({
      id: item._id,
      name: item.name,
      entryDate: item.entryDate.slice(0, 10),
      address: item.address,
      phone: item.phone,
      status: item.status,
      memberNumber: item.memberNumber,
    });
    document.getElementById("modal_edit_member").showModal();
  }

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/member/${id}`);
      fetchData();
      showToast("success", "Data berhasil dihapus");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="p-10 mb-10 bg-[#212C5F] rounded-xl text-center">
        <p className="text-3xl font-bold" onClick={() => console.log(anggota)}>
          Data Anggota Koperasi
        </p>
      </div>

      <div className="flex justify-between">
        <button
          className="btn btn-primary"
          onClick={() =>
            document.getElementById("modal_add_member").showModal()
          }
        >
          Tambah Anggota
        </button>

        <label
          className="input input-bordered flex items-center gap-2 w-72 mb-5"
          data-theme="light"
        >
          <input type="text" className="grow" placeholder="Search" 
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
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto w-full rounded-xl">
        <table className="table table-lg" data-theme="cupcake">
          {/* head */}
          <thead className="text-center" data-theme="dracula">
            <tr>
              <th rowSpan={2}>Nomor Anggota</th>
              <th rowSpan={2}>Nama Anggota</th>
              <th colSpan={2}>Data</th>
              <th rowSpan={2}>No. Telepon</th>
              <th rowSpan={2}>Alamat</th>
              <th rowSpan={2}>Aksi</th>
            </tr>
            <tr>
              <th>Tanggal Masuk</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {anggota.map((item) => (
              <>
                <tr>
                  <th className="border-r border-slate-200 text-center">
                    {item.memberNumber}
                  </th>
                  <th className="border-r border-slate-200">{item.name}</th>
                  <td className="border-r border-slate-200">
                    {item.entryDate.slice(0, 10).split("-").reverse().join("-")}
                  </td>
                  <td className="border-r border-slate-200">
                    {item.status === "active" ? "Aktif" : "Tidak Aktif"}
                  </td>
                  <td className="border-r border-slate-200">{item.phone}</td>
                  <td className="border-r border-slate-200">
                    {item.address}
                  </td>
                  <td className="flex gap-2">
                    <button className="btn btn-secondary min-h-0 h-8" onClick={() => handleEditClick(item)}>
                      Edit
                    </button>
                    <button className="btn btn-error min-h-0 h-8" onClick={() => handleDelete(item._id)}>Hapus</button>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
      <dialog id="modal_add_member" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-center mb-5">Tambah Data Anggota</h3>

          <div className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Nomor Anggota"
              className="input input-bordered w-full max-w-lg"
              name="memberNumber"
              onChange={handleFormChange}
            />

            <input
              type="text"
              placeholder="Nama Anggota"
              className="input input-bordered w-full max-w-lg"
              name="name"
              onChange={handleFormChange}
            />
            <input
              type="date"
              placeholder="Tanggal Masuk"
              className="input input-bordered w-full max-w-lg"
              name="entryDate"
              onChange={handleFormChange}
            />
            <input
              type="text"
              placeholder="Alamat"
              className="input input-bordered w-full max-w-lg"
              name="address"
              onChange={handleFormChange}
            />
            <input
              type="text"
              placeholder="Nomor Telepon"
              className="input input-bordered w-full max-w-lg"
              name="phone"
              onChange={handleFormChange}
            />

            <button className="btn btn-primary" onClick={handleSubmit}>Tambah Data</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="modal_edit_member" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-center mb-5">
            Ubah Data Anggota
          </h3>

          <div className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Nomor Anggota"
              className="input input-bordered w-full max-w-lg"
              name="memberNumber"
              value={formEdit.memberNumber}
              onChange={handleFormEditChange}
            />

            <input
              type="text"
              placeholder="Nama Anggota"
              className="input input-bordered w-full max-w-lg"
              name="name"
              value={formEdit.name}
              onChange={handleFormEditChange}
            />
            <input
              type="date"
              placeholder="Tanggal Masuk"
              className="input input-bordered w-full max-w-lg"
              name="entryDate"
              value={formEdit.entryDate}
              onChange={handleFormEditChange}
            />
            <input
              type="text"
              placeholder="Alamat"
              className="input input-bordered w-full max-w-lg"
              name="address"
              value={formEdit.address}
              onChange={handleFormEditChange}
            />
            <input
              type="text"
              placeholder="Nomor Telepon"
              className="input input-bordered w-full max-w-lg"
              name="phone"
              value={formEdit.phone}
              onChange={handleFormEditChange}
            />

            <button className="btn btn-primary" onClick={handleSubmitEdit}>
              Ubah Data
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

export default DataAnggota;
