import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEducation } from '../Redux/ActionCreators/EducationActionCreators';
import { getExperience } from '../Redux/ActionCreators/ExperienceActionCreators';


export default function Resume() {
    let EducationStateData = useSelector(state => state.EducationStateData)
    let dispatch = useDispatch()

    useEffect(()=>{
        (()=>{
            dispatch(getEducation())
        })()
    },[EducationStateData.length])
    let ExperienceStateData = useSelector(state => state.ExperienceStateData)

    useEffect(()=>{
        (()=>{
            dispatch(getExperience())
        })()
    },[ExperienceStateData.length])
    return (
        <section id="resume" className="resume-section py-5 "style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
            <div className="container text-center">
                <h2 className="section-title" style={{ color: "var(--text-color)" }}>Resume</h2>
                <div className="title-shape">
                    <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="currentColor" strokeWidth="2"></path>
                    </svg>
                </div>
                <p className="section-subtitle" style={{ color: "var(--text-color)" }}>Professional experience and educational background.</p>
            </div>

            <div className="container-fluid">
                <div className="resume-wrapper">

                    {/* Work Experience Section */}
                    <div className="resume-block">
                        <h2 className="block-title">Work Experience</h2>
                        <p className="lead" style={{ color: "var(--text-color)" }}>Highlights of my professional journey and contributions.</p>

                        <div className="timeline">
                            {ExperienceStateData.filter(x=>x.active).map((item, index) => (
                                <div key={item._id} className="timeline-item" data-aos="fade-up" data-aos-delay={item.delay}>
                                    <div className="timeline-left">
                                        <h4 className="company ">{item.companyName}</h4>
                                        <span className="period mobile-font" style={{ color: "var(--text-color)" }}>{item.startDate}-{item.endDate}</span>
                                    </div>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-right">
                                        <h3 className="position" style={{ color: "var(--text-color)" }}>{item.jobTitle}</h3>
                                        <p className="description mobile-font" style={{ color: "var(--text-color)" }}>{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="resume-block">
                        <h2 className="block-title" >Education</h2>
                        <p className="lead" style={{ color: "var(--text-color)" }}>Academic qualifications and learning journey.</p>

                        <div className="timeline">
                            {EducationStateData.filter(x=>x.active).map((item, index) => (
                                <div key={index} className="timeline-item" data-aos="fade-up" data-aos-delay={item.delay}>
                                    <div className="timeline-left">
                                        <h4 className="company">{item.instituteName}</h4>
                                        <span className="period" style={{ color: "var(--text-color)" }}>{item.startDate}-{item.endDate}</span>
                                    </div>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-right">
                                        <h3 className="position" style={{ color: "var(--text-color)" }}>{item.degreeName}</h3>
                                        <p className="description" style={{ color: "var(--text-color)" }}>{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
