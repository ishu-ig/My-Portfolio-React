import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import { updateAchievement, getAchievement } from '../../Redux/ActionCreators/AchievementActionCreators'

export default function AdminUpdateAchievement() {
    let { _id } = useParams()

    let [data, setData] = useState({
        icon: "",
        label: "",
        type: "counter",
        target: "",
        stat: "",
        order: 0,
        active: true
    })
    let [error, setError] = useState({
        icon: "",
        label: "",
        target: "",
        stat: ""
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    let AchievementStateData = useSelector(state => state.AchievementStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.value

        if (!["active", "type"].includes(name)) {
            setError((old) => ({
                ...old,
                [name]: formValidator(e)
            }))
        }
        setData((old) => ({
            ...old,
            [name]: name === "active" ? (value === "1" ? true : false) : value
        }))
    }

    // Update conditional validation when type changes
    useEffect(() => {
        setError((old) => ({
            ...old,
            target: data.type === "counter" && !data.target ? "Target Field is Mandatory" : "",
            stat:   data.type === "static"  && !data.stat   ? "Stat Field is Mandatory"   : ""
        }))
    }, [data.type, data.target, data.stat])

    function postSubmit(e) {
        e.preventDefault()

        const relevantErrors = {
            icon:  error.icon,
            label: error.label,
            ...(data.type === "counter" ? { target: error.target } : {}),
            ...(data.type === "static"  ? { stat:   error.stat   } : {})
        }

        let errorItem = Object.values(relevantErrors).find(x => x !== "")
        if (errorItem) {
            setShow(true)
        } else {
            let item = AchievementStateData.find(x => x._id !== _id && x.label.toLocaleLowerCase() === data.label.toLocaleLowerCase())
            if (item) {
                setShow(true)
                setError((old) => ({ ...old, label: "Achievement Already Exist" }))
            } else {
                dispatch(updateAchievement({
    _id,
    ...data,
    target: data.type === "counter"
        ? Number(data.target)
        : null,

    stat: data.type === "static"
        ? data.stat
        : null,

    order: Number(data.order) || 0
}))
                navigate("/achievement")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getAchievement())
            if (AchievementStateData.length) {
                let item = AchievementStateData.find(x => x._id === _id)
                if (item)
                    setData({
                        ...item,
                        target: item.target ?? "",
                        stat:   item.stat   ?? ""
                    })
            }
        })()
    }, [])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Update Achievement{' '}
                    <Link to="/achievement"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link>
                </h5>

                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* Label */}
                        <div className="mb-3">
                            <label className="fw-bold">Label</label>
                            <input
                                type="text"
                                name="label"
                                onChange={getInputData}
                                value={data.label}
                                placeholder="e.g. Projects Completed"
                                className={`form-control ${show && error.label ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.label && <p className="text-danger mt-1">{error.label}</p>}
                        </div>

                        {/* Icon */}
                        <div className="mb-3">
                            <label className="fw-bold">Icon <small className="text-muted fw-normal">(e.g. bi bi-trophy)</small></label>
                            <div className="input-group">
                                <span className="input-group-text border-primary">
                                    <i className={data.icon}></i>
                                </span>
                                <input
                                    type="text"
                                    name="icon"
                                    onChange={getInputData}
                                    value={data.icon}
                                    placeholder="Enter Bootstrap Icon Class"
                                    className={`form-control ${show && error.icon ? 'border-danger' : 'border-primary'}`}
                                />
                            </div>
                            {show && error.icon && <p className="text-danger mt-1">{error.icon}</p>}
                        </div>

                        {/* Type */}
                        <div className="mb-3">
                            <label className="fw-bold">Type</label>
                            <select
                                name="type"
                                value={data.type}
                                onChange={getInputData}
                                className="form-select border-primary"
                            >
                                <option value="counter">Counter (animated number)</option>
                                <option value="static">Static (badge text)</option>
                            </select>
                        </div>

                        {/* Target — only for counter */}
                        {data.type === "counter" && (
                            <div className="mb-3">
                                <label className="fw-bold">Target <small className="text-muted fw-normal">(number to count up to)</small></label>
                                <input
                                    type="number"
                                    name="target"
                                    onChange={getInputData}
                                    value={data.target}
                                    placeholder="e.g. 150"
                                    className={`form-control ${show && error.target ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.target && <p className="text-danger mt-1">{error.target}</p>}
                            </div>
                        )}

                        {/* Stat — only for static */}
                        {data.type === "static" && (
                            <div className="mb-3">
                                <label className="fw-bold">Stat <small className="text-muted fw-normal">(badge text to display)</small></label>
                                <input
                                    type="text"
                                    name="stat"
                                    onChange={getInputData}
                                    value={data.stat}
                                    placeholder="e.g. Top Rated"
                                    className={`form-control ${show && error.stat ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.stat && <p className="text-danger mt-1">{error.stat}</p>}
                            </div>
                        )}

                        {/* Order & Active */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    onChange={getInputData}
                                    value={data.order}
                                    placeholder="Display order (0, 1, 2…)"
                                    className="form-control border-primary"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Active</label>
                                <select
                                    name="active"
                                    value={data.active ? "1" : "0"}
                                    onChange={getInputData}
                                    className="form-select border-primary"
                                >
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary w-100 text-light p-2">
                                <i className="fa fa-save"></i> Update Achievement
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}