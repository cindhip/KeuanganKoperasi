import React, { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "../../lib/Toast";

const Simpanan = () => {
  const [simpanan, setSimpanan] = useState([]);
  const [member, setMember] = useState([]);
  const [form, setForm] = useState({
    type: "saving",
    saving: {
      member: "",
      depositDate: "",
      principalDeposit: 0,
      mandatoryDeposit: 0,
      voluntaryDeposit: 0,
    },
  });

  const [formEdit, setFormEdit] = useState({
    id: "",
    type: "saving",
    saving: {
      member: "",
      depositDate: "",
      principalDeposit: 0,
      mandatoryDeposit: 0,
      voluntaryDeposit: 0,
    },
  });

  const fetchSimpanan = async () => {
    const response = await axios.get(`https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/income`);
    setSimpanan(response.data);
  };

  const fetchAnggota = async () => {
    const response = await axios.get(`https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/member`);
    setMember(response.data);
  };

  useEffect(() => {
    fetchSimpanan();
    fetchAnggota();
  }, []);

  const totalSimpanan = simpanan.reduce((total, item) => {
    if (item.type === "saving") {
      return (
        total +
        (item.saving.principalDeposit +
          item.saving.mandatoryDeposit +
          item.saving.voluntaryDeposit)
      );
    }
    return total;
  }, 0);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const key = name.split(".")[1]; // Ambil kunci setelah 'saving.'
    setForm((prevForm) => ({
      ...prevForm,
      saving: {
        ...prevForm.saving,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (
      form.saving.member === "" ||
      form.saving.depositDate === "" ||
      form.saving.principalDeposit === 0 ||
      form.saving.mandatoryDeposit === 0 ||
      form.saving.voluntaryDeposit === 0
    ) {
      showToast("error", "Data tidak boleh kosong");
      return;
    }
    try {
      await axios.post(`https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/income`, form);
      fetchSimpanan();

      const getLatestSavingId = await axios.get(
        `https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/income`
      );
      const getSavingId =
        getLatestSavingId.data[getLatestSavingId.data.length - 1]._id;

      await axios.put(
        `https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/member/${form.saving.member}/saving`,
        { savings: `${getSavingId}` }
      );
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
      saving: {
        ...prevFormEdit.saving,
        [name]: value,
      },
    }));
  };

  const handleSubmitEdit = async () => {
    console.log(formEdit);
    try {
      await axios.put(
        `https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/income/${formEdit.id}`,
        formEdit
      );
      fetchSimpanan();
      showToast("success", "Data berhasil diubah");
      document.getElementById("modal_edit_saving").close();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSavingClick = (item) => {
    setFormEdit({
      id: item._id,
      type: "saving",
      saving: {
        member: item.saving.member._id || "",
        depositDate: item.saving.depositDate.slice(0, 10) || "",
        principalDeposit: item.saving.principalDeposit || 0,
        mandatoryDeposit: item.saving.mandatoryDeposit || 0,
        voluntaryDeposit: item.saving.voluntaryDeposit || 0,
      },
    });
    document.getElementById("modal_edit_saving").showModal();
  };

  // Delete
  const deleteSaving = async (id) => {
    const getMemberId = await simpanan.filter((item) => item._id == id)[0]
      .saving.member._id;
    try {
      await axios.delete(
        `https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/member/${getMemberId}/saving`,
        {
          params: {
            savings: id, // Mengirim id saving melalui query params
          },
        }
      );

      await axios.delete(`https://prior-krystal-woxyin-c0aefc03.koyeb.app/api/income/${id}`);
      fetchSimpanan();
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
          name="saving.member"
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
          placeholder="Tanggal Setoran"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="saving.depositDate"
          onChange={handleFormChange}
        />
        <input
          type="text"
          placeholder="Nominal Simpanan Pokok"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="saving.principalDeposit"
          onChange={handleFormChange}
        />
        <input
          type="text"
          placeholder="Nominal Simpanan Wajib"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="saving.mandatoryDeposit"
          onChange={handleFormChange}
        />
        <input
          type="text"
          placeholder="Nominal Simpanan Sukarela"
          className="input input-bordered w-full max-w-sm"
          data-theme="light"
          name="saving.voluntaryDeposit"
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
                Tanggal Setoran
              </th>
              <th colSpan={3} className="text-sm">
                Simpanan
              </th>
              <th rowSpan={2} className="text-sm">
                Total Simpanan
              </th>
              <th rowSpan={2} className="text-sm">
                Aksi
              </th>
            </tr>
            <tr>
              <th>Pokok</th>
              <th>Wajib</th>
              <th>Sukarela</th>
            </tr>
          </thead>
          <tbody>
            {simpanan
              .filter((item) => item.type == "saving")
              .map((item) => (
                <>
                  <tr>
                    <th className="border-r border-slate-200">
                      {item.saving.member.name}
                    </th>
                    <td className="border-r border-slate-200">
                      {item.saving.depositDate
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </td>
                    <td className="border-r border-slate-200">
                      {item.saving.principalDeposit.toLocaleString()}
                    </td>
                    <td className="border-r border-slate-200">
                      {item.saving.mandatoryDeposit.toLocaleString()}
                    </td>
                    <td className="border-r border-slate-200">
                      {item.saving.voluntaryDeposit.toLocaleString()}
                    </td>
                    <td className="border-r border-slate-200">
                      {(
                        item.saving.principalDeposit +
                        item.saving.mandatoryDeposit +
                        item.saving.voluntaryDeposit
                      ).toLocaleString()}
                    </td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-secondary min-h-0 h-8"
                        onClick={() => handleEditSavingClick(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-error min-h-0 h-8"
                        onClick={() => deleteSaving(item._id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                </>
              ))}
            <tr>
              <td className="border-r border-slate-200 font-bold">
                Total Simpanan
              </td>
              <td colSpan={6} className="text-center">
                Rp. {totalSimpanan.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <dialog id="modal_edit_saving" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-center mb-5">
            Edit Data Simpanan
          </h3>

          <div className="flex flex-col gap-5">
            <input
              type="date"
              name="depositDate"
              value={formEdit.saving.depositDate}
              onChange={handleFormEditChange}
              className="input input-bordered w-full max-w-lg"
              placeholder="Tanggal Deposit"
            />

            <input
              type="number"
              name="principalDeposit"
              value={formEdit.saving.principalDeposit}
              onChange={handleFormEditChange}
              className="input input-bordered w-full max-w-lg"
              placeholder="Simpanan Pokok"
            />

            <input
              type="number"
              name="mandatoryDeposit"
              value={formEdit.saving.mandatoryDeposit}
              onChange={handleFormEditChange}
              className="input input-bordered w-full max-w-lg"
              placeholder="Simpanan Wajib"
            />

            <input
              type="number"
              name="voluntaryDeposit"
              value={formEdit.saving.voluntaryDeposit}
              onChange={handleFormEditChange}
              className="input input-bordered w-full max-w-lg"
              placeholder="Simpanan Sukarela"
            />

            <button
              className="btn btn-primary"
              onClick={handleSubmitEdit}
            >
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

export default Simpanan;
