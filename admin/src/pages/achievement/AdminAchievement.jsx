import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

import { deleteAchievement, getAchievement } from "../../Redux/ActionCreators/AchievementActionCreators";

export default function AdminAchievement() {
    let AchievementStateData = useSelector(state => state.AchievementStateData);
    let dispatch = useDispatch();
    let [flag, setFlag] = useState(false);

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteAchievement({ _id }));
            getAPIData();
            setFlag(!flag);
        }
    }

    function getAPIData() {
        dispatch(getAchievement());
        let time = setTimeout(() => {
            if (!$.fn.DataTable.isDataTable('#DataTable')) {
                $('#DataTable').DataTable();
            }
        }, 500);
        return time;
    }

    useEffect(() => {
        let time = getAPIData();
        return () => {
            clearTimeout(time);
            if ($.fn.DataTable.isDataTable('#DataTable')) {
                $('#DataTable').DataTable().destroy();
            }
        };
    }, [AchievementStateData.length]);

    return (
        <>
            <div className="container-fluid">
                {/* Header */}
                <h5 className="text-center text-light bg-primary p-3">
                    Achievement
                    <Link to="/achievement/create">
                        <i className="fa fa-plus text-light float-end pt-1"></i>
                    </Link>
                </h5>

                {/* Table */}
                <div className="table-responsive mt-3">
                    <table id="DataTable" className="table table-striped table-hover table-bordered text-center">
                        <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                            <tr>
                                <th>Id</th>
                                <th>Icon</th>
                                <th>Label</th>
                                <th>Type</th>
                                <th>Target</th>
                                <th>Stat</th>
                                <th>Order</th>
                                <th>Active</th>
                                <th>Update</th>
                                {localStorage.getItem("role") === "Super Admin" ? <th>Delete</th> : ""}
                            </tr>
                        </thead>
                        <tbody>
                            {AchievementStateData.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>
                                        <i className={item.icon}></i>
                                        <small className="ms-1 text-muted">{item.icon}</small>
                                    </td>
                                    <td>{item.label}</td>
                                    <td>
                                        <span className={`badge ${item.type === "counter" ? "bg-info" : "bg-secondary"}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td>{item.type === "counter" ? item.target ?? "—" : "—"}</td>
                                    <td>{item.type === "static"  ? item.stat  ?? "—" : "—"}</td>
                                    <td>{item.order}</td>
                                    <td className={item.active ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                        {item.active ? "Yes" : "No"}
                                    </td>
                                    <td>
                                        <Link to={`/achievement/update/${item._id}`} className="btn btn-primary text-light btn-sm">
                                            <i className="fa fa-edit fs-5"></i>
                                        </Link>
                                    </td>
                                    {localStorage.getItem("role") === "Super Admin" ? (
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>
                                                <i className="fa fa-trash fs-5"></i>
                                            </button>
                                        </td>
                                    ) : ""}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}