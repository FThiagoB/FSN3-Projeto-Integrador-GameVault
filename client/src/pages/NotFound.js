import React from "react";
import { Link } from "react-router-dom";
const NotFoundPage = () => (
  <div
    style={{ height: "90vh", width: "100%" }}
    className="d-flex flex-column mx-auto text-center align-items-center justify-content-center"
  >
    <div>
      {/* ========== MAIN CONTENT ========== */}
      <main id="content" className="flex-fill">
        <div className="text-center py-5 px-3 px-md-5">
          <h1 className="display-1 fw-bold text-dark">404</h1>
          <p className="mt-3 text-secondary">Oops, something went wrong.</p>
          <p className="text-secondary">Sorry, we couldn’t find your page.</p>
          <div className="mt-4 d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2 gap-sm-3">
            <Link
              to="/"
              className="btn btn-primary btn-lg d-inline-flex align-items-center"
            >
              <svg
                className="me-2"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  </div>
);

export default NotFoundPage;
