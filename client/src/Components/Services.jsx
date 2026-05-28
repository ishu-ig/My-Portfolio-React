import React, { useEffect } from "react";
import { getService } from "../Redux/ActionCreators/ServiceActionCreators";
import { useDispatch, useSelector } from "react-redux";
import "aos/dist/aos.css";
import AOS from "aos";
import { Link } from "react-router-dom";

export default function Service() {
  let ServiceStateData = useSelector((state) => state.ServiceStateData);
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getService());

    // Initialize AOS
    AOS.init({ duration: 1000, once: false });
    AOS.refresh();
  }, [dispatch]);

  return (
    <section id="services" className="services-section py-5" >
      <div className="container text-center">
        <h2 className="section-title " data-aos="fade-up" style={{ color: "var(--text-color)" }}>
          Our Services
        </h2>

        <div className="title-shape" data-aos="fade-up" data-aos-delay={100}>
          <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        <p
          className="section-description mb-3"
          data-aos="fade-up"
          data-aos-delay={200}
          style={{ color: "var(--text-color)" }}
        >
          Discover how our AI-driven solutions enhance your health and
          well-being.
        </p>

        <div className="row g-4 mt-5 justify-content-center">
          {ServiceStateData.filter((x) => x.active).map((service, index) => (
            <div
              className="col-6 col-md-6 col-lg-4" // UPDATED → 2 per row on mobile
              key={service._id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className="service-card"
                style={{
                  color: "var(--text-color)",
                }}
              >
                <div className="service-icon">
                  <i className={service.icon}></i>
                </div>

                <h3 className="service-title">{service.name}</h3>

                <p className="service-description hide-mobile">
                  {service.shortDescription}
                </p>

                <Link
                  to={`/serviceDetail/${service._id}`}
                  className="btn btn-secondary py-2 service-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
