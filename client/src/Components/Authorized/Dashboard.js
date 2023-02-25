import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BarChart from "./Dashboard/BarChart";

function Dashboard() {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!token) {
      logout();
    } else {
      axios
        .get(`/api/sales`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  function logout() {
    // history.push("/login");
    window.location.href = "/login";
    window.location.reload();
  }

  return (
    <div className="sm:grid sm:grid-col-4">
      <div>
        <div className="text-black text-4xl">Stock Data</div>
        <div>
          <BarChart data={data} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
