"use client";
import { motion } from "framer-motion";
import Link from "next/link";


export default function AlumniConnect() {
  return (
    <section className="py-4  bg-gradient overflow-hidden rounded">
      <motion.div
        className="d-flex align-items-center gap-4 text-white fw-semibold fs-10 text-orange"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 15, // adjust speed
          ease: "linear",
        }}
        // style={{ whiteSpace: "nowrap" }}
      >
        <span className="text-orange scroll-connect">
          CONNECT with your classmates on your Alumni Association
        </span>
        <div className="call-to-btn text-start mt-0">
          <Link className="rbt-btn btn-gradient hover-icon-reverse radius-round" href="#">
            <span className="icon-reverse-wrapper">
              <span className="btn-text">Register Now</span>
              <span className="btn-icon">
                <i className="feather-arrow-right"></i>
              </span>
              <span className="btn-icon">
                <i className="feather-arrow-right"></i>
              </span>
            </span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
