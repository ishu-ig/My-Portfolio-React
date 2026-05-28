import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import { createAchievement, getAchievement } from '../../Redux/ActionCreators/AchievementActionCreators'

export default function AdminCreateAchievement() {
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
        icon: "Icon Field is Mandatory",
        label: "Label Field is Mandatory",
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
        icon: error.icon,
        label: error.label,
        ...(data.type === "counter"
            ? { target: error.target }
            : {}),

        ...(data.type === "static"
            ? { stat: error.stat }
            : {})
    }

    let errorItem =
        Object.values(relevantErrors)
            .find(x => x !== "")

    if (errorItem) {
        setShow(true)
        return
    }

    const payload = {
        ...data,
        target: data.type === "counter"
            ? Number(data.target)
            : null,

        stat: data.type === "static"
            ? data.stat
            : null,

        order: Number(data.order) || 0
    }

    dispatch(createAchievement(payload))

    setTimeout(() => {
        navigate("/achievement")
    }, 500)
}

    useEffect(() => {
        (() => {
            dispatch(getAchievement())
        })()
    }, [])

    console.log(AchievementStateData)

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Create Achievement{' '}
                    <Link to="/achievement"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link>
                </h5>

                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* Label */}
                        <div className="mb-3">
                            <label className="fw-bold">Label*</label>
                            <input
                                type="text"
                                name="label"
                                onChange={getInputData}
                                placeholder="e.g. Projects Completed"
                                className={`form-control ${show && error.label ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.label && <p className="text-danger mt-1">{error.label}</p>}
                        </div>

                        {/* Icon */}
                        <div className="mb-3">
                            <label className="fw-bold">Icon* <small className="text-muted fw-normal">(e.g. bi bi-trophy)</small></label>
                            <input
                                type="text"
                                name="icon"
                                onChange={getInputData}
                                placeholder="Enter Bootstrap Icon Class"
                                className={`form-control ${show && error.icon ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.icon && <p className="text-danger mt-1">{error.icon}</p>}
                        </div>

                        {/* Type */}
                        <div className="mb-3">
                            <label className="fw-bold">Type*</label>
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
                                <label className="fw-bold">Target* <small className="text-muted fw-normal">(number to count up to)</small></label>
                                <input
                                    type="number"
                                    name="target"
                                    onChange={getInputData}
                                    placeholder="e.g. 150"
                                    className={`form-control ${show && error.target ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.target && <p className="text-danger mt-1">{error.target}</p>}
                            </div>
                        )}

                        {/* Stat — only for static */}
                        {data.type === "static" && (
                            <div className="mb-3">
                                <label className="fw-bold">Stat* <small className="text-muted fw-normal">(badge text to display)</small></label>
                                <input
                                    type="text"
                                    name="stat"
                                    onChange={getInputData}
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
                            <button type="submit" className="btn btn-primary w-100 text-light">
                                <i className="fa fa-save"></i> Create Achievement
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}