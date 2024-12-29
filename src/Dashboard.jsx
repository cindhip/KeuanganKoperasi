import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Beranda from "./components/beranda/Beranda";
import Pemasukan from "./components/pemasukan/Pemasukan";
import Pengeluaran from "./components/pengeluaran/Pengeluaran";
import Pinjaman from "./components/pinjaman/Pinjaman";
import DataAnggota from "./components/dataAnggota/DataAnggota";
import Laporan from "./components/laporan/Laporan";
import { FiHome, FiFilePlus, FiFileMinus, FiBook, FiUsers, FiBookOpen } from "react-icons/fi";
import { showToast } from "./components/lib/Toast";


function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    setTimeout(() => {
      navigate("/login");
      showToast("success", "Berhasil logout");
    }, 500);
  }
  return (
      <div className="drawer lg:drawer-open">

        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col p-5">
          <Routes>
            <Route path="/" element={<Beranda />} />
            <Route path="/pemasukan" element={<Pemasukan />} />
            <Route path="/pengeluaran" element={<Pengeluaran />} />
            <Route path="/pinjaman" element={<Pinjaman />} />
            <Route path="/data-anggota" element={<DataAnggota />} />
            <Route path="/laporan" element={<Laporan />} />
          </Routes>
        </div>
        <div className="drawer-side">
          <ul className="menu bg-base-200 text-base-content pt-16 min-h-full w-80 p-4 leading-7 gap-4 text-lg">
            <li className="pointer-events-none mb-7">
              <div className="avatar flex flex-col justify-center items-center gap-3">
                <div className="w-24 rounded-full">
                  <img src="/avatar2.png" alt="avatar" />
                </div>
                <h3 className="text-xl font-semibold">Admin</h3>
              </div>
            </li>
            <li>
              <Link to="/" className={({ isActive }) => (isActive ? "bg-neutral rounded-lg" : "")}>
                <FiHome className="mr-2" />
                Beranda
              </Link>
            </li>
            <li>
              <Link to="/pemasukan" className={({ isActive }) => (isActive ? "bg-neutral rounded-lg" : "")}>
                <FiFilePlus className="mr-2" />
                Kas Masuk
              </Link>
            </li>
            <li>
              <Link to="/pengeluaran" className={({ isActive }) => (isActive ? "bg-neutral rounded-lg" : "")}>
                <FiFileMinus className="mr-2" />
                Kas Keluar
              </Link>
            </li>
            <li>
              <Link to="/pinjaman" className={({ isActive }) => (isActive ? "bg-neutral rounded-lg" : "")}>
                <FiBook className="mr-2" />
                Catatan Simpan Pinjam
              </Link>
            </li>
            <li>
              <Link to="/data-anggota" className={({ isActive }) => (isActive ? "bg-neutral rounded-lg" : "")}>
                <FiUsers className="mr-2" />
                Data Anggota Koperasi
              </Link>
            </li>
            <li>
              <Link to="/laporan" className={({ isActive }) => (isActive ? "bg-neutral rounded-lg" : "")}>
                <FiBookOpen className="mr-2" />
                Laporan Keuangan
              </Link>
            </li>

            <button className="btn btn-outline btn-error mt-[16.5rem] w-full" onClick={handleLogout}>Logout</button>
          </ul>
        </div>
      </div>
  );
}

export default Dashboard;
