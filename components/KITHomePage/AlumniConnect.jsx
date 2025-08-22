"use client";
import { motion } from "framer-motion";

export default function AlumniConnect() {
  return (
    <section className="py-4 bg-success bg-gradient overflow-hidden rounded">
      <motion.div
        className="d-flex align-items-center gap-4 text-white fw-semibold fs-4"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 20, // adjust speed
          ease: "linear",
        }}
        style={{ whiteSpace: "nowrap" }}
      >
        <span>CONNECT with your classmates on your Alumni Association</span>
        <button className="btn btn-light btn-lg fw-semibold px-4 rounded-pill shadow-sm">
          Register
        </button>
      </motion.div>
    </section>
  );
}
